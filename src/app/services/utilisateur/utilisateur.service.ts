import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environment/environment';
import { EditUtilisateurData, Utilisateur, UtilisateurData } from '../../models/utilisateur';

@Injectable({
  providedIn: 'root'
})
export class UtilisateurService {
  private apiUrl = `${environment.API_URL}/api/utilisateur`;

  constructor(private http: HttpClient) { }

  /**
   * Récupération des utilisateurs
   * @returns Observable<Utilisateur[]>
   */
  getUtilisateurs(): Observable<Utilisateur[]> {
    return this.http.get<Utilisateur[]>(`${this.apiUrl}s`);
  }

  /**
   * Récupération d'un utilisateur par son ID
   * @param id ID de l'utilisateur
   * @returns Observable<Utilisateur>
   */
  getUtilisateur(id: number): Observable<Utilisateur> {
    return this.http.get<Utilisateur>(`${this.apiUrl}/${id}`);
  }

  /**
   * Récupération d'un utilisateur connecté
   * @returns Observable<Utilisateur>
   */
  getUtilisateurInfos(): Observable<Utilisateur> {
    return this.http.get<Utilisateur>(`${this.apiUrl}`);
  }

  /**
   * Mise à jour d'un utilisateur avec FormData
   * @param id ID de l'utilisateur
   * @param utilisateur Les nouvelles données de l'utilisateur
   * @returns Observable<Utilisateur>
   */
  updateUtilisateur(id: number, utilisateur: EditUtilisateurData): Observable<Utilisateur> {
    const formData: FormData = new FormData();
    formData.append('email', utilisateur.email);
    formData.append('prenom', utilisateur.prenom);
    formData.append('nom', utilisateur.nom);

    return this.http.post<Utilisateur>(`${this.apiUrl}/${id}`, formData);
  }

  /**
   * Suppression d'un utilisateur
   * @param id ID de l'utilisateur
   * @returns Observable<void>
   */
  deleteUtilisateur(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
