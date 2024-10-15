import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Diocese } from '../../models/diocese';
import { environment } from '../../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class DioceseService {
  private apiUrl = `${environment.API_URL}/api/diocese`;

  constructor(private http: HttpClient) { }

  /**
   * Récupération des dioceses
   * @returns Dioceses
   */
  getDioceses(): Observable<Diocese[]> {
    return this.http.get<Diocese[]>(this.apiUrl);
  }
}
