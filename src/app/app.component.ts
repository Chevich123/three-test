import { Component } from '@angular/core';
import { IMesh } from './mesh.interface';
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
  pokeBallTexture: string = '/assets/45634.png';
  windowTexture: string = '/assets/texture.jpg';
  rotationSpeedX: number = 0.1;
  rotationSpeedY: number = 0.01;

  meshes: IMesh[] = [
    {
      geometry: new THREE.SphereGeometry(),
      material: new THREE.MeshLambertMaterial({ map: this.loader.load(this.pokeBallTexture) }),
      position: new Vector3(0, 0, 0),
      animation: (mesh: THREE.Mesh) => {
        mesh.rotation.x += this.rotationSpeedX;
        mesh.rotation.y += this.rotationSpeedY;
      },
    },
    {
      geometry: new THREE.BoxGeometry(2, 2, 2),
      material: new THREE.MeshLambertMaterial({ map: this.loader.load(this.windowTexture) }),
      position: new Vector3(-5, 5, 0),
      animation: (mesh: THREE.Mesh) => {
        mesh.rotation.x += 1.5 * this.rotationSpeedX;
        mesh.rotation.y += this.rotationSpeedY;
      },
    },
    {
      geometry: new THREE.BoxGeometry(2, 2, 2),
      material: new THREE.MeshLambertMaterial({ map: this.loader.load(this.windowTexture) }),
      position: new Vector3(5, -5, 0),
      animation: (mesh: THREE.Mesh) => {
        mesh.rotation.x += 1.5 * this.rotationSpeedX;
        mesh.rotation.y += this.rotationSpeedY;
      },
    },
  ];
}
