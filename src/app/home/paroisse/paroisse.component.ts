import { Component, OnInit } from '@angular/core';
import { ModalService } from '../../modal.service';
import { AddParoisseModalComponent } from '../../modal/add-paroisse/add-paroisse.modal.component';
import { EmLoaderComponent } from '../../modules/em-loader/em-loader.component';
import { Paroisse } from '../../models/paroisse';
import { ParoisseService } from '../../services/paroisse/paroisse.service';
import { Options } from '../../modal/modal-options';
import { DeleteParoisseModalComponent } from '../../modal/delete-paroisse/delete-paroisse.modal.component';
import { JoinParoisseModalComponent } from '../../modal/join-paroisse/join-paroisse.modal.component';
import { LeaveParoisseModalComponent } from '../../modal/leave-paroisse/leave-paroisse.modal.component';
import { finalize, Observable, of, switchMap, tap } from 'rxjs';
import { BillingPortal, PaymentIntent } from '../../models/payment';
import { EditParoisseModalComponent } from '../../modal/edit-paroisse/edit-paroisse.modal.component';


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

  constructor(private modalService: ModalService, private paroisseService: ParoisseService){}

  ngOnInit(): void {
    this.isLoading = true;
    this.paroisseService.getUserParoisse().subscribe((paroisse: Paroisse) => {
      this.paroisse = paroisse;
      this.isLoading = false;
    });
  }

  openAddModal() {
    this.modalService.open(AddParoisseModalComponent, {
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
  }

  openDeleteModal() {
    const options: Options = {
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
    }
    this.modalService.open(DeleteParoisseModalComponent, options, {paroisseId: this.paroisse.id});
  }
  
  openJoinModal() {
    const options: Options = {
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
    }
    this.modalService.open(JoinParoisseModalComponent, options);
  }

  openLeaveParoisseModal() {
    const options: Options = {
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
    }
    this.modalService.open(LeaveParoisseModalComponent, options, {paroisseId: this.paroisse.id});
  }

  openRetryPayment(): Observable<PaymentIntent> {
    return of(undefined).pipe(
      tap(() => {
        this.isLoading = true;
      }),
      switchMap(() => {
        return this.paroisseService.retryPayment(this.paroisse.id);
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
    const options: Options = {
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
    }
    const modalRef = this.modalService.open(EditParoisseModalComponent, options, {paroisseId: this.paroisse.id});
    modalRef.closed.subscribe(() => {
      this.isLoading = true;
      this.paroisseService.getUserParoisse().subscribe((paroisse: Paroisse) => {
        this.paroisse = paroisse;
        this.isLoading = false;
      });
    });
  }
}
