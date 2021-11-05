import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import * as THREE from 'three';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
      ],
      declarations: [
        AppComponent,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be defined', () => {
    expect(component).toBeTruthy();
  });

  it('should create a mesh array', () => {
    expect(component.meshes).toEqual(jasmine.any(Array));
    expect(component.meshes.length).toEqual(2);

    expect(component.meshes[0].geometry).toEqual(jasmine.any(THREE.SphereGeometry));
    expect(component.meshes[0].material).toEqual(jasmine.any(THREE.MeshLambertMaterial));
    expect(component.meshes[0].animation).toEqual(jasmine.any(Function));
    expect(component.meshes[1].geometry).toEqual(jasmine.any(THREE.LatheBufferGeometry));
    expect(component.meshes[1].material).toEqual(jasmine.any(THREE.MeshLambertMaterial));
    expect(component.meshes[1].animation).toEqual(jasmine.any(Function));
  });
});
