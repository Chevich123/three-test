import * as THREE from 'three';

export interface IMesh {
  geometry: THREE.BufferGeometry,
  material: THREE.Material,
  position: THREE.Vector3,
  animation?: (mesh: THREE.Mesh) => void,
}
