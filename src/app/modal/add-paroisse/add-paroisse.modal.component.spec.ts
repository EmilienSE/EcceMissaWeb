import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddParoisseModalComponent } from './add-paroisse.modal.component';

describe('AddParoisseModalComponent', () => {
  let component: AddParoisseModalComponent;
  let fixture: ComponentFixture<AddParoisseModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddParoisseModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddParoisseModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
