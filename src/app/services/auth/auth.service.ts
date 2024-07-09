import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environment/environment';
import { ModalService } from '../../modal.service';
import { ConnexionData } from '../../models/utilisateur';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.API_URL + '/api/'; // URL de votre API

  constructor(
    private http: HttpClient, 
    private router: Router,
    private modalService: ModalService) {}

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

  logout() {
    this.modalService.close();
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    this.router.navigate(['/connexion']);
  }

  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  refreshToken(): Observable<any> {
    const refresh_token = localStorage.getItem('refresh_token');
    return this.http.post<any>(`${this.apiUrl}token/refresh`, { refresh_token }).pipe(
      tap(response => {
        if (response.token) {
          localStorage.setItem('access_token', response.token);
        }
      })
    );
  }
}
