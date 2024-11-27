import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import moment from 'moment';
import { ModalService } from '../../modal.service';
import { AddFeuilletModalComponent } from '../../modal/add-feuillet/add-feuillet.modal.component';
import { FeuilletService } from '../../services/feuillet/feuillet.service';
import { Feuillet } from '../../models/feuillet';
import { EmLoaderComponent } from '../../modules/em-loader/em-loader.component';
import { EditFeuilletModalComponent } from '../../modal/edit-feuillet/edit-feuillet.modal.component';
import { DeleteFeuilletModalComponent } from '../../modal/delete-feuillet/delete-feuillet.modal.component';
import { modalOptions } from '../../utils/modalOptions.utils';
import { finalize, Observable, of, switchMap, tap } from 'rxjs';
import { ParoisseService } from '../../services/paroisse/paroisse.service';
import { PaymentIntent } from '../../models/payment';
import { Paroisse } from '../../models/paroisse';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-feuillets',
  standalone: true,
  imports: [CommonModule, EmLoaderComponent, RouterLink],
  templateUrl: './feuillets.component.html',
  styleUrl: './feuillets.component.scss'
})
export class FeuilletsComponent implements OnInit {
  moment = moment;
  feuillets: Feuillet[];
  isLoading: boolean = false;
  error: string;
  paymentLink: any;
  paroisse: Paroisse;

  currentPage: number = 1; // Page actuelle
  pageSize: number = 10; // Taille de la page
  totalItems: number = 0; // Total des éléments
  get totalPages(): number {
    return Math.ceil(this.totalItems / this.pageSize);
  }

  constructor(
    private modalService: ModalService,
    private feuilletService: FeuilletService,
    private paroisseService: ParoisseService){ }

  ngOnInit(): void {
    this.loadFeuillets();
  }

  loadFeuillets(page: number = 1) {
    this.isLoading = true;
    this.feuillets = [];
    this.feuilletService.getFeuillets(page, this.pageSize).subscribe({
      next: (response: { data: Feuillet[], pagination: any }) => {
        this.feuillets = response.data;
        this.currentPage = response.pagination.current_page;
        this.pageSize = response.pagination.page_size;
        this.totalItems = response.pagination.total_items;
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        if (error.status === 403) {
          this.error = 'payment';
        } else if (error.status === 404) {
          this.error = 'paroisse';
        } else {
          this.error = error.message || 'Une erreur est survenue';
        }
      }
    });
  }

  onPageChange(newPage: number): void {
    this.loadFeuillets(newPage);
  }

  openAddModal() {
    const modalRef = this.modalService.open(AddFeuilletModalComponent, {
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
      this.feuilletService.getFeuillets().subscribe((response: { data: Feuillet[], pagination: any }) => {
        this.feuillets = response.data;
        this.isLoading = false;
      });
    });
  }

  openFeuillet(feuilletId: number, event: Event): void {
    event.stopPropagation();
    window.open(this.feuilletService.showFeuilletPdf(feuilletId), '_blank')
  }

  deleteFeuillet(feuilletId: number, event: Event) {
    event.stopPropagation();
    const modalRef = this.modalService.open(DeleteFeuilletModalComponent, modalOptions, {feuilletId});
    modalRef.closed.subscribe(() => {
      this.loadFeuillets(this.currentPage);
    });
  }

  editFeuillet(feuilletId: number, event: Event) {
    event.stopPropagation();
    const modalRef = this.modalService.open(EditFeuilletModalComponent, modalOptions, {feuilletId});
    modalRef.closed.subscribe(() => {
      this.loadFeuillets(this.currentPage);
    });
  }

  openRetryPayment(): Observable<PaymentIntent> {
    return of(undefined).pipe(
      tap(() => {
        this.isLoading = true;
      }),
      switchMap(() => {
        return this.paroisseService.getUserParoisse();
      }),
      tap((paroisse: Paroisse) => {
        this.paroisse = paroisse;
        window.open(this.paymentLink, "_blank");
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
}
