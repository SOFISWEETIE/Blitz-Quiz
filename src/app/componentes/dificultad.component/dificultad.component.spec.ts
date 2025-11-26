import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DificultadComponent } from './dificultad.component';

describe('DificultadComponent', () => {
  let component: DificultadComponent;
  let fixture: ComponentFixture<DificultadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DificultadComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DificultadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
