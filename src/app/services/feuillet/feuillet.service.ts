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
   * Récupération de tous les feuillets de l'utilisateur
   * @returns Feuillets
   */
  getFeuillets(): Observable<Feuillet[]> {
    return this.http.get<Feuillet[]>(this.apiUrl);
  }

  /**
   * 
   * @param feuilletData 
   * @returns 
   */
  addFeuillet(feuilletData: FeuilletData): Observable<Feuillet> {
    const formData: FormData = new FormData();
    formData.append('eglise_id', feuilletData.eglise_id);
    formData.append('celebration_date', feuilletData.celebration_date);
    formData.append('paroisse_id', feuilletData.paroisse_id);
    formData.append('feuillet', feuilletData.feuillet);

    return this.http.post<Feuillet>(this.apiUrl, formData);
  }

  // Mettre à jour un feuillet existant
  updateFeuillet(id: number, feuilletData: FeuilletData): Observable<Feuillet> {
    const formData: FormData = new FormData();
    if (feuilletData.eglise_id) {
      formData.append('eglise_id', feuilletData.eglise_id);
    }
    if (feuilletData.celebration_date) {
      formData.append('celebration_date', feuilletData.celebration_date);
    }
    if (feuilletData.paroisse_id) {
      formData.append('paroisse_id', feuilletData.paroisse_id);
    }

    return this.http.put<Feuillet>(`${this.apiUrl}/${id}`, formData);
  }

  // Supprimer un feuillet
  deleteFeuillet(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  // Récupérer les derniers feuillets d'un utilisateur
  getUserLatestFeuillets(): Observable<Feuillet[]> {
    return this.http.get<Feuillet[]>(`${this.apiUrl}/user/latest`);
  }

  // Récupérer les derniers feuillets d'une paroisse
  getParoisseLatestFeuillets(paroisseId: number): Observable<Feuillet[]> {
    return this.http.get<Feuillet[]>(`${this.apiUrl}/paroisse/${paroisseId}/latest`);
  }

  // Afficher le PDF d'un feuillet
  showFeuilletPdf(id: number): string {
    return `${environment.API_URL}/feuillet/${id}/pdf`;
  }
}
