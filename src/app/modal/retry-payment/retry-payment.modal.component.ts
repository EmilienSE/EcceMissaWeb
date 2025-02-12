import { Component, OnInit, signal, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ModalService } from '../../modal.service';
import { CommonModule } from '@angular/common';
import { Formify } from '../../utils/formify.utils';
import { catchError, finalize, map, Observable, of, switchMap, tap, throwError } from 'rxjs';
import { ParoisseService } from '../../services/paroisse/paroisse.service';
import { ParoisseData, RetryPaymentData } from '../../models/paroisse';
import { EmLoaderComponent } from '../../modules/em-loader/em-loader.component';
import { DioceseService } from '../../services/diocese/diocese.service';
import { Diocese } from '../../models/diocese';

import { PaymentIntent } from '../../models/payment';

@Component({
  selector: 'app-retry-payment.modal',
  standalone: true,
  imports: [
    ReactiveFormsModule, 
    CommonModule, 
    EmLoaderComponent,
    FormsModule
  ],
  templateUrl: './retry-payment.modal.component.html',
  styleUrl: './retry-payment.modal.component.scss'
})
export class RetryPaymentModalComponent implements OnInit {
  
  isLoading: boolean = false;

  paroisseID: string;
  
  paying = signal(false);
  paymentLink: string;

  selectedPlan: string;

  constructor(
    private fb: FormBuilder, 
    public modalService: ModalService, 
    private paroisseService: ParoisseService
  ){}

  ngOnInit(): void {
  }

  close(): void {
    this.modalService.close();
  }

  selectPlan(plan: string) {
    this.selectedPlan = plan;
  }

  getPrice(plan: string): number {
    switch(plan) {
      case 'monthly': return 12.00;
      case 'quarterly': return 34.00;
      case 'yearly': return 120.00;
      default: return 120.00;
    }
  }

  submitRetryPaymentForm(): Observable<PaymentIntent> {
    return of(undefined).pipe(
      tap(() => {
        this.isLoading = true;
      }),
      catchError((err) => {
        console.error(err);
        return throwError(() => err);
      }),
      switchMap(() => {
        return this.paroisseService.retryPayment(this.modalService.data.paroisseId, this.selectedPlan);
      }),
      tap((paymentIntent: PaymentIntent) => {
        this.paymentLink = paymentIntent.paymentLink;
        window.open(this.paymentLink, "_blank");
      }),
      finalize(() => {
        this.isLoading = false;
      })
    );
  }
}
