import { Component, OnInit } from '@angular/core';
import { ModalService } from '../../modal.service';
import { AddParoisseModalComponent } from '../../modal/add-paroisse/add-paroisse.modal.component';
import { EmLoaderComponent } from '../../modules/em-loader/em-loader.component';
import { Paroisse } from '../../models/paroisse';
import { ParoisseService } from '../../services/paroisse/paroisse.service';
import { Options } from '../../modal/modal-options';
import { DeleteParoisseModalComponent } from '../../modal/delete-paroisse/delete-paroisse.modal.component';
import { JoinParoisseModalComponent } from '../../modal/join-paroisse/join-paroisse.modal.component';
import { LeaveParoisseModalComponent } from '../../modal/leave-paroisse/leave-paroisse.modal.component';

@Component({
  selector: 'app-paroisse',
  standalone: true,
  imports: [EmLoaderComponent],
  templateUrl: './paroisse.component.html',
  styleUrl: './paroisse.component.scss'
})
export class ParoisseComponent implements OnInit {
  isLoading: boolean = false;
  paroisse: Paroisse;
  constructor(private modalService: ModalService, private paroisseService: ParoisseService){}

  ngOnInit(): void {
    this.isLoading = true;
    this.paroisseService.getUserParoisse().subscribe((paroisse: Paroisse) => {
      this.paroisse = paroisse;
      this.isLoading = false;
    });
  }

  openAddModal() {
    this.modalService.open(AddParoisseModalComponent, {
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

  openParoisse(paroisseId: number, event: Event){
    event.stopPropagation();

  }

  openEditModal() {
    throw new Error('Method not implemented.');
  }

  openDeleteModal() {
    const options: Options = {
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
    }
    this.modalService.open(DeleteParoisseModalComponent, options, {paroisseId: this.paroisse.id});
  }
  
  openJoinModal() {
    const options: Options = {
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
    }
    this.modalService.open(JoinParoisseModalComponent, options);
  }

  openLeaveParoisseModal() {
    const options: Options = {
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
    }
    this.modalService.open(LeaveParoisseModalComponent, options, {paroisseId: this.paroisse.id});
  }

  openPaymentModal() {
    throw new Error('Method not implemented.');
  }
}
