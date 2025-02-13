import { Component, OnInit } from '@angular/core';
import { ModalService } from '../../modal.service';
import { AddParoisseModalComponent } from '../../modal/add-paroisse/add-paroisse.modal.component';
import { EmLoaderComponent } from '../../modules/em-loader/em-loader.component';
import { Paroisse } from '../../models/paroisse';
import { ParoisseService } from '../../services/paroisse/paroisse.service';
import { DeleteParoisseModalComponent } from '../../modal/delete-paroisse/delete-paroisse.modal.component';
import { JoinParoisseModalComponent } from '../../modal/join-paroisse/join-paroisse.modal.component';
import { LeaveParoisseModalComponent } from '../../modal/leave-paroisse/leave-paroisse.modal.component';
import { finalize, Observable, of, switchMap, tap } from 'rxjs';
import { BillingPortal, PaymentIntent } from '../../models/payment';
import { EditParoisseModalComponent } from '../../modal/edit-paroisse/edit-paroisse.modal.component';
import { modalOptions } from '../../utils/modalOptions.utils';
import { RetryPaymentModalComponent } from '../../modal/retry-payment/retry-payment.modal.component';


@Component({
  selector: 'app-paroisse',
  standalone: true,
  imports: [EmLoaderComponent],
  templateUrl: './paroisse.component.html',
  styleUrl: './paroisse.component.scss'
})
export class ParoisseComponent implements OnInit {
  isLoading: boolean = false;
  paroisse: Paroisse;
  paymentLink: any;
  billingPortalLink: string;
  error: string;

  constructor(private modalService: ModalService, private paroisseService: ParoisseService){}

  ngOnInit(): void {
    this.isLoading = true;
    this.paroisseService.getUserParoisse().subscribe({
      next: (paroisse: Paroisse) => {
        this.paroisse = paroisse;
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        if (error.status === 404) {
          this.error = 'paroisse';
        } else {
          this.error = error.message || 'Une erreur est survenue';
        }
      }
    });
  }

  openAddModal() {
    const modalRef = this.modalService.open(AddParoisseModalComponent, {
      animations: {
        modal: {
          enter: 'fade-in 0.3s ease-out',
          leave: 'fade-out 0.3s forwards',
        },
        overlay: {
          enter: 'fade-in 0.6s ease-out',
          leave: 'fade-out 0.3s forwards',
        },
      },
      size: {
        width: '40rem',
      },
    });
    modalRef.closed.subscribe(() => {
      this.isLoading = true;
      this.paroisseService.getUserParoisse().subscribe({
        next: (paroisse: Paroisse) => {
          this.paroisse = paroisse;
          this.isLoading = false;
        },
        error: (error) => {
          this.isLoading = false;
          if (error.status === 404) {
            this.error = 'paroisse';
          } else {
            this.error = error.message || 'Une erreur est survenue';
          }
        }
      });
    });
  }

  openDeleteModal() {
    const modalRef = this.modalService.open(DeleteParoisseModalComponent, modalOptions, {paroisseId: this.paroisse.id});
    modalRef.closed.subscribe(() => {
      this.isLoading = true;
      this.paroisseService.getUserParoisse().subscribe({
        next: (paroisse: Paroisse) => {
          this.paroisse = paroisse;
          this.isLoading = false;
        },
        error: (error) => {
          this.isLoading = false;
          if (error.status === 404) {
            this.error = 'paroisse';
          } else {
            this.error = error.message || 'Une erreur est survenue';
          }
        }
      });
    });
  }
  
  openJoinModal() {
    const modalRef = this.modalService.open(JoinParoisseModalComponent, modalOptions);
    modalRef.closed.subscribe(() => {
      this.isLoading = true;
      this.paroisseService.getUserParoisse().subscribe({
        next: (paroisse: Paroisse) => {
          this.paroisse = paroisse;
          this.isLoading = false;
        },
        error: (error) => {
          this.isLoading = false;
          if (error.status === 404) {
            this.error = 'paroisse';
          } else {
            this.error = error.message || 'Une erreur est survenue';
          }
        }
      });
    });
  }

  openLeaveParoisseModal() {
    const modalRef = this.modalService.open(LeaveParoisseModalComponent, modalOptions, {paroisseId: this.paroisse.id});
    modalRef.closed.subscribe(() => {
      this.isLoading = true;
      this.paroisseService.getUserParoisse().subscribe({
        next: (paroisse: Paroisse) => {
          this.paroisse = paroisse;
          this.isLoading = false;
        },
        error: (error) => {
          this.isLoading = false;
          if (error.status === 404) {
            this.error = 'paroisse';
          } else {
            this.error = error.message || 'Une erreur est survenue';
          }
        }
      });
    });
  }

  openRetryPaymentModal() {
    const modalRef = this.modalService.open(RetryPaymentModalComponent, modalOptions, {paroisseId: this.paroisse.id});
    modalRef.closed.subscribe(() => {
      this.isLoading = true;
      this.paroisseService.getUserParoisse().subscribe({
        next: (paroisse: Paroisse) => {
          this.paroisse = paroisse;
          this.isLoading = false;
        },
        error: (error) => {
          this.isLoading = false;
          if (error.status === 404) {
            this.error = 'paroisse';
          } else {
            this.error = error.message || 'Une erreur est survenue';
          }
        }
      });
    });
  }

  openBillingPortal(): Observable<BillingPortal> {
    return of(undefined).pipe(
      tap(() => {
        this.isLoading = true;
      }),
      switchMap(() => {
        return this.paroisseService.billingPortal(this.paroisse.id);
      }),
      tap((billingPortal: BillingPortal) => {
        this.billingPortalLink = billingPortal.billingPortalLink;
        window.open(this.billingPortalLink, "_blank");
      }),
      finalize(() => {
        this.isLoading = false;
      })
    );
  }

  openEditParoisseModal() {
    const modalRef = this.modalService.open(EditParoisseModalComponent, modalOptions, {paroisseId: this.paroisse.id});
    modalRef.closed.subscribe(() => {
      this.isLoading = true;
      this.paroisseService.getUserParoisse().subscribe({
        next: (paroisse: Paroisse) => {
          this.paroisse = paroisse;
          this.isLoading = false;
        },
        error: (error) => {
          this.isLoading = false;
          if (error.status === 404) {
            this.error = 'paroisse';
          } else {
            this.error = error.message || 'Une erreur est survenue';
          }
        }
      });
    });
  }
  
  downloadParoisseQRCode() {
    window.open(this.paroisseService.generateParoissePdf(this.paroisse.id), '_blank')
  }
}
