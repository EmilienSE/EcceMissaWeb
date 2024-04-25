import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeuilletsComponent } from './feuillets.component';

describe('FeuilletsComponent', () => {
  let component: FeuilletsComponent;
  let fixture: ComponentFixture<FeuilletsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeuilletsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FeuilletsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
