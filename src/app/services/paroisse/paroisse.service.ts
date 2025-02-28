import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { JoinParoisseData, Paroisse, ParoisseData } from '../../models/paroisse';
import { environment } from '../../../environment/environment';
import { BillingPortal, PaymentData, PaymentIntent } from '../../models/payment';
import { Utilisateur } from '../../models/utilisateur';
import { Feuillet } from '../../models/feuillet';

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
  generateParoissePdf(id: number, type: string): string {
    return `${environment.API_URL}/paroisse/${id}/pdf/${type}`;
  }

  /**
   * Récupération des vues des feuillets pour une paroisse donnée
   * @param paroisseId Identifiant de la paroisse
   * @param startDate Date de début (optionnelle)
   * @param endDate Date de fin (optionnelle)
   * @returns Liste des feuillet views
   */
  getFeuilletViews(paroisseId: number, startDate?: string, endDate?: string): Observable<any[]> {
    let params: any = {};
    if (startDate) params.start_date = startDate;
    if (endDate) params.end_date = endDate;

    return this.http.get<any[]>(`${this.apiUrl}/${paroisseId}/feuilletviews`, { params });
  }

  /**
   * Récupération des utilisateurs d'une paroisse
   * @returns Paroisse
   */
  getParoisseUsers(): Observable<Utilisateur[]> {
    return this.http.get<Utilisateur[]>(`${this.apiUrl}/utilisateurs`);
  }

  /**
   * Changer les droits d'un utilisateur
   * @param paroisseId Identifiant de la paroisse
   * @param userId Identifiant de l'utilisateur
   * @param roles Nouveaux rôles de l'utilisateur
   * @returns Message de confirmation
   */
  changerDroitsUtilisateur(paroisseId: number, userId: number, roles: string[]): Observable<{ message: string }> {
    const formData: FormData = new FormData();
    formData.append('roles', JSON.stringify(roles));
    return this.http.post<{ message: string }>(`${this.apiUrl}/${paroisseId}/utilisateur/${userId}/changer_droits`, formData);
  }

  /**
   * Supprimer un responsable de la paroisse
   * @param paroisseId Identifiant de la paroisse
   * @param userId Identifiant de l'utilisateur
   * @returns Message de confirmation
   */
  supprimerResponsable(paroisseId: number, userId: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${paroisseId}/utilisateur/${userId}/supprimer`);
  }

  /**
   * Récupération du dernier et du prochain feuillet pour une paroisse donnée
   * @param paroisseId Identifiant de la paroisse
   * @returns Dernier et prochain feuillet
   */
  getLatestAndNextFeuillets(paroisseId: number): Observable<{ latest_feuillet: Feuillet, next_feuillet: Feuillet }> {
    return this.http.get<{ latest_feuillet: Feuillet, next_feuillet: Feuillet }>(`${this.apiUrl}/${paroisseId}/feuillets/latest_and_next`);
  }
}
