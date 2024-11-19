import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteUtilisateurModalComponent } from './delete-utilisateur.modal.component';

describe('DeleteUtilisateurModalComponent', () => {
  let component: DeleteUtilisateurModalComponent;
  let fixture: ComponentFixture<DeleteUtilisateurModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteUtilisateurModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DeleteUtilisateurModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
