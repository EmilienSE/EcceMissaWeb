import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ModalService } from '../../modal.service';
import { CommonModule } from '@angular/common';
import { UtilisateurService } from '../../services/utilisateur/utilisateur.service';
import { catchError, finalize, map, Observable, of, switchMap, tap } from 'rxjs';
import { EmLoaderComponent } from '../../modules/em-loader/em-loader.component';
import { Formify } from '../../utils/formify.utils';
import { ChangePasswordData, Utilisateur } from '../../models/utilisateur';

@Component({
  selector: 'app-change-password.modal',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, EmLoaderComponent],
  templateUrl: './change-password.modal.component.html',
  styleUrl: './change-password.modal.component.scss'
})
export class ChangePasswordModalComponent {
  isLoading: boolean = false;

  changePasswordForm: FormGroup = this.fb.group<Formify<ChangePasswordData>>({
    ancienPassword: [null, Validators.required],
    nouveauPassword: [null, Validators.required],
  });

  constructor(
    public modalService: ModalService, 
    private utilisateurService: UtilisateurService,
    private fb: FormBuilder
  ){}

  close(): void {
    this.modalService.close();
  }

  submitForm(): Observable<void> {
    return of(undefined).pipe(
      tap(() => {
        this.isLoading = true;
      }),
      switchMap(() => {
        const changePassword: ChangePasswordData = this.changePasswordForm.getRawValue();
        return this.utilisateurService.changePassword(changePassword);
      }),
      catchError((err) => {
        if (err instanceof Error) {
          console.error(err);
        }
        return of(undefined);
      }),
      finalize(() => {
        this.isLoading = false;
        this.modalService.close();
      }),
      map(() => {})
    );
  }
}
