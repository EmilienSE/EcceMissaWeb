import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditFeuilletModalComponent } from './edit-feuillet.modal.component';

describe('EditFeuilletModalComponent', () => {
  let component: EditFeuilletModalComponent;
  let fixture: ComponentFixture<EditFeuilletModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditFeuilletModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditFeuilletModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
