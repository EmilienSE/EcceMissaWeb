import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParoisseComponent } from './paroisse.component';

describe('ParoisseComponent', () => {
  let component: ParoisseComponent;
  let fixture: ComponentFixture<ParoisseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParoisseComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ParoisseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
