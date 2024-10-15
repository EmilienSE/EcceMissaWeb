import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ModalService } from '../../modal.service';
import { CommonModule } from '@angular/common';
import { ParoisseService } from '../../services/paroisse/paroisse.service';
import { catchError, finalize, map, Observable, of, switchMap, tap } from 'rxjs';
import { EmLoaderComponent } from '../../modules/em-loader/em-loader.component';

@Component({
  selector: 'app-leave-paroisse.modal',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, EmLoaderComponent],
  templateUrl: './leave-paroisse.modal.component.html',
  styleUrl: './leave-paroisse.modal.component.scss'
})
export class LeaveParoisseModalComponent {
  isLoading: boolean = false;

  constructor(
    public modalService: ModalService, 
    private paroisseService: ParoisseService
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
        return this.paroisseService.leaveParoisse();
      }),
      switchMap(() => this.paroisseService.getParoisses()),
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
