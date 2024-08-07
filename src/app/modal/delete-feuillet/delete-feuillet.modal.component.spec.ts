import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteFeuilletModalComponent } from './delete-feuillet.modal.component';

describe('DeleteFeuilletModalComponent', () => {
  let component: DeleteFeuilletModalComponent;
  let fixture: ComponentFixture<DeleteFeuilletModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteFeuilletModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DeleteFeuilletModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
