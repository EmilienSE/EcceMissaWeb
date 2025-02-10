import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Formify } from '../utils/formify.utils';
import { ResetPasswordData } from '../models/utilisateur';
import { AuthService } from '../services/auth/auth.service';
import { catchError, finalize, map, Observable, of, switchMap, tap } from 'rxjs';
import { Router, RouterLink } from '@angular/router';
import { EmLoaderComponent } from '../modules/em-loader/em-loader.component';
import { Size } from '../enums/size.enum';
import { ActivatedRoute } from '@angular/router';
import { passwordMatchValidator } from '../utils/passwordMatch.validator';

@Component({
  selector: 'app-password-reset',
  standalone: true,
  imports: [ReactiveFormsModule, EmLoaderComponent, RouterLink],
  templateUrl: './password-reset.component.html',
  styleUrl: './password-reset.component.scss'
})
export class PasswordResetComponent implements OnInit {
  passwordResetForm: FormGroup = this.fb.group<Formify<ResetPasswordData>>({
    token: [null, [Validators.required]],
    password: [null, [Validators.required, Validators.minLength(8)]],
    confirm_password: [null, [Validators.required, Validators.minLength(8)]]
  }, { validators: passwordMatchValidator('password', 'confirm_password') });

  isLoading: boolean;
  public Size = Size;
  
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private route: ActivatedRoute){}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const token = params['token'];
      if (token) {
        this.passwordResetForm.patchValue({ token });
      }
    });
  }

  submitForm(): Observable<void>{
    return of(undefined).pipe(
      tap(() => {
        this.isLoading = true;
      }),
      switchMap(() => {
        const passwordResetData: ResetPasswordData = {
          token: this.passwordResetForm.value['token'],
          password: this.passwordResetForm.value['password'],
          confirm_password: this.passwordResetForm.value['confirm_password']
        };
        return this.authService.resetPassword(passwordResetData);
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
