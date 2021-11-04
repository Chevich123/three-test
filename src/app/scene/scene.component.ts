import { AfterViewInit, Component, ElementRef, HostListener, Input, ViewChild } from '@angular/core';
import * as THREE from 'three';
import { IMesh } from '../mesh.interface';

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
export class SceneComponent implements AfterViewInit {
  @ViewChild('canvas') canvasRef: ElementRef | undefined;
  @Input() cameraZ: number = 250;
  @Input() fieldOfView: number = 10;
  @Input('nearClipping') nearClippingPlane: number = 1;
  @Input('farClipping') farClippingPlane: number = 10000;
  step = 0.3;
  camera!: THREE.PerspectiveCamera;
  mesh: THREE.Mesh[] = [];
  animations: ((() => void) | null)[] = [];
  renderer!: THREE.WebGLRenderer;
  scene!: THREE.Scene;

  constructor() {
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

  @HostListener('window:keydown', ['$event'])
  keyEvent(event: KeyboardEvent) {
    event.preventDefault();
    if (event.key === KEY_CODE.UP_ARROW) {
      this.camera.translateY(this.step);
    }

    if (event.key === KEY_CODE.DOWN_ARROW) {
      this.camera.translateY(-this.step);
    }
    if (event.key === KEY_CODE.LEFT_ARROW) {
      this.camera.translateX(this.step);
    }

    if (event.key === KEY_CODE.RIGHT_ARROW) {
      this.camera.translateX(-this.step);
    }
  }

  @HostListener('wheel', ['$event'])
  wheelEvent(event: WheelEvent) {
    event.preventDefault();
    if (event.deltaY < 0) {
      this.camera.translateZ(-10);
      return;
    }
    this.camera.translateZ(10);

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
    this.camera.position.z = this.cameraZ;

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
