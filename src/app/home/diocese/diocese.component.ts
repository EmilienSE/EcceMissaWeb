import { Component, OnInit } from '@angular/core';
import { DioceseService } from '../../services/diocese/diocese.service';
import { Diocese } from '../../models/diocese';
import { EmLoaderComponent } from '../../modules/em-loader/em-loader.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-diocese',
  standalone: true,
  imports: [EmLoaderComponent, RouterLink],
  templateUrl: './diocese.component.html',
  styleUrl: './diocese.component.scss'
})
export class DioceseComponent implements OnInit {
  isLoading: boolean;
  error: string;
  diocese: Diocese;

  constructor(private dioceseService: DioceseService){}

  ngOnInit(): void {
    this.isLoading = true;
    this.dioceseService.getUserDiocese().subscribe({
      next: (paroisse: Diocese) => {
        this.diocese = paroisse;
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
}
