import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Formify } from '../utils/formify.utils';
import { ForgotPasswordData } from '../models/utilisateur';
import { AuthService } from '../services/auth/auth.service';
import { catchError, finalize, map, Observable, of, switchMap, tap } from 'rxjs';
import { Router, RouterLink } from '@angular/router';
import { EmLoaderComponent } from '../modules/em-loader/em-loader.component';
import { Size } from '../enums/size.enum';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [ReactiveFormsModule, EmLoaderComponent, RouterLink],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss'
})
export class ForgotPasswordComponent {
  forgotPasswordForm: FormGroup = this.fb.group<Formify<ForgotPasswordData>>({
    email: [null, [Validators.required, Validators.email]],
  });
  isLoading: boolean;
  public Size = Size;
  
  constructor(
    private fb: FormBuilder,
    private authService: AuthService){}

  submitForm(): Observable<void>{
    return of(undefined).pipe(
      tap(() => {
        this.isLoading = true;
      }),
      switchMap(() => {
        const forgotPasswordData: ForgotPasswordData = {
          email: this.forgotPasswordForm.value['email']
        };
        return this.authService.recoverPassword(forgotPasswordData);
      }),
      catchError((err) => {
        this.isLoading = false;
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
