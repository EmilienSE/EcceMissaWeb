import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddFeuilletModalComponent } from './add-feuillet.modal.component';

describe('AddFeuilletModalComponent', () => {
  let component: AddFeuilletModalComponent;
  let fixture: ComponentFixture<AddFeuilletModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddFeuilletModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddFeuilletModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
