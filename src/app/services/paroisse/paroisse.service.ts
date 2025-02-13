import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { JoinParoisseData, Paroisse, ParoisseData } from '../../models/paroisse';
import { environment } from '../../../environment/environment';
import { BillingPortal, PaymentData, PaymentIntent } from '../../models/payment';

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
   * Récupération de la paroisse où l'utilisateur est responsable
   * @returns Observable<Paroisse>
   */
   getUserParoisse(): Observable<Paroisse> {
    return this.http.get<Paroisse>(`${this.apiUrl}/ma_paroisse`);
  }

  /**
   * Ajout d'une paroisse
   * @param paroisseData 
   * @returns Paroisse créée avec son code unique
   */
  addParoisse(paroisseData: ParoisseData): Observable<{ paroisse: Paroisse, code_unique: string }> {
    const formData: FormData = new FormData();
    formData.append('nom', paroisseData.nom);
    formData.append('gps', paroisseData.gps);
    formData.append('diocese_id', paroisseData.diocese_id);
    if (paroisseData.acceptCgvCgu) formData.append('acceptCgvCgu', paroisseData.acceptCgvCgu.toString());
    return this.http.post<{ paroisse: Paroisse, code_unique: string }>(this.apiUrl, formData);
  }

  /**
   * Rejoindre une paroisse avec un code unique
   * @param joinParoisse 
   * @returns Paroisse rejointe
   */
  joinParoisse(joinParoisse: JoinParoisseData): Observable<Paroisse> {
    const formData: FormData = new FormData();
    formData.append('code_unique', joinParoisse.codeUnique);
    return this.http.post<Paroisse>(`${this.apiUrl}/join`, formData);
  }
  
  /**
   * Rejoindre une paroisse avec un code unique
   * @returns Paroisse rejointe
   */
  leaveParoisse(): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/leave`, {});
  }

  /**
   * Modification d'une paroisse
   * @param id 
   * @param paroisseData 
   * @returns Paroisse modifiée
   */
  updateParoisse(id: number, paroisseData: ParoisseData): Observable<Paroisse> {
    const formData: FormData = new FormData();
    formData.append('nom', paroisseData.nom);
    formData.append('gps', paroisseData.gps);
    formData.append('diocese_id', paroisseData.diocese_id);
    return this.http.post<Paroisse>(`${this.apiUrl}/${id}`, formData);
  }

  /**
   * Suppression d'une paroisse
   * @param id 
   * @returns boolean
   */
  deleteParoisse(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  /**
   * Création d'une intention de paiement
   * @returns lien de paiement
   */
  createPaymentIntent(id: string, price: string): Observable<PaymentIntent> {
    const formData: FormData = new FormData();
    formData.append('paroisse_id', id);
    formData.append('price', price);
    return this.http.post<PaymentIntent>(`${this.apiUrl}/paymentIntent`, formData);
  }
  
  /**
   * Régularisation de paiement
   * @returns lien de paiement
   */
  retryPayment(id: string, price: string): Observable<PaymentIntent> {
    const formData: FormData = new FormData();
    formData.append('paroisse_id', id);
    formData.append('price', price);
    return this.http.post<PaymentIntent>(`${this.apiUrl}/retry_payment`, formData);
  }

  /**
   * Accéder à la page de facturation
   * @returns lien de la page de facturation
   */
  billingPortal(id: number): Observable<BillingPortal> {
    return this.http.get<BillingPortal>(`${this.apiUrl}/${id}/billing_portal`);
  }

  /**
   * Envoi de l'intention de paiement après paiement
   * @returns
   */
  sendPayment(paymentData: PaymentData): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/sendPayment`, paymentData);
  }

  /**
   * Afficher le PDF d'un feuillet
   * @param id
   * @returns URL du PDF
   */
  generateParoissePdf(id: number): string {
    return `${environment.API_URL}/paroisse/${id}/pdf`;
  }
}
