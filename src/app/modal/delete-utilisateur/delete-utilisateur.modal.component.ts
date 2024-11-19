import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ModalService } from '../../modal.service';
import { CommonModule } from '@angular/common';
import { UtilisateurService } from '../../services/utilisateur/utilisateur.service';
import { catchError, finalize, map, Observable, of, switchMap, tap } from 'rxjs';
import { EmLoaderComponent } from '../../modules/em-loader/em-loader.component';

@Component({
  selector: 'app-delete-utilisateur.modal',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, EmLoaderComponent],
  templateUrl: './delete-utilisateur.modal.component.html',
  styleUrl: './delete-utilisateur.modal.component.scss'
})
export class DeleteUtilisateurModalComponent {
  isLoading: boolean = false;

  constructor(
    public modalService: ModalService, 
    private utilisateurService: UtilisateurService
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
        return this.utilisateurService.deleteUtilisateur();
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
