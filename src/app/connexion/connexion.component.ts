import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Formify } from '../utils/formify.utils';
import { ConnexionData } from '../models/utilisateur';
import { AuthService } from '../services/auth/auth.service';
import { catchError, finalize, map, Observable, of, switchMap, tap } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-connexion',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './connexion.component.html',
  styleUrl: './connexion.component.scss'
})
export class ConnexionComponent {
  connexionForm: FormGroup = this.fb.group<Formify<ConnexionData>>({
    username: [null, [Validators.required, Validators.email]],
    password: [null, Validators.required]
  });
  isLoading: boolean;
  
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router){}

  submitForm(): Observable<void>{
    return of(undefined).pipe(
      tap(() => {
        this.isLoading = true;
      }),
      switchMap(() => {
        const connexionData: ConnexionData = {
          username: this.connexionForm.value['username'],
          password: this.connexionForm.value['password']
        };
        return this.authService.login(connexionData);
      }),
      catchError((err) => {
        if (err instanceof Error) {
          console.error(err);
        }
        return of(undefined);
      }),
      finalize(() => {
        this.isLoading = false;
      }),
      map(() => {})
    );
  }
}
