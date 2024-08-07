import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ModalService } from '../../modal.service';
import { CommonModule } from '@angular/common';
import { FeuilletService } from '../../services/feuillet/feuillet.service';
import { catchError, finalize, map, Observable, of, switchMap, tap } from 'rxjs';
import { EmLoaderComponent } from '../../modules/em-loader/em-loader.component';

@Component({
  selector: 'app-delete-feuillet.modal',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, EmLoaderComponent],
  templateUrl: './delete-feuillet.modal.component.html',
  styleUrl: './delete-feuillet.modal.component.scss'
})
export class DeleteFeuilletModalComponent {
  isLoading: boolean = false;

  constructor(
    public modalService: ModalService, 
    private feuilletService: FeuilletService
  ){}

  close(): void {
    this.modalService.close();
  }

  submitForm(): Observable<void> {
    return of(undefined).pipe(
      tap(() => {
        this.isLoading = true;
      }),
      switchMap(() => {
        return this.feuilletService.deleteFeuillet(this.modalService.data.feuilletId);
      }),
      switchMap(() => this.feuilletService.getFeuillets()),
      catchError((err) => {
        if (err instanceof Error) {
          console.error(err);
        }
        return of(undefined);
      }),
      finalize(() => {
        this.isLoading = false;
        this.modalService.close();
      }),
      map(() => {})
    );
  }
}
