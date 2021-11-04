import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SphereComponent } from './sphere.component';

describe('CubeComponent', () => {
  let component: SphereComponent;
  let fixture: ComponentFixture<SphereComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SphereComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SphereComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
