import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Eglise, EgliseData } from '../../models/eglise';
import { environment } from '../../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class EgliseService {
  private apiUrl = `${environment.API_URL}/api/eglise`;

  constructor(private http: HttpClient) { }

  /**
   * Récupération des eglises
   * @returns Eglises
   */
  getEglises(): Observable<Eglise[]> {
    return this.http.get<Eglise[]>(this.apiUrl);
  }

  /**
   * Ajout d'une eglise
   * @param egliseData 
   * @returns Eglise créée
   */
  addEglise(egliseData: EgliseData): Observable<Eglise> {
    return this.http.post<Eglise>(this.apiUrl, egliseData);
  }

  /**
   * Modification d'une eglise
   * @param id 
   * @param egliseData 
   * @returns Eglise modifiée
   */
  updateEglise(id: number, egliseData: EgliseData): Observable<Eglise> {
    return this.http.put<Eglise>(`${this.apiUrl}/${id}`, egliseData);
  }

  /**
   * Suppression d'une eglise
   * @param id 
   * @returns boolean
   */
  deleteEglise(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
