import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Feuillet, FeuilletData } from '../../models/feuillet';
import { environment } from '../../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class FeuilletService {
  private apiUrl = `${environment.API_URL}/api/feuillet`;

  constructor(private http: HttpClient) { }

  /**
   * Récupérer les derniers feuillets d'une paroisse avec pagination
   * @param page - Numéro de la page (optionnel, par défaut 1)
   * @param size - Nombre d'éléments par page (optionnel, par défaut 5)
   * @returns Observable avec les données paginées
   */
  getFeuillets(page: number = 1, size: number = 10): Observable<{ data: Feuillet[], pagination: any }> {
    return this.http.get<{ data: Feuillet[], pagination: any }>(
      `${this.apiUrl}/`,
      {
        params: {
          page: page.toString(),
          size: size.toString()
        }
      }
    );
  }

  /**
   * 
   * @param feuilletData 
   * @returns 
   */
  addFeuillet(feuilletData: FeuilletData): Observable<Feuillet> {
    const formData: FormData = new FormData();
    formData.append('celebration_date', feuilletData.celebration_date);
    formData.append('paroisse_id', feuilletData.paroisse_id);
    formData.append('feuillet', feuilletData.feuillet);

    return this.http.post<Feuillet>(this.apiUrl, formData);
  }

  // Mettre à jour un feuillet existant
  updateFeuillet(id: number, feuilletData: FeuilletData): Observable<Feuillet> {
    const formData: FormData = new FormData();
    if (feuilletData.celebration_date) {
      formData.append('celebration_date', feuilletData.celebration_date);
    }
    if (feuilletData.paroisse_id) {
      formData.append('paroisse_id', feuilletData.paroisse_id);
    }
    if (feuilletData.feuillet) {
      formData.append('feuillet', feuilletData.feuillet);
    }

    return this.http.post<Feuillet>(`${this.apiUrl}/${id}`, formData);
  }

  /**
   * Supprimer un feuillet
   * @param id
   * @returns
   */
  deleteFeuillet(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  /**
   * Récupérer les derniers feuillets d'un utilisateur
   * @returns Feuillets
   */
  getUserLatestFeuillets(): Observable<Feuillet[]> {
    return this.http.get<Feuillet[]>(`${this.apiUrl}/user/latest`);
  }

  /**
   * Récupérer les derniers feuillets d'une paroisse
   * @param paroisseId
   * @returns Feuillets
   */
  getParoisseLatestFeuillets(paroisseId: number): Observable<Feuillet[]> {
    return this.http.get<Feuillet[]>(`${this.apiUrl}/paroisse/${paroisseId}/latest`);
  }

  /**
   * Afficher le PDF d'un feuillet
   * @param id
   * @returns URL du PDF
   */
  showFeuilletPdf(id: number): string {
    return `${environment.API_URL}/feuillet/${id}/pdf`;
  }

   /**
   * Récupérer un feuillet par son ID
   * @param id
   * @returns Feuillet
   */
   getFeuilletById(id: number): Observable<Feuillet> {
    return this.http.get<Feuillet>(`${this.apiUrl}/${id}`);
  }

  /**
   * Récupérer les stats d'un feuillet par son ID
   * @param id
   * @returns FeuilletView[]
   */
  getFeuilletStats(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}/stats`);
  }
}
