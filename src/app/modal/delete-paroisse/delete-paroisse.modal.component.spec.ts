import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteParoisseModalComponent } from './delete-paroisse.modal.component';

describe('DeleteParoisseModalComponent', () => {
  let component: DeleteParoisseModalComponent;
  let fixture: ComponentFixture<DeleteParoisseModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteParoisseModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DeleteParoisseModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
