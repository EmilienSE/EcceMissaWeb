import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ModalService } from '../../modal.service';
import { CommonModule } from '@angular/common';
import { ParoisseService } from '../../services/paroisse/paroisse.service';
import { catchError, finalize, map, Observable, of, switchMap, tap } from 'rxjs';
import { EmLoaderComponent } from '../../modules/em-loader/em-loader.component';
import { Formify } from '../../utils/formify.utils';
import { JoinParoisseData } from '../../models/paroisse';

@Component({
  selector: 'app-join-paroisse.modal',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, EmLoaderComponent],
  templateUrl: './join-paroisse.modal.component.html',
  styleUrl: './join-paroisse.modal.component.scss'
})
export class JoinParoisseModalComponent {
  isLoading: boolean = false;

  joinParoisseForm: FormGroup = this.fb.group<Formify<JoinParoisseData>>({
    codeUnique: [null, Validators.required]
  });

  constructor(
    public modalService: ModalService, 
    private paroisseService: ParoisseService,
    private fb: FormBuilder
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
        const joinParoisse: JoinParoisseData = this.joinParoisseForm.getRawValue();
        return this.paroisseService.joinParoisse(joinParoisse);
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
