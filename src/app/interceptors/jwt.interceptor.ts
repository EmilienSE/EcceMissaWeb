import { HttpRequest, HttpEvent, HttpErrorResponse, HttpInterceptorFn, HttpHandlerFn } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, switchMap, filter, take } from 'rxjs/operators';
import { AuthService } from '../services/auth/auth.service';
import { inject } from '@angular/core';
import { NotifyService } from '../notify.service';

export const jwtInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> => {
  const authService = inject(AuthService);
  const notifyService = inject(NotifyService);
  const token = authService.getToken();

  if (token && !req.url.includes('api/login_check') && !req.url.includes('api/inscription') && !req.url.includes('api/token/refresh')) {
    req = addToken(req, token);
  }

  return next(req).pipe(
    catchError((error) => {
      if(error instanceof HttpErrorResponse && (error.status === 403 || error.status === 400 || error.status === 500)) {
        notifyService.open(error.error?.error || 'Une erreur est survenue.', 'danger', 5000);
      }
      if (error instanceof HttpErrorResponse && error.status === 401) {
        if (req.url.includes('api/token/refresh')) {
          // If the refresh token request fails with 401, log out the user
          authService.logout();
          notifyService.open('Session expirée. Veuillez vous reconnecter.', 'danger', 5000);
        } else if (!req.url.includes('api/login_check') && !req.url.includes('api/inscription')) {
          return handle401Error(req, next, authService);
        }
      }
      return throwError(() => {
        return {
          message: error.message || 'Unknown error',
          status: error.status
        };
      });
    })
  );
};

function addToken(request: HttpRequest<any>, token: string) {
  return request.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  });
}

let isRefreshing = false;
const refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

function handle401Error(request: HttpRequest<any>, next: HttpHandlerFn, authService: AuthService): Observable<HttpEvent<any>> {
  if (!isRefreshing) {
    isRefreshing = true;
    refreshTokenSubject.next(null);

    return authService.refreshToken().pipe(
      switchMap((response: any) => {
        const newToken = response.token;
        isRefreshing = false;
        refreshTokenSubject.next(newToken);
        return next(addToken(request, newToken));
      }),
      catchError((err) => {
        isRefreshing = false;
        console.error('Erreur lors du rafraîchissement du token:', err);
        if (err.status === 401 || err.status === 400) {
          console.warn('Token invalide ou expiré. Déconnexion.');
          authService.logout();
        } else {
          console.warn('Erreur non critique, pas de déconnexion:', err);
        }
        return throwError(() => err);
      })
    );
  } else {
    return refreshTokenSubject.pipe(
      filter(token => token != null),
      take(1),
      switchMap(jwt => {
        return next(addToken(request, jwt));
      })
    );
  }
}
