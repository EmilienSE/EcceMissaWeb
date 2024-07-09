import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Paroisse, ParoisseData } from '../../models/paroisse';
import { environment } from '../../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class ParoisseService {
  private apiUrl = `${environment.API_URL}/api/paroisse`;

  constructor(private http: HttpClient) { }

  /**
   * Récupération des paroisses
   * @returns Paroisses
   */
  getParoisses(): Observable<Paroisse[]> {
    return this.http.get<Paroisse[]>(this.apiUrl);
  }

  /**
   * Ajout d'une paroisse
   * @param paroisseData 
   * @returns Paroisse créée
   */
  addParoisse(paroisseData: ParoisseData): Observable<Paroisse> {
    return this.http.post<Paroisse>(this.apiUrl, paroisseData);
  }

  /**
   * Modification d'une paroisse
   * @param id 
   * @param paroisseData 
   * @returns Paroisse modifiée
   */
  updateParoisse(id: number, paroisseData: ParoisseData): Observable<Paroisse> {
    return this.http.put<Paroisse>(`${this.apiUrl}/${id}`, paroisseData);
  }

  /**
   * Suppression d'une paroisse
   * @param id 
   * @returns boolean
   */
  deleteParoisse(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
