import { useRef, useEffect } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ThirdPersonCameraProps {
  targetPosition: { x: number; y: number; z: number };
  targetRotation: number;
}

export default function ThirdPersonCamera({ targetPosition, targetRotation }: ThirdPersonCameraProps) {
  const { camera } = useThree();
  const cameraOffset = useRef(new THREE.Vector3(0, 5, -8));
  const lookAtOffset = useRef(new THREE.Vector3(0, 1, 0));

  useFrame(() => {
    // Calculate camera position behind and above the vehicle
    const offset = cameraOffset.current.clone();
    offset.applyAxisAngle(new THREE.Vector3(0, 1, 0), targetRotation);
    
    const desiredPosition = new THREE.Vector3(
      targetPosition.x + offset.x,
      targetPosition.y + offset.y,
      targetPosition.z + offset.z
    );

    // Smooth camera follow with lerp
    camera.position.lerp(desiredPosition, 0.1);

    // Look at point slightly ahead of the vehicle
    const lookAt = lookAtOffset.current.clone();
    lookAt.applyAxisAngle(new THREE.Vector3(0, 1, 0), targetRotation);
    
    const lookAtPosition = new THREE.Vector3(
      targetPosition.x + lookAt.x,
      targetPosition.y + lookAt.y,
      targetPosition.z + lookAt.z
    );

    camera.lookAt(lookAtPosition);
  });

  return null;
}
