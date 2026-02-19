import { Point3D, VehiclePhysics } from '../types';

export function createDefaultVehiclePhysics(wheelCount: number): VehiclePhysics {
  // Adjust physics based on wheel count
  const tractionMultiplier = Math.min(wheelCount / 4, 1.5);
  const stabilityMultiplier = Math.min(wheelCount / 4, 1.2);

  return {
    velocity: { x: 0, y: 0, z: 0 },
    acceleration: 0,
    angularVelocity: 0,
    friction: 0.95 * stabilityMultiplier,
    turnRate: 2.0 / stabilityMultiplier,
    maxSpeed: 15 * tractionMultiplier,
    mass: 1.0,
  };
}

export function applyAcceleration(
  physics: VehiclePhysics,
  input: number,
  deltaTime: number
): VehiclePhysics {
  const accelerationRate = 8.0;
  const targetAcceleration = input * accelerationRate;
  
  // Smooth acceleration with momentum
  physics.acceleration += (targetAcceleration - physics.acceleration) * 0.1;
  
  return physics;
}

export function applyBraking(
  physics: VehiclePhysics,
  deltaTime: number
): VehiclePhysics {
  const brakeForce = 0.85;
  physics.acceleration *= brakeForce;
  
  return physics;
}

export function applyTurning(
  physics: VehiclePhysics,
  input: number,
  deltaTime: number
): VehiclePhysics {
  // Turning is more effective at higher speeds
  const speed = Math.sqrt(
    physics.velocity.x ** 2 + physics.velocity.z ** 2
  );
  const speedFactor = Math.min(speed / 5, 1.0);
  
  const targetAngularVelocity = input * physics.turnRate * speedFactor;
  
  // Smooth turning with momentum
  physics.angularVelocity += (targetAngularVelocity - physics.angularVelocity) * 0.15;
  
  return physics;
}

export function updateVelocity(
  physics: VehiclePhysics,
  rotation: number,
  deltaTime: number
): VehiclePhysics {
  // Apply acceleration in the direction the vehicle is facing
  const forwardX = Math.sin(rotation);
  const forwardZ = Math.cos(rotation);
  
  physics.velocity.x += forwardX * physics.acceleration * deltaTime;
  physics.velocity.z += forwardZ * physics.acceleration * deltaTime;
  
  // Apply friction
  physics.velocity.x *= physics.friction;
  physics.velocity.z *= physics.friction;
  
  // Clamp to max speed
  const speed = Math.sqrt(physics.velocity.x ** 2 + physics.velocity.z ** 2);
  if (speed > physics.maxSpeed) {
    const scale = physics.maxSpeed / speed;
    physics.velocity.x *= scale;
    physics.velocity.z *= scale;
  }
  
  // Apply lateral friction (drift reduction)
  const lateralFriction = 0.92;
  const rightX = Math.cos(rotation);
  const rightZ = -Math.sin(rotation);
  const lateralSpeed = physics.velocity.x * rightX + physics.velocity.z * rightZ;
  physics.velocity.x -= rightX * lateralSpeed * (1 - lateralFriction);
  physics.velocity.z -= rightZ * lateralSpeed * (1 - lateralFriction);
  
  return physics;
}

export function updatePosition(
  position: Point3D,
  velocity: Point3D,
  deltaTime: number
): Point3D {
  return {
    x: position.x + velocity.x * deltaTime,
    y: position.y,
    z: position.z + velocity.z * deltaTime,
  };
}

export function updateRotation(
  rotation: number,
  angularVelocity: number,
  deltaTime: number
): number {
  return rotation + angularVelocity * deltaTime;
}

export function resetPhysics(physics: VehiclePhysics): VehiclePhysics {
  return {
    ...physics,
    velocity: { x: 0, y: 0, z: 0 },
    acceleration: 0,
    angularVelocity: 0,
  };
}
