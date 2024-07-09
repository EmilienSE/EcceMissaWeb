import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ModalService } from '../../modal.service';
import { CommonModule } from '@angular/common';
import { FeuilletService } from '../../services/feuillet/feuillet.service';
import { FeuilletData } from '../../models/feuillet';
import { Formify } from '../../utils/formify.utils';
import { catchError, finalize, map, Observable, of, switchMap, tap } from 'rxjs';
import { ParoisseService } from '../../services/paroisse/paroisse.service';
import { Paroisse } from '../../models/paroisse';
import { Eglise } from '../../models/eglise';
import { EgliseService } from '../../services/eglise/eglise.service';

@Component({
  selector: 'app-add-feuillet.modal',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './add-feuillet.modal.component.html',
  styleUrl: './add-feuillet.modal.component.scss'
})
export class AddFeuilletModalComponent implements OnInit {
  feuilletFile!: File | null | undefined;
  isLoading: boolean = false;
  paroisses: Paroisse[];
  eglises: Eglise[];

  addFeuilletForm: FormGroup = this.fb.group<Formify<FeuilletData>>({
    eglise_id: [null, Validators.required],
    celebration_date: [null, Validators.required],
    paroisse_id: [null, Validators.required],
    feuillet: [null, Validators.required]
  });

  constructor(
    private fb: FormBuilder, 
    private modalService: ModalService, 
    private feuilletService: FeuilletService,
    private paroisseService: ParoisseService,
    private egliseService: EgliseService
  ){}

  ngOnInit(): void {
      this.paroisseService.getParoisses().subscribe((paroisses: Paroisse[]) => {
        this.paroisses = paroisses;
      });
      this.egliseService.getEglises().subscribe((eglises: Eglise[]) => {
        this.eglises = eglises;
      });
  }

  close(): void {
    this.modalService.close();
  }

  handleFileInput(e: Event): void {
    this.addFeuilletForm.controls['feuillet'].setValue((e.target as HTMLInputElement).files?.item(0));
  }

  submitForm(): Observable<void> {
    return of(undefined).pipe(
      tap(() => {
        this.isLoading = true;
      }),
      switchMap(() => {
        const newFeuillet: FeuilletData = this.addFeuilletForm.getRawValue();
        return this.feuilletService.addFeuillet(newFeuillet);
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
