import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaveParoisseModalComponent } from './leave-paroisse.modal.component';

describe('LeaveParoisseModalComponent', () => {
  let component: LeaveParoisseModalComponent;
  let fixture: ComponentFixture<LeaveParoisseModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeaveParoisseModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LeaveParoisseModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
