import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import moment from 'moment';
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
      date: new Date(),
      paroisse: {
        nom: 'Cathédrale Saint-Maurice d\'Angers'
      },
      vues: 345
    },
    {
      id: 1,
      date: new Date(),
      paroisse: {
        nom: 'Cathédrale Saint-Maurice d\'Angers'
      },
      vues: 588
    },
    {
      id: 2,
      date: new Date(),
      paroisse: {
        nom: 'Cathédrale Saint-Maurice d\'Angers'
      },
      vues: 756
    },
    {
      id: 3,
      date: new Date(),
      paroisse: {
        nom: 'Cathédrale Saint-Maurice d\'Angers'
      },
      vues: 863
    },
    {
      id: 4,
      date: new Date(),
      paroisse: {
        nom: 'Cathédrale Saint-Maurice d\'Angers'
      },
      vues: 445
    },
  ]
}
