import { useRef } from 'react';
import { Mesh } from 'three';
import { Part3D } from '../types';
import { getColoredMaterial } from '../materials';

interface Part3DComponentProps {
  part: Part3D;
  onClick?: () => void;
  isSelected?: boolean;
  isDragging?: boolean;
}

export default function Part3DComponent({ part, onClick, isSelected, isDragging }: Part3DComponentProps) {
  const meshRef = useRef<Mesh>(null);
  const material = getColoredMaterial(part.color, part.type);

  if (isSelected) {
    material.emissive.set(0x22c55e);
    material.emissiveIntensity = 0.4;
  }

  if (isDragging) {
    material.opacity = 0.7;
    material.transparent = true;
  }

  return (
    <mesh
      ref={meshRef}
      position={[part.position.x, part.position.y, part.position.z]}
      rotation={[part.rotation.x, part.rotation.y, part.rotation.z]}
      onClick={onClick}
      material={material}
    >
      <boxGeometry args={[part.size.x, part.size.y, part.size.z]} />
    </mesh>
  );
}
