import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeuilletStatsModalComponent } from './feuillet-stats.modal.component';

describe('FeuilletStatsModalComponent', () => {
  let component: FeuilletStatsModalComponent;
  let fixture: ComponentFixture<FeuilletStatsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeuilletStatsModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FeuilletStatsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
