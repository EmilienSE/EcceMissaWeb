import { Component, OnInit, signal, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ModalService } from '../../modal.service';
import { CommonModule } from '@angular/common';
import { Formify } from '../../utils/formify.utils';
import { catchError, finalize, map, Observable, of, switchMap, tap, throwError } from 'rxjs';
import { ParoisseService } from '../../services/paroisse/paroisse.service';
import { Paroisse, ParoisseData } from '../../models/paroisse';
import { EmLoaderComponent } from '../../modules/em-loader/em-loader.component';
import { DioceseService } from '../../services/diocese/diocese.service';
import { Diocese } from '../../models/diocese';

import { PaymentIntentResult, StripeElementsOptions, StripeEmbeddedCheckoutOptions } from '@stripe/stripe-js';
import {
  injectStripe,
  StripeElementsDirective,
  StripePaymentElementComponent,
} from 'ngx-stripe';

import { PaymentData, PaymentIntent, PaymentMethod } from '../../models/payment';

@Component({
  selector: 'app-add-paroisse.modal',
  standalone: true,
  imports: [
    ReactiveFormsModule, 
    CommonModule, 
    StripeElementsDirective,
    StripePaymentElementComponent,
    EmLoaderComponent
  ],
  templateUrl: './add-paroisse.modal.component.html',
  styleUrl: './add-paroisse.modal.component.scss'
})
export class AddParoisseModalComponent implements OnInit {
  
  @ViewChild(StripePaymentElementComponent) paymentElement!: StripePaymentElementComponent;
  isLoading: boolean = false;
  readonly stripe = injectStripe("pk_test_51PlTDhE8TPrVnm48pxcrEjJ4SQ7V5ZTRX4V4EqIDDhYV7y7N7CWoxtuzcLc6f8JkPrpLLW2FkMkopaQLSlnsA3eB008CtIeVUn");

  addParoisseForm: FormGroup = this.fb.group<Formify<ParoisseData>>({
    nom: [null, Validators.required],
    gps: [null],
    diocese_id: [null, Validators.required]
  });
  dioceses: Diocese[];
  paymentIntentId: string;
  PaymentMethod = PaymentMethod;
  method: PaymentMethod;
  checkoutForm = this.fb.group({
    name: ['Ricardo', [Validators.required]],
    email: ['support@ngx-stripe.dev', [Validators.required]],
    address: ['Av. Ramon Nieto 313B 2D', [Validators.required]],
    zipcode: ['36205', [Validators.required]],
    city: ['Vigo', [Validators.required]],
    amount: [2500, [Validators.required, Validators.pattern(/\d+/)]],
  });
  paroisseID: string;
  
  paying = signal(false);
  stripeSessionId: string;
  paymentLink: string;

  constructor(
    private fb: FormBuilder, 
    public modalService: ModalService, 
    private paroisseService: ParoisseService,
    private dioceseService: DioceseService
  ){}

  ngOnInit(): void {
    this.isLoading = true;
    this.dioceseService.getDioceses().subscribe((dioceses: Diocese[]) => {
      this.dioceses = dioceses;
      this.isLoading = false;
    });
  }

  close(): void {
    this.modalService.close();
  }

  submitFormParoisse(): Observable<PaymentIntent> {
    return of(undefined).pipe(
      tap(() => {
        this.isLoading = true;
      }),
      switchMap(() => {
        const newParoisse: ParoisseData = this.addParoisseForm.getRawValue();
        return this.paroisseService.addParoisse(newParoisse);
      }),
      tap((res: any) => {
        if (res && res.paroisse_id) {
          this.paroisseID = res.paroisse_id;
        }
      }),
      catchError((err) => {
        if (err instanceof Error) {
          console.error(err);
        }
        return throwError(() => err);
      }),
      switchMap(() => {
        return this.paroisseService.createPaymentIntent(this.paroisseID);
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
