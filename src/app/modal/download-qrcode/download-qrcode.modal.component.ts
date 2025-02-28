import { Component, OnInit } from '@angular/core';
import { ModalService } from '../../modal.service';
import { CommonModule } from '@angular/common';
import { ParoisseService } from '../../services/paroisse/paroisse.service';

@Component({
  selector: 'app-download-qrcode.modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './download-qrcode.modal.component.html',
  styleUrl: './download-qrcode.modal.component.scss'
})
export class DownloadQrCodeModalComponent implements OnInit {
  
  constructor( 
    public modalService: ModalService,
    private paroisseService: ParoisseService
  ){}
  
  ngOnInit(): void {
  }
  
  downloadQRCode(type: string) {
    window.open(this.paroisseService.generateParoissePdf(this.modalService.data.paroisseId, type), '_blank')
  }

  close(): void {
    this.modalService.close();
  }
}
