import { Injectable } from '@angular/core';
import * as THREE from 'three';

@Injectable({
  providedIn: 'root',
})
export class CameraService {
  saveCameraPosition(vector: THREE.Vector3) {
    console.log('saveCameraPosition >>', vector);
  }

  readCameraPosition(): THREE.Vector3 {
    return new THREE.Vector3(0, 0, 250);
  }
}
