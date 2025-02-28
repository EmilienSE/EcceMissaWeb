import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ModalService } from '../../modal.service';
import { CommonModule } from '@angular/common';
import { FeuilletData } from '../../models/feuillet';
import { Formify } from '../../utils/formify.utils';
import { catchError, finalize, map, Observable, of, switchMap, tap } from 'rxjs';
import { ParoisseService } from '../../services/paroisse/paroisse.service';
import { Paroisse } from '../../models/paroisse';
import { EmLoaderComponent } from '../../modules/em-loader/em-loader.component';
import { Utilisateur } from '../../models/utilisateur';

@Component({
  selector: 'app-manage-users.modal',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, EmLoaderComponent],
  templateUrl: './manage-users.modal.component.html',
  styleUrl: './manage-users.modal.component.scss'
})
export class ManageUsersModalComponent implements OnInit {
  isLoading: boolean = false;
  utilisateurs: Utilisateur[];
  
  constructor(
    public modalService: ModalService, 
    private paroisseService: ParoisseService
  ){}
  
  ngOnInit(): void {
    this.isLoading = true;
    this.paroisseService.getParoisseUsers().subscribe((utilisateurs: Utilisateur[]) => {
      this.utilisateurs = utilisateurs;
      this.isLoading = false;
    });
  }
  
  close(): void {
    this.modalService.close();
  }
  
  onRoleChange(utilisateur: Utilisateur, event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const selectedRole = selectElement.value;
    const roles = selectedRole.split(',');
    
    this.paroisseService.changerDroitsUtilisateur(this.modalService.data.paroisseId, utilisateur.id, roles).subscribe({
      next: () => {
      },
      error: (error: any) => {
        console.error('Error updating roles', error);
      }
    });
  }
  deleteUtilisateur(id: number) {
    this.paroisseService.supprimerResponsable(this.modalService.data.paroisseId, id).subscribe({
      next: () => {
        this.utilisateurs = this.utilisateurs.filter(utilisateur => utilisateur.id !== id);
      },
      error: (error: any) => {
        console.error('Error deleting user', error);
      }
    });
  }
}
