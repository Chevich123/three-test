import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import * as THREE from 'three';
import { MeshBasicMaterial } from 'three/src/materials/MeshBasicMaterial';

@Component({
  selector: 'app-sphere',
  templateUrl: './sphere.component.html',
  styleUrls: ['./sphere.component.scss'],
})
export class SphereComponent implements AfterViewInit, OnInit {
  @ViewChild('canvas') canvasRef: ElementRef | undefined;
  @Input() rotationSpeedX: number = 0.1;
  @Input() rotationSpeedY: number = 0.01;
  @Input() size: number = 200;
  @Input() texture: string = '/assets/texture.jpg';

  @Input() cameraZ: number = 400;
  @Input() fieldOfView: number = 1;
  @Input('nearClipping') nearClippingPlane: number = 1;
  @Input('farClipping') farClippingPlane: number = 1000;

  camera!: THREE.PerspectiveCamera;
  loader = new THREE.TextureLoader();
  geometry = new THREE.SphereGeometry();
  material!: THREE.MeshBasicMaterial ;
  mesh!: THREE.Mesh;


  renderer!: THREE.WebGLRenderer;
  scene!: THREE.Scene;

  constructor() {
  }

  ngOnInit(): void {
    this.material = new THREE.MeshBasicMaterial({ map: this.loader.load(this.texture) });
    this.mesh = new THREE.Mesh(this.geometry, this.material);
  }

  get canvas(): HTMLCanvasElement {
    return this.canvasRef?.nativeElement;
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
    this.scene.add(this.mesh);

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
    this.mesh.rotation.x += this.rotationSpeedX;
    this.mesh.rotation.y += this.rotationSpeedY;
  }

  startRenderingLoop() {
    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas });
    this.renderer.setPixelRatio(devicePixelRatio);
    this.renderer.setSize(this.canvas.clientWidth / 2, this.canvas.clientHeight / 2);

    let component: SphereComponent = this;
    (function render() {
      requestAnimationFrame(render);
      component.animateCube();
      component.renderer.render(component.scene, component.camera);
    }());
  }

}
