import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModosJuegoComponent } from './modos-juego.component';

describe('ModosJuegoComponent', () => {
  let component: ModosJuegoComponent;
  let fixture: ComponentFixture<ModosJuegoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModosJuegoComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ModosJuegoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
