import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import moment from 'moment';
import { ModalService } from '../../modal.service';
import { AddFeuilletModalComponent } from '../../modal/add-feuillet.modal/add-feuillet.modal.component';
@Component({
  selector: 'app-feuillets',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './feuillets.component.html',
  styleUrl: './feuillets.component.scss'
})
export class FeuilletsComponent {
  moment: any = moment;
  feuillets: any[] = [
    {
      id: 0,
      date: new Date('04/21/2024'),
      paroisse: {
        nom: 'Cathédrale Saint-Maurice d\'Angers'
      },
      vues: 345
    },
    {
      id: 1,
      date: new Date('04/14/2024'),
      paroisse: {
        nom: 'Cathédrale Saint-Maurice d\'Angers'
      },
      vues: 588
    },
    {
      id: 2,
      date: new Date('04/07/2024'),
      paroisse: {
        nom: 'Cathédrale Saint-Maurice d\'Angers'
      },
      vues: 756
    },
    {
      id: 3,
      date: new Date('03/31/2024'),
      paroisse: {
        nom: 'Cathédrale Saint-Maurice d\'Angers'
      },
      vues: 863
    },
    {
      id: 4,
      date: new Date('03/24/2024'),
      paroisse: {
        nom: 'Cathédrale Saint-Maurice d\'Angers'
      },
      vues: 445
    },
  ]

  constructor(private modalService: ModalService){ }

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
}
