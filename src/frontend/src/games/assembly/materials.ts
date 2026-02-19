import * as THREE from 'three';

export const materials = {
  metallic: new THREE.MeshStandardMaterial({
    color: 0x6b7280,
    metalness: 0.8,
    roughness: 0.3,
  }),
  
  plastic: new THREE.MeshStandardMaterial({
    color: 0xf97316,
    metalness: 0.1,
    roughness: 0.6,
  }),
  
  rubber: new THREE.MeshStandardMaterial({
    color: 0x1f2937,
    metalness: 0.0,
    roughness: 0.9,
  }),
  
  highlight: new THREE.MeshStandardMaterial({
    color: 0x22c55e,
    metalness: 0.5,
    roughness: 0.4,
    emissive: 0x22c55e,
    emissiveIntensity: 0.3,
  }),
  
  error: new THREE.MeshStandardMaterial({
    color: 0xef4444,
    metalness: 0.5,
    roughness: 0.4,
    emissive: 0xef4444,
    emissiveIntensity: 0.3,
  }),
  
  transparent: new THREE.MeshStandardMaterial({
    color: 0x22c55e,
    metalness: 0.3,
    roughness: 0.5,
    transparent: true,
    opacity: 0.3,
  }),
};

export function getMaterialForPartType(type: string): THREE.MeshStandardMaterial {
  switch (type) {
    case 'chassis':
    case 'frame':
    case 'base':
      return materials.metallic.clone();
    case 'wheel':
    case 'propeller':
      return materials.rubber.clone();
    case 'arm':
    case 'motor':
    case 'gripper':
      return materials.plastic.clone();
    default:
      return materials.plastic.clone();
  }
}

export function getColoredMaterial(color: string, type: string): THREE.MeshStandardMaterial {
  const baseMaterial = getMaterialForPartType(type);
  baseMaterial.color.set(color);
  return baseMaterial;
}
