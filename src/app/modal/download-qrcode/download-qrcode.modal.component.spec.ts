import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DownloadQrCodeModalComponent } from './download-qrcode.modal.component';

describe('DownloadQrCode', () => {
  let component: DownloadQrCodeModalComponent;
  let fixture: ComponentFixture<DownloadQrCodeModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DownloadQrCodeModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DownloadQrCodeModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
