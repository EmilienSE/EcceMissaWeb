import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import moment from 'moment';
import { ModalService } from '../../modal.service';
import { AddFeuilletModalComponent } from '../../modal/add-feuillet/add-feuillet.modal.component';
import { FeuilletService } from '../../services/feuillet/feuillet.service';
import { tap } from 'rxjs';
import { Feuillet } from '../../models/feuillet';
import { EmLoaderComponent } from '../../modules/em-loader/em-loader.component';
import { EditFeuilletModalComponent } from '../../modal/edit-feuillet/edit-feuillet.modal.component';
import { Options } from '../../modal/modal-options';
import { DeleteFeuilletModalComponent } from '../../modal/delete-feuillet/delete-feuillet.modal.component';
@Component({
  selector: 'app-feuillets',
  standalone: true,
  imports: [CommonModule, EmLoaderComponent],
  templateUrl: './feuillets.component.html',
  styleUrl: './feuillets.component.scss'
})
export class FeuilletsComponent implements OnInit {
  moment = moment;
  feuillets: Feuillet[];
  isLoading: boolean = false;

  constructor(
    private modalService: ModalService,
    private feuilletService: FeuilletService){ }

  ngOnInit(): void {
    this.isLoading = true;
    this.feuilletService.getFeuillets().subscribe((feuillets: Feuillet[]) => {
      this.feuillets = feuillets;
      this.isLoading = false;
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

  openFeuillet(feuilletId: number, event: Event): void {
    event.stopPropagation();
    window.open(this.feuilletService.showFeuilletPdf(feuilletId), '_blank')
  }

  deleteFeuillet(feuilletId: number, event: Event) {
    event.stopPropagation();
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
    this.modalService.open(DeleteFeuilletModalComponent, options, {feuilletId});
  }

  editFeuillet(feuilletId: number, event: Event) {
    event.stopPropagation();
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
    this.modalService.open(EditFeuilletModalComponent, options, {feuilletId});
  }
}
