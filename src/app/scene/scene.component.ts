import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'app-scene',
  templateUrl: './scene.component.html',
  styleUrls: ['./scene.component.scss'],
})
export class SceneComponent implements AfterViewInit, OnInit {
  @ViewChild('canvas') canvasRef: ElementRef | undefined;
  @Input() cameraZ: number = 400;
  @Input() fieldOfView: number = 1;
  @Input('nearClipping') nearClippingPlane: number = 1;
  @Input('farClipping') farClippingPlane: number = 1000;

  rotationSpeedX: number = 0.1;
  rotationSpeedY: number = 0.01;
  size: number = 200;
  texture: string = '/assets/45634.png';

  camera!: THREE.PerspectiveCamera;
  loader = new THREE.TextureLoader();
  geometry = new THREE.SphereGeometry();
  material!: THREE.MeshBasicMaterial;
  mesh: THREE.Mesh[] = [];

  renderer!: THREE.WebGLRenderer;
  scene!: THREE.Scene;

  constructor() {
  }

  get canvas(): HTMLCanvasElement {
    return this.canvasRef?.nativeElement;
  }

  ngOnInit(): void {
    this.material = new THREE.MeshBasicMaterial({ map: this.loader.load(this.texture) });
    this.mesh.push(new THREE.Mesh(this.geometry, this.material));
  }

  ngAfterViewInit(): void {
    this.createScene();
    this.startRenderingLoop();
  }

  getAspectRatio(): number {
    return this.canvas.clientWidth / this.canvas.clientHeight;
  }

  createScene() {
    // scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color('green');
    this.scene.add(...this.mesh);

    // camera
    let aspectRatio = this.getAspectRatio();
    this.camera = new THREE.PerspectiveCamera(
      this.fieldOfView,
      aspectRatio,
      this.nearClippingPlane,
      this.farClippingPlane,
    );
    this.camera.position.z = this.cameraZ;
  }

  animateCube() {
    if (!this.mesh[0]) {
      return;
    }
    this.mesh[0].rotation.x += this.rotationSpeedX;
    this.mesh[0].rotation.y += this.rotationSpeedY;
  }

  startRenderingLoop() {
    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas });
    this.renderer.setPixelRatio(devicePixelRatio);
    this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);

    let component: SceneComponent = this;
    (function render() {
      requestAnimationFrame(render);
      component.animateCube();
      component.renderer.render(component.scene, component.camera);
    }());
  }

}
