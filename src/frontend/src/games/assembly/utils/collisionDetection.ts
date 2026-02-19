import { Part3D, Point3D, ConnectionPoint } from '../types';

export function distance3D(p1: Point3D, p2: Point3D): number {
  return Math.sqrt(
    Math.pow(p2.x - p1.x, 2) +
    Math.pow(p2.y - p1.y, 2) +
    Math.pow(p2.z - p1.z, 2)
  );
}

export function findNearestConnectionPoint(
  part: Part3D,
  placedParts: Part3D[],
  snapDistance: number = 0.5
): { targetPart: Part3D; connectionPoint: ConnectionPoint; distance: number } | null {
  let nearest: { targetPart: Part3D; connectionPoint: ConnectionPoint; distance: number } | null = null;
  let minDistance = snapDistance;

  for (const placedPart of placedParts) {
    for (const conn of placedPart.connections) {
      if (conn.occupied) continue;

      const worldPos = {
        x: placedPart.position.x + conn.position.x,
        y: placedPart.position.y + conn.position.y,
        z: placedPart.position.z + conn.position.z,
      };

      const dist = distance3D(part.position, worldPos);

      if (dist < minDistance) {
        minDistance = dist;
        nearest = {
          targetPart: placedPart,
          connectionPoint: conn,
          distance: dist,
        };
      }
    }
  }

  return nearest;
}

export function canConnect(partType: string, connectionType: string): boolean {
  const compatibilityMap: Record<string, string[]> = {
    wheel: ['axle', 'mount', 'wheel'],
    chassis: ['wheel', 'cabin'],
    arm: ['joint', 'connector'],
    joint: ['connector', 'arm', 'gripper'],
    gripper: ['joint'],
    motor: ['mount', 'propeller', 'motor'],
    propeller: ['shaft', 'propeller'],
    controller: ['mount', 'controller'],
    battery: ['mount'],
    camera: ['mount'],
    sensor: ['mount'],
    panel: ['mount'],
    base: ['joint'],
    frame: ['motor', 'controller'],
    cabin: ['chassis'],
  };

  return compatibilityMap[partType]?.includes(connectionType) ?? false;
}

export function snapToConnectionPoint(
  part: Part3D,
  targetPart: Part3D,
  connectionPoint: ConnectionPoint
): Point3D {
  return {
    x: targetPart.position.x + connectionPoint.position.x,
    y: targetPart.position.y + connectionPoint.position.y,
    z: targetPart.position.z + connectionPoint.position.z,
  };
}
