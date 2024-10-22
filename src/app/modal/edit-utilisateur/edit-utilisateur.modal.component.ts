import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ModalService } from '../../modal.service';
import { CommonModule } from '@angular/common';
import { UtilisateurService } from '../../services/utilisateur/utilisateur.service';
import { catchError, finalize, map, Observable, of, switchMap, tap } from 'rxjs';
import { EmLoaderComponent } from '../../modules/em-loader/em-loader.component';
import { Formify } from '../../utils/formify.utils';
import { EditUtilisateurData, Utilisateur } from '../../models/utilisateur';
import { DioceseService } from '../../services/diocese/diocese.service';
import { Diocese } from '../../models/diocese';

@Component({
  selector: 'app-edit-utilisateur.modal',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, EmLoaderComponent],
  templateUrl: './edit-utilisateur.modal.component.html',
  styleUrl: './edit-utilisateur.modal.component.scss'
})
export class EditUtilisateurModalComponent implements OnInit {
  isLoading: boolean = false;

  editUtilisateurForm: FormGroup = this.fb.group<Formify<EditUtilisateurData>>({
    nom: [null, Validators.required],
    prenom: [null, Validators.required],
    email: [null, Validators.required]
  });

  constructor(
    public modalService: ModalService, 
    private utilisateurService: UtilisateurService,
    private fb: FormBuilder
  ){}

  ngOnInit():void {
    this.isLoading = true;
    this.utilisateurService.getUtilisateurInfos().subscribe((utilisateur: Utilisateur) => {
      this.editUtilisateurForm.controls['nom'].setValue(utilisateur.nom);
      this.editUtilisateurForm.controls['prenom'].setValue(utilisateur.prenom);
      this.editUtilisateurForm.controls['email'].setValue(utilisateur.email);
      this.isLoading = false;
    });
  }

  close(): void {
    this.modalService.close();
  }

  submitForm(): Observable<void> {
    return of(undefined).pipe(
      tap(() => {
        this.isLoading = true;
      }),
      switchMap(() => {
        console.log('test')
        const editUtilisateur: EditUtilisateurData = this.editUtilisateurForm.getRawValue();
        return this.utilisateurService.updateUtilisateur(this.modalService.data.utilisateurId, editUtilisateur);
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
