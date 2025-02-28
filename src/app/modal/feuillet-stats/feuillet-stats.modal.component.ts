import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ModalService } from '../../modal.service';
import { CommonModule } from '@angular/common';
import { FeuilletService } from '../../services/feuillet/feuillet.service';
import { FeuilletView } from '../../models/feuillet';
import moment from 'moment';
import { Chart, registerables } from 'chart.js';
import 'chartjs-adapter-moment';

Chart.register(...registerables);

@Component({
  selector: 'app-feuillet-stats.modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './feuillet-stats.modal.component.html',
  styleUrl: './feuillet-stats.modal.component.scss'
})
export class FeuilletStatsModalComponent implements OnInit, AfterViewInit {
  moment = moment;
  isLoading: boolean;
  feuilletViews: FeuilletView[];
  feuilletDate: string;
  chart: Chart;

  constructor(
    public modalService: ModalService, 
    private feuilletService: FeuilletService
  ){}

  ngOnInit(): void {
    this.isLoading = true;
    this.feuilletDate = this.modalService.data.celebration_date;
    this.feuilletService.getFeuilletStats(this.modalService.data.feuilletId).subscribe((feuilletViews: FeuilletView[]) => {
      this.feuilletViews = feuilletViews;
      this.isLoading = false;
      this.createChart();
    });
  }

  ngAfterViewInit(): void {
    if (!this.isLoading) {
      this.createChart();
    }
  }

  createChart(): void {
    const ctx = document.getElementById('viewsChart') as HTMLCanvasElement;
    const viewsByMinute = this.getViewsByMinute();

    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: viewsByMinute.map(v => v.minute),
        datasets: [{
          label: 'Nombre de vues',
          data: viewsByMinute.map(v => v.count),
          borderColor: '#44b63d',
          borderJoinStyle: 'round',
          borderWidth: 3,
          tension: 0.2,
          fill: false
        }]
      },
      options: {
        scales: {
          x: {
            type: 'time',
            time: {
              unit: 'minute',
              tooltipFormat: 'DD/MM/YYYY HH:mm',
              displayFormats: {
                minute: 'HH:mm'
              }
            }
          },
          y: {
            beginAtZero: true,
            ticks: {
              callback: function(value) {
                if (Number.isInteger(value)) {
                  return value;
                }
                return null;
              }
            }
          }
        }
      }
    });
  }

  getViewsByMinute(): { minute: string, count: number }[] {
    const viewsByMinute = this.feuilletViews.reduce((acc: { [key: string]: number }, view) => {
      const minute = moment(view.viewed_at).format('YYYY-MM-DD HH:mm');
      if (!acc[minute]) {
        acc[minute] = 0;
      }
      acc[minute]++;
      return acc;
    }, {});

    return Object.keys(viewsByMinute).map(minute => ({
      minute,
      count: viewsByMinute[minute]
    }));
  }

  close(): void {
    this.modalService.close();
  }
}
