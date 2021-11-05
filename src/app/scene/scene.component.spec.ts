import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SceneComponent } from './scene.component';
import { CameraService } from '../services/camera.service';
import { of } from 'rxjs';

describe('SceneComponent', () => {
  let component: SceneComponent;
  let fixture: ComponentFixture<SceneComponent>;

  const mockCameraService = {
    saveCameraPosition: jasmine.createSpy().and.returnValue(of({})),
    readCameraPosition: jasmine.createSpy().and.returnValue(of({})),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SceneComponent],
      providers: [
        { provide: CameraService, useValue: mockCameraService },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SceneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
