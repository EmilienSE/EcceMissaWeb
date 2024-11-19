import { Component, OnInit } from '@angular/core';
import { UtilisateurService } from '../../services/utilisateur/utilisateur.service';
import { Utilisateur } from '../../models/utilisateur';
import { EmLoaderComponent } from '../../modules/em-loader/em-loader.component';
import { RouterLink } from '@angular/router';
import { ModalService } from '../../modal.service';
import { EditUtilisateurModalComponent } from '../../modal/edit-utilisateur/edit-utilisateur.modal.component';
import { modalOptions } from '../../utils/modalOptions.utils';
import { NotifyService } from '../../notify.service';
import { ChangePasswordModalComponent } from '../../modal/change-password/change-password.modal.component';
import { DeleteUtilisateurModalComponent } from '../../modal/delete-utilisateur/delete-utilisateur.modal.component';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-compte',
  standalone: true,
  imports: [EmLoaderComponent, RouterLink],
  templateUrl: './compte.component.html',
  styleUrl: './compte.component.scss'
})
export class CompteComponent implements OnInit {
  isLoading: boolean;
  error: string;
  utilisateur: Utilisateur;

  constructor(
    private utilisateurService: UtilisateurService,
    private modalService: ModalService,
    private notifyService: NotifyService,
    private authService: AuthService){}

  ngOnInit(): void {
    this.isLoading = true;
    this.utilisateurService.getUtilisateurInfos().subscribe({
      next: (utilisateur: Utilisateur) => {
        this.utilisateur = utilisateur;
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
      }
    });
  }

  openDeleteUserModal() {
    const modalRef = this.modalService.open(DeleteUtilisateurModalComponent, modalOptions);
    modalRef.closed.subscribe(() => {
      this.isLoading = true;
      this.notifyService.open('Profil supprimé avec succès, déconnexion en cours.', 'success');
      setTimeout(() => {
        this.authService.logout();
      }, 2000);
    });
  }

  openEditPasswordModal() {
    const modalRef = this.modalService.open(ChangePasswordModalComponent, modalOptions);
    modalRef.closed.subscribe(() => {
      this.isLoading = true;
      this.notifyService.open('Profil modifié avec succès', 'success');
      this.utilisateurService.getUtilisateurInfos().subscribe({
        next: (utilisateur: Utilisateur) => {
          this.utilisateur = utilisateur;
          this.isLoading = false;
        },
        error: (error) => {
          this.isLoading = false;
        }
      });
    });
  }
  openEditUserModal() {
    const modalRef = this.modalService.open(EditUtilisateurModalComponent, modalOptions, {utilisateurId: this.utilisateur.id});
    modalRef.closed.subscribe(() => {
      this.isLoading = true;
      this.notifyService.open('Profil modifié avec succès', 'success');
      this.utilisateurService.getUtilisateurInfos().subscribe({
        next: (utilisateur: Utilisateur) => {
          this.utilisateur = utilisateur;
          this.isLoading = false;
        },
        error: (error) => {
          this.isLoading = false;
        }
      });
    });
  }
}
