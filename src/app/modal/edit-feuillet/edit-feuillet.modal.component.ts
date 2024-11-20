import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ModalService } from '../../modal.service';
import { CommonModule } from '@angular/common';
import { FeuilletService } from '../../services/feuillet/feuillet.service';
import { Feuillet, FeuilletData } from '../../models/feuillet';
import { Formify } from '../../utils/formify.utils';
import { catchError, finalize, map, Observable, of, switchMap, tap } from 'rxjs';
import { ParoisseService } from '../../services/paroisse/paroisse.service';
import { Paroisse } from '../../models/paroisse';
import { Eglise } from '../../models/eglise';
import { EgliseService } from '../../services/eglise/eglise.service';
import { EmLoaderComponent } from '../../modules/em-loader/em-loader.component';

@Component({
  selector: 'app-edit-feuillet.modal',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, EmLoaderComponent],
  templateUrl: './edit-feuillet.modal.component.html',
  styleUrl: './edit-feuillet.modal.component.scss'
})
export class EditFeuilletModalComponent implements OnInit {
  feuilletFile!: File | null | undefined;
  isLoading: boolean = false;
  paroisses: Paroisse[];
  fileName: string | undefined;
  @Input() data: any;

  editFeuilletForm: FormGroup = this.fb.group<Formify<FeuilletData>>({
    celebration_date: [null, Validators.required],
    paroisse_id: [null, Validators.required],
    feuillet: [null]
  });

  constructor(
    private fb: FormBuilder, 
    public modalService: ModalService, 
    private feuilletService: FeuilletService,
    private paroisseService: ParoisseService,
    private egliseService: EgliseService
  ){}

  ngOnInit(): void {
    this.isLoading = true;
    this.feuilletService.getFeuilletById(this.modalService.data.feuilletId).subscribe((feuillet: Feuillet) => {
      this.paroisseService.getParoisses().subscribe((paroisses: Paroisse[]) => {
        this.paroisses = paroisses;
        this.editFeuilletForm.controls['celebration_date'].setValue(feuillet.celebrationDate);
        this.editFeuilletForm.controls['paroisse_id'].setValue(feuillet.paroisse);
        this.isLoading = false;
      });
    })
  }

  close(): void {
    this.modalService.close();
  }

  handleFileInput(e: Event): void {
    this.editFeuilletForm.controls['feuillet'].setValue((e.target as HTMLInputElement).files?.item(0));
    this.fileName = (e.target as HTMLInputElement).files?.item(0)?.name
  }

  submitForm(): Observable<void> {
    return of(undefined).pipe(
      tap(() => {
        this.isLoading = true;
      }),
      switchMap(() => {
        const feuillet: FeuilletData = this.editFeuilletForm.getRawValue();
        return this.feuilletService.updateFeuillet(this.modalService.data.feuilletId, feuillet);
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
