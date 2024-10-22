import { Component, OnInit } from '@angular/core';
import { UtilisateurService } from '../../services/utilisateur/utilisateur.service';
import { Utilisateur } from '../../models/utilisateur';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit{
  utilisateur: Utilisateur;

  constructor(
    private utilisateurService: UtilisateurService,
    private authService: AuthService
  ){}

  ngOnInit(): void {
      this.utilisateurService.getUtilisateurInfos().subscribe({
        next: (utilisateur: Utilisateur) => {
          this.utilisateur = utilisateur;
        },
        error: (err: any) => {
          console.error(err);
        } 
      })
  }

  logout() {
    this.authService.logout();
  }

}
