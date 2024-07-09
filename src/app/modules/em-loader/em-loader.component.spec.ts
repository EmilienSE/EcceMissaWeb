import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmLoaderComponent } from './em-loader.component';

describe('EmLoaderComponent', () => {
  let component: EmLoaderComponent;
  let fixture: ComponentFixture<EmLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmLoaderComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EmLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
