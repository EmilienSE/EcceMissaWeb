import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DioceseComponent } from './diocese.component';

describe('DioceseComponent', () => {
  let component: DioceseComponent;
  let fixture: ComponentFixture<DioceseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DioceseComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DioceseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
