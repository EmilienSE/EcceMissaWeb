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
import { Chart } from 'chart.js';
import { Feuillet, FeuilletView } from '../../models/feuillet';
import moment from 'moment';
import { FormsModule } from '@angular/forms';
import { DownloadQrCodeModalComponent } from '../../modal/download-qrcode/download-qrcode.modal.component';
import { AddFeuilletModalComponent } from '../../modal/add-feuillet/add-feuillet.modal.component';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { ManageUsersModalComponent } from '../../modal/manage-users/manage-users.modal.component';
import { CommonModule } from '@angular/common';
import { FeuilletService } from '../../services/feuillet/feuillet.service';


@Component({
  selector: 'app-paroisse',
  standalone: true,
  imports: [EmLoaderComponent, FormsModule, CommonModule],
  templateUrl: './paroisse.component.html',
  styleUrl: './paroisse.component.scss'
})
export class ParoisseComponent implements OnInit {
  isLoading: boolean = false;
  paroisse: Paroisse;
  paymentLink: any;
  billingPortalLink: string;
  error: string;
  feuilletViews: FeuilletView[];
  chart: Chart;
  selectedPeriod: 'week' | 'month' | 'year' | 'max' = 'month';
  latestFeuillet: Feuillet;
  nextFeuillet: Feuillet;
  moment = moment;

  constructor(
    private modalService: ModalService, 
    private paroisseService: ParoisseService,
    private router: Router,
    private authService: AuthService,
    private feuilletService: FeuilletService
  ){}

  ngOnInit(): void {
    this.isLoading = true;
    this.paroisseService.getUserParoisse().subscribe({
      next: (paroisse: Paroisse) => {
        this.paroisse = paroisse;
        this.isLoading = false;
        this.loadFeuilletViews();
        this.loadLatestAndNextFeuillets();
      },
      error: (error) => {
        this.isLoading = false;
        this.error = error.status === 404 ? 'paroisse' : error.message || 'Une erreur est survenue';
      }
    });
  }

  getRole(): string[] | null {
    return this.authService.getRoles();
  }

  loadFeuilletViews(): void {
    const { startDate, endDate } = this.getDateRange();
  
    this.paroisseService.getFeuilletViews(this.paroisse.id, startDate, endDate).subscribe((feuilletViews: FeuilletView[]) => {
      this.feuilletViews = feuilletViews;
      this.createChart();
    });
  }
  
  loadLatestAndNextFeuillets(): void {
    this.paroisseService.getLatestAndNextFeuillets(this.paroisse.id).subscribe({
      next: ({ latest_feuillet, next_feuillet }) => {
        this.latestFeuillet = latest_feuillet;
        this.nextFeuillet = next_feuillet;
      },
      error: (error) => {
        console.error('Erreur lors de la récupération des feuillets:', error);
      }
    });
  }

  getDateRange(): { startDate: string; endDate: string } {
    const today = moment().endOf('day'); // Fin de la journée actuelle
    let startDate: moment.Moment;
  
    switch (this.selectedPeriod) {
      case 'week':
        startDate = moment().startOf('isoWeek');
        break;
      case 'month':
        startDate = moment().startOf('month');
        break;
      case 'year':
        startDate = moment().startOf('year');
        break;
      case 'max':
        startDate = moment('2000-01-01');
        break;
    }
  
    return { startDate: startDate.format('YYYY-MM-DD'), endDate: today.format('YYYY-MM-DD') };
  }
  
  createChart(): void {
    const ctx = document.getElementById('viewsChart') as HTMLCanvasElement;
    const viewsByDay = this.getViewsByDay();
    const trendData = this.calculateTrend(viewsByDay.map(v => v.count));
  
    this.chart?.destroy();
  
    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: viewsByDay.map(v => v.day),
        datasets: [{
          label: `Nombre de vues`,
          data: viewsByDay.map(v => v.count),
          borderColor: '#44b63d',
          borderJoinStyle: 'round',
          borderWidth: 3,
          tension: 0.2,
          fill: false
        }, {
          label: 'Tendance',
          data: trendData,
          borderColor: '#ff6384',
          borderJoinStyle: 'round',
          borderWidth: 2,
          tension: 0.1,
          fill: false,
          borderDash: [10, 5]
        }]
      },
      options: {
        scales: {
          x: {
            type: 'time',
            time: {
              unit: 'day',
              tooltipFormat: 'DD/MM/YYYY',
              displayFormats: { day: 'DD/MM/YYYY' }
            }
          },
          y: {
            beginAtZero: true,
            ticks: {
              callback: function(value) {
                return Number.isInteger(value) ? value : null;
              }
            }
          }
        }
      }
    });
  }  

  getViewsByDay(): { day: string, count: number }[] {
    const viewsByDay = this.feuilletViews.reduce((acc: { [key: string]: number }, view) => {
      const day = moment(view.viewed_at).format('YYYY-MM-DD');
      if (!acc[day]) {
        acc[day] = 0;
      }
      acc[day]++;
      return acc;
    }, {});

    return Object.keys(viewsByDay).map(day => ({
      day,
      count: viewsByDay[day]
    }));
  }

  calculateTrend(data: number[]): number[] {
    const n = data.length;
    const sumX = data.reduce((sum, _, i) => sum + i, 0);
    const sumY = data.reduce((sum, y) => sum + y, 0);
    const sumXY = data.reduce((sum, y, i) => sum + i * y, 0);
    const sumX2 = data.reduce((sum, _, i) => sum + i * i, 0);

    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    return data.map((_, i) => Math.max(0, slope * i + intercept));
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
          this.loadFeuilletViews();
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
          this.loadFeuilletViews();
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
          this.loadFeuilletViews();
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
          this.loadFeuilletViews();
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
          this.loadFeuilletViews();
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
          this.loadFeuilletViews();
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
    const modalRef = this.modalService.open(DownloadQrCodeModalComponent, modalOptions, {paroisseId: this.paroisse.id});
  }

  openAddFeuilletModal() {
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
      this.router.navigate(['/']);
    });
  }

  openManageUserModal() {
    const modalRef = this.modalService.open(ManageUsersModalComponent, {
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
    }, {paroisseId: this.paroisse.id});

    modalRef.closed.subscribe(() => {
      this.isLoading = true;
      this.paroisseService.getUserParoisse().subscribe({
        next: (paroisse: Paroisse) => {
          this.paroisse = paroisse;
          this.loadFeuilletViews();
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

  openFeuillet(feuilletId: number): void {
    window.open(this.feuilletService.showFeuilletPdf(feuilletId), '_blank')
  }
}
