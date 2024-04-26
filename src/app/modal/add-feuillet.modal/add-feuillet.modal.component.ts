import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalService } from '../../modal.service';

@Component({
  selector: 'app-add-feuillet.modal',
  standalone: true,
  imports: [],
  templateUrl: './add-feuillet.modal.component.html',
  styleUrl: './add-feuillet.modal.component.scss'
})
export class AddFeuilletModalComponent implements OnInit {
  addFeuilletForm: FormGroup;

  constructor(private fb: FormBuilder, private modalService: ModalService){}

  ngOnInit(): void {
      this.addFeuilletForm = this.fb.group({
        celebrationDate: ['', Validators.required],
        paroisse: ['', Validators.required],
        fichier: ['', Validators.required]
      })
  }

  close(): void {
    this.modalService.close();
  }
}
