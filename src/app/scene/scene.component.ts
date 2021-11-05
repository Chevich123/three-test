import { AfterViewInit, Component, ElementRef, HostListener, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { debounceTime, Subject, Subscription, switchMap } from 'rxjs';
import * as THREE from 'three';
import { IMesh } from '../interfaces/mesh.interface';
import { CameraService } from '../services/camera.service';
import { ICamera } from '../interfaces/camera.interface';

export enum KEY_CODE {
  RIGHT_ARROW = 'ArrowRight',
  LEFT_ARROW = 'ArrowLeft',
  UP_ARROW = 'ArrowUp',
  DOWN_ARROW = 'ArrowDown',
}

@Component({
  selector: 'app-scene',
  templateUrl: './scene.component.html',
  styleUrls: ['./scene.component.scss'],
})
export class SceneComponent implements AfterViewInit, OnInit, OnDestroy {
  @ViewChild('canvas') canvasRef: ElementRef | undefined;
  nearClippingPlane = 1;
  farClippingPlane = 10000;
  cameraPosition: ICamera | undefined;
  fieldOfView = 10;
  step = 0.3;
  camera!: THREE.PerspectiveCamera;
  mesh: THREE.Mesh[] = [];
  animations: ((() => void) | null)[] = [];
  renderer!: THREE.WebGLRenderer;
  scene!: THREE.Scene;
  sub = new Subscription();
  changes = new Subject<THREE.Vector3>();

  constructor(
    private readonly cameraService: CameraService,
  ) {
  }

  @Input() set meshes(values: IMesh[]) {
    values.forEach(value => {
      const mesh = new THREE.Mesh(value.geometry, value.material);
      const { x, y, z } = value.position;
      mesh.position.set(x, y, z);
      this.mesh.push(mesh);
      this.animations.push(value.animation ? value.animation.bind(this, mesh) : null);
    });
  };

  get canvas(): HTMLCanvasElement {
    return this.canvasRef?.nativeElement;
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  ngOnInit(): void {
    this.sub.add(this.changes.pipe(
      debounceTime(600),
      switchMap(value => this.cameraService.saveCameraPosition(value)),
    ).subscribe(() => {
    }));
    this.cameraService.readCameraPosition().subscribe(position => {
      this.cameraPosition = position;
      if (this.camera) {
        const { x, y, z } = this.cameraPosition;
        this.camera.position.set(x, y, z);
      }
    });
  }

  @HostListener('window:keydown', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (![
      KEY_CODE.UP_ARROW,
      KEY_CODE.DOWN_ARROW,
      KEY_CODE.LEFT_ARROW,
      KEY_CODE.RIGHT_ARROW,
    ].includes(event.key as KEY_CODE)) {
      return;
    }
    event.preventDefault();
    if (event.key === KEY_CODE.UP_ARROW) {
      this.camera.translateY(-this.step);
    }

    if (event.key === KEY_CODE.DOWN_ARROW) {
      this.camera.translateY(this.step);
    }
    if (event.key === KEY_CODE.LEFT_ARROW) {
      this.camera.translateX(this.step);
    }

    if (event.key === KEY_CODE.RIGHT_ARROW) {
      this.camera.translateX(-this.step);
    }

    this.changes.next(this.camera.position);
  }

  @HostListener('wheel', ['$event'])
  wheelEvent(event: WheelEvent) {
    event.preventDefault();
    this.camera.translateZ(event.deltaY < 0 ? -10 : 10);
    this.changes.next(this.camera.position);
  }

  ngAfterViewInit(): void {
    this.createScene();
    this.startRenderingLoop();
  }

  getAspectRatio(): number {
    return this.canvas.clientWidth / this.canvas.clientHeight;
  }

  createScene() {
    // light on camera
    const cameraPointLight = new THREE.PointLight(0xffffff);
    cameraPointLight.position.set(1, 1, 2);

    // scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color('black');
    this.scene.add(...this.mesh);

    // camera
    let aspectRatio = this.getAspectRatio();
    this.camera = new THREE.PerspectiveCamera(
      this.fieldOfView,
      aspectRatio,
      this.nearClippingPlane,
      this.farClippingPlane,
    );
    this.camera.add(cameraPointLight);

    this.scene.add(this.camera);
  }

  startRenderingLoop() {
    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas });
    this.renderer.setPixelRatio(devicePixelRatio);
    this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);

    let component: SceneComponent = this;
    (function render() {
      requestAnimationFrame(render);
      component.animations.forEach(animation => {
        if (!animation) {
          return;
        }
        animation();
      });
      component.renderer.render(component.scene, component.camera);
    }());
  }

}
