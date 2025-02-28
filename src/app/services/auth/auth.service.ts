import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../../environment/environment';
import { ConnexionData, InscriptionData } from '../../models/utilisateur';
import { NotifyService } from '../../notify.service';
import { jwtDecode } from 'jwt-decode';

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
      }),
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          // Gestion spécifique pour l'erreur 401
          console.error('Erreur 401 : Identifiants incorrects.');
          this.notifyService.open('Erreur : Identifiants incorrects. Veuillez réessayer.', 'danger', 5000);
        } else {
          // Gestion d'autres erreurs
          console.error(`Erreur ${error.status} :`, error.message);
          this.notifyService.open('Une erreur est survenue. Veuillez réessayer plus tard.', 'danger', 5000);
        }
        // Retourner un Observable d'erreur pour arrêter le flux
        return throwError(() => new Error('Erreur lors de la tentative de connexion.'));
      })
    );
  }

  inscription(inscriptionData: InscriptionData): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('email', inscriptionData.email);
    formData.append('prenom', inscriptionData.prenom);
    formData.append('nom', inscriptionData.nom);
    formData.append('password', inscriptionData.password);
    formData.append('termsAccepted', inscriptionData.termsAccepted.toString());
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
    console.log('Logout triggered. Reason:');
    new Error().stack && console.error(new Error().stack);
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    this.router.navigate(['/connexion']);
  }

  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  getRoles(): string[] | null {
    const token = localStorage.getItem('access_token');
    if (token !== null) {
      const decodedToken = jwtDecode(token);
      return (decodedToken as any).roles || null;
    }
    return null;
  }

  refreshToken(): Observable<any> {
    const formData: FormData = new FormData();
    const refreshToken = localStorage.getItem('refresh_token');
    if (refreshToken !== null) {
      formData.append('refresh_token', refreshToken);
    }
    return this.http.post<any>(`${this.apiUrl}token/refresh`, formData).pipe(
      tap(response => {
        if (response.token && response.refresh_token) {
          localStorage.setItem('access_token', response.token);
          localStorage.setItem('refresh_token', response.refresh_token);
        } else {
          console.error('No token in response');
        }
      }),
      catchError((err) => {
        return throwError(() => err);
      })
    );
  }

  recoverPassword(forgotPasswordData: any): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('email', forgotPasswordData.email);
    return this.http.post<any>(`${this.apiUrl}password-reset/request`, formData).pipe(
      tap(() => {
        this.notifyService.open('Si votre adresse existe dans notre base, un email de réinitialisation de mot de passe vous a été envoyé.', 'success', 10000);
      })
    );
  }

  resetPassword(resetPasswordData: any): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('token', resetPasswordData.token);
    formData.append('password', resetPasswordData.password);
    formData.append('confirm_password', resetPasswordData.confirm_password);
    return this.http.post<any>(`${this.apiUrl}password-reset/reset`, formData).pipe(
      tap(() => {
        this.notifyService.open('Votre mot de passe a bien été réinitialisé. Vous pouvez maintenant vous connecter.', 'success', 10000);
        this.router.navigate(['/connexion']);
      })
    );
  }
}
