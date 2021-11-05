import { Component } from '@angular/core';
import { IMesh } from './interfaces/mesh.interface';
import * as THREE from 'three';
import { Vector3 } from 'three/src/math/Vector3';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'front-app';
  loader = new THREE.TextureLoader();
  pokeBallTexture: string = '/assets/red.png';
  windowTexture: string = '/assets/wood.jpg';
  rotationSpeedX: number = 0.1;
  rotationSpeedY: number = 0.01;
  meshes: IMesh[] = [];

  constructor() {
    const points = [];
    const ratio = 2;
    for (let deg = 0; deg <= 180; deg += 6) {
      const rad = Math.PI * deg / 180;
      const point = new THREE.Vector2((0.72 + .08 * Math.cos(rad)) * Math.sin(rad) * ratio, -Math.cos(rad) * ratio);
      points.push(point);
    }

    this.meshes = [
      {
        geometry: new THREE.SphereGeometry(2),
        material: new THREE.MeshLambertMaterial({ map: this.loader.load(this.pokeBallTexture) }),
        position: new Vector3(0, 0, 0),
        animation: (mesh: THREE.Mesh) => {
          mesh.rotation.x += this.rotationSpeedX;
          mesh.rotation.y += this.rotationSpeedY;
        },
      },
      {
        geometry: new THREE.LatheBufferGeometry(points, 32),
        material: new THREE.MeshLambertMaterial({ map: this.loader.load(this.windowTexture) }),
        position: new Vector3(-5, 5, 0),
        animation: (mesh: THREE.Mesh) => {
          // mesh.rotation.x += 1.5 * this.rotationSpeedX;
          mesh.rotation.y += this.rotationSpeedY;
        },
      },
    ];
  }

}
