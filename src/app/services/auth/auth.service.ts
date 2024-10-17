import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../../environment/environment';
import { ModalService } from '../../modal.service';
import { ConnexionData, InscriptionData } from '../../models/utilisateur';
import { NotifyService } from '../../notify.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.API_URL + '/api/'; // URL de votre API

  constructor(
    private http: HttpClient, 
    private router: Router,
    private notifyService: NotifyService) {}

  login(connexionData: ConnexionData): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}login_check`, connexionData).pipe(
      tap(response => {
        if (response.token && response.refresh_token) {
          // Stocker les tokens dans le localStorage ou sessionStorage
          localStorage.setItem('access_token', response.token);
          localStorage.setItem('refresh_token', response.refresh_token);
          this.router.navigate(['/']);
        }
      })
    );
  }

  inscription(inscriptionData: InscriptionData): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('email', inscriptionData.email);
    formData.append('prenom', inscriptionData.prenom);
    formData.append('nom', inscriptionData.nom);
    formData.append('password', inscriptionData.password);
    return this.http.post<any>(`${this.apiUrl}inscription`, formData).pipe(
      tap(() => {
        this.notifyService.open('Votre compte a bien été créé. Redirection en cours.', 'success', 5000);
        const connexionData: ConnexionData = {
          username: inscriptionData.email,
          password: inscriptionData.password
        };
        this.login(connexionData).subscribe();
      })
    );
  }

  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    this.router.navigate(['/connexion']);
  }

  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  refreshToken(): Observable<any> {
    const formData: FormData = new FormData();
    const refreshToken = localStorage.getItem('refresh_token');
    if (refreshToken !== null) {
      formData.append('refresh_token', refreshToken);
    }
    return this.http.post<any>(`${this.apiUrl}token/refresh`, formData).pipe(
      tap(response => {
        if (response.token) {
          localStorage.setItem('access_token', response.token);
          localStorage.setItem('refresh_token', response.refresh_token);
        }
      }),
      catchError((err) => {
        this.logout();
        return of(undefined);
      })
    );
  }
}
