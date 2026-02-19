import { Part3D } from '../types';

export function hasValidChassis(placedParts: Part3D[]): boolean {
  return placedParts.some(part => part.type === 'chassis');
}

export function countWheels(placedParts: Part3D[]): number {
  return placedParts.filter(part => part.type === 'wheel').length;
}

export function getVehicleCenterOfMass(placedParts: Part3D[]): { x: number; y: number; z: number } {
  if (placedParts.length === 0) {
    return { x: 0, y: 0, z: 0 };
  }

  const sum = placedParts.reduce(
    (acc, part) => ({
      x: acc.x + part.position.x,
      y: acc.y + part.position.y,
      z: acc.z + part.position.z,
    }),
    { x: 0, y: 0, z: 0 }
  );

  return {
    x: sum.x / placedParts.length,
    y: sum.y / placedParts.length,
    z: sum.z / placedParts.length,
  };
}

export function getVehicleBoundingBox(placedParts: Part3D[]): {
  min: { x: number; y: number; z: number };
  max: { x: number; y: number; z: number };
} {
  if (placedParts.length === 0) {
    return {
      min: { x: -1, y: -1, z: -1 },
      max: { x: 1, y: 1, z: 1 },
    };
  }

  const min = { x: Infinity, y: Infinity, z: Infinity };
  const max = { x: -Infinity, y: -Infinity, z: -Infinity };

  placedParts.forEach(part => {
    const halfSize = {
      x: part.size.x / 2,
      y: part.size.y / 2,
      z: part.size.z / 2,
    };

    min.x = Math.min(min.x, part.position.x - halfSize.x);
    min.y = Math.min(min.y, part.position.y - halfSize.y);
    min.z = Math.min(min.z, part.position.z - halfSize.z);

    max.x = Math.max(max.x, part.position.x + halfSize.x);
    max.y = Math.max(max.y, part.position.y + halfSize.y);
    max.z = Math.max(max.z, part.position.z + halfSize.z);
  });

  return { min, max };
}
