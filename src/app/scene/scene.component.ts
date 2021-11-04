import { AfterViewInit, Component, ElementRef, HostListener, Input, OnInit, ViewChild } from '@angular/core';
import * as THREE from 'three';

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
export class SceneComponent implements AfterViewInit, OnInit {
  @ViewChild('canvas') canvasRef: ElementRef | undefined;
  @Input() cameraZ: number = 400;
  @Input() fieldOfView: number = 10;
  @Input('nearClipping') nearClippingPlane: number = 1;
  @Input('farClipping') farClippingPlane: number = 10000;
  step = 0.3;
  rotationSpeedX: number = 0.1;
  rotationSpeedY: number = 0.01;
  pokeBallTexture: string = '/assets/45634.png';
  texture: string = '/assets/texture.jpg';
  camera!: THREE.PerspectiveCamera;
  loader = new THREE.TextureLoader();
  geometry = new THREE.SphereGeometry();
  geometry2 = new THREE.BoxGeometry(2, 2, 2);
  mesh: THREE.Mesh[] = [];
  renderer!: THREE.WebGLRenderer;
  scene!: THREE.Scene;

  constructor() {
  }

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

  ngOnInit(): void {
    const pokeBallMaterial = new THREE.MeshLambertMaterial({ map: this.loader.load(this.pokeBallTexture) });
    const material = new THREE.MeshLambertMaterial({ map: this.loader.load(this.texture) });
    this.mesh.push(new THREE.Mesh(this.geometry, pokeBallMaterial));
    this.mesh.push(new THREE.Mesh(this.geometry2, material));
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
    // if (this.mesh[0]) {
    //   this.mesh[0].position.set(0, 0, 0);
    // }
    if (this.mesh[1]) {
      this.mesh[1].position.x = -5;
      this.mesh[1].position.y = 5;
    }
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

  animateCube(index: number) {
    if (!this.mesh[index]) {
      return;
    }
    this.mesh[index].rotation.x += this.rotationSpeedX;
    this.mesh[index].rotation.y += this.rotationSpeedY;
  }

  startRenderingLoop() {
    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas });
    this.renderer.setPixelRatio(devicePixelRatio);
    this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);

    let component: SceneComponent = this;
    (function render() {
      requestAnimationFrame(render);
      component.animateCube(0);
      component.animateCube(1);
      component.renderer.render(component.scene, component.camera);
    }());
  }

}
