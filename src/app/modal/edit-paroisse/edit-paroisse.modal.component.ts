import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ModalService } from '../../modal.service';
import { CommonModule } from '@angular/common';
import { ParoisseService } from '../../services/paroisse/paroisse.service';
import { catchError, finalize, map, Observable, of, switchMap, tap } from 'rxjs';
import { EmLoaderComponent } from '../../modules/em-loader/em-loader.component';
import { Formify } from '../../utils/formify.utils';
import { Paroisse, ParoisseData } from '../../models/paroisse';
import { DioceseService } from '../../services/diocese/diocese.service';
import { Diocese } from '../../models/diocese';

@Component({
  selector: 'app-edit-paroisse.modal',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, EmLoaderComponent],
  templateUrl: './edit-paroisse.modal.component.html',
  styleUrl: './edit-paroisse.modal.component.scss'
})
export class EditParoisseModalComponent implements OnInit {
  isLoading: boolean = false;

  editParoisseForm: FormGroup = this.fb.group<Formify<ParoisseData>>({
    nom: [null, Validators.required],
    gps: ['', Validators.required],
    diocese_id: [null, Validators.required]
  });
  dioceses: Diocese[];

  constructor(
    public modalService: ModalService, 
    private paroisseService: ParoisseService,
    private dioceseService: DioceseService,
    private fb: FormBuilder
  ){}

  ngOnInit():void {
    this.isLoading = true;
    this.paroisseService.getUserParoisse().subscribe((paroisse: Paroisse) => {
      this.dioceseService.getDioceses().subscribe((dioceses: Diocese[]) => {
        this.dioceses = dioceses;
        this.editParoisseForm.controls['nom'].setValue(paroisse.nom);
        this.editParoisseForm.controls['gps'].setValue(paroisse.gps);
        this.editParoisseForm.controls['diocese_id'].setValue(paroisse.diocese_id);
        this.isLoading = false;
      });
    });
  }

  close(): void {
    this.modalService.close();
  }

  submitForm(): Observable<void> {
    return of(undefined).pipe(
      tap(() => {
        this.isLoading = true;
      }),
      switchMap(() => {
        const editParoisse: ParoisseData = this.editParoisseForm.getRawValue();
        return this.paroisseService.updateParoisse(this.modalService.data.paroisseId, editParoisse);
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
