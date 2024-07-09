import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import moment from 'moment';
import { ModalService } from '../../modal.service';
import { AddFeuilletModalComponent } from '../../modal/add-feuillet.modal/add-feuillet.modal.component';
import { FeuilletService } from '../../services/feuillet/feuillet.service';
import { tap } from 'rxjs';
import { Feuillet } from '../../models/feuillet';
@Component({
  selector: 'app-feuillets',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './feuillets.component.html',
  styleUrl: './feuillets.component.scss'
})
export class FeuilletsComponent implements OnInit {
  moment = moment;
  feuillets: Feuillet[];

  constructor(
    private modalService: ModalService,
    private feuilletService: FeuilletService){ }

  ngOnInit(): void {
      this.feuilletService.getFeuillets().subscribe((feuillets: Feuillet[]) => {
        this.feuillets = feuillets;
      });
  }

  openAddModal() {
    this.modalService.open(AddFeuilletModalComponent, {
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

  openFeuillet(feuilletId: number): void {
    window.open(this.feuilletService.showFeuilletPdf(feuilletId), '_blank')
  }
}
