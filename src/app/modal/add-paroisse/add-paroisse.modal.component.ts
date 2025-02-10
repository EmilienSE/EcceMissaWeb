import { Component, OnInit, signal, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ModalService } from '../../modal.service';
import { CommonModule } from '@angular/common';
import { Formify } from '../../utils/formify.utils';
import { catchError, finalize, map, Observable, of, switchMap, tap, throwError } from 'rxjs';
import { ParoisseService } from '../../services/paroisse/paroisse.service';
import { Paroisse, ParoisseData } from '../../models/paroisse';
import { EmLoaderComponent } from '../../modules/em-loader/em-loader.component';
import { DioceseService } from '../../services/diocese/diocese.service';
import { Diocese } from '../../models/diocese';

import { PaymentIntent } from '../../models/payment';

@Component({
  selector: 'app-add-paroisse.modal',
  standalone: true,
  imports: [
    ReactiveFormsModule, 
    CommonModule, 
    EmLoaderComponent,
    FormsModule
  ],
  templateUrl: './add-paroisse.modal.component.html',
  styleUrl: './add-paroisse.modal.component.scss'
})
export class AddParoisseModalComponent implements OnInit {
  
  isLoading: boolean = false;

  addParoisseForm: FormGroup = this.fb.group<Formify<ParoisseData>>({
    nom: [null, Validators.required],
    gps: [null],
    diocese_id: [null, Validators.required],
    acceptCgvCgu: [false, Validators.requiredTrue]
  });
  dioceses: Diocese[];
  paroisseID: string;
  
  paying = signal(false);
  paymentLink: string;

  selectedPlan: string;

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
        console.error(err);
        return throwError(() => err);
      }),
      switchMap(() => {
        return this.paroisseService.createPaymentIntent(this.paroisseID, this.selectedPlan);
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
