import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Formify } from '../utils/formify.utils';
import { InscriptionData } from '../models/utilisateur';
import { AuthService } from '../services/auth/auth.service';
import { catchError, finalize, map, Observable, of, switchMap, tap } from 'rxjs';
import { Router } from '@angular/router';
import { EmLoaderComponent } from '../modules/em-loader/em-loader.component';
import { Size } from '../enums/size.enum';

@Component({
  selector: 'app-inscription',
  standalone: true,
  imports: [ReactiveFormsModule, EmLoaderComponent],
  templateUrl: './inscription.component.html',
  styleUrl: './inscription.component.scss'
})
export class InscriptionComponent {
  inscriptionForm: FormGroup = this.fb.group<Formify<InscriptionData>>({
    email: [null, [Validators.required, Validators.email]],
    nom: [null, Validators.required],
    prenom: [null, Validators.required],
    password: [null, Validators.required],
    confirm_password: [null, Validators.required],
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
        const inscriptionData: InscriptionData = {
          email: this.inscriptionForm.value['email'],
          prenom: this.inscriptionForm.value['prenom'],
          nom: this.inscriptionForm.value['nom'],
          password: this.inscriptionForm.value['password'],
          confirm_password: this.inscriptionForm.value['confirm_password']
        };
        return this.authService.inscription(inscriptionData);
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
