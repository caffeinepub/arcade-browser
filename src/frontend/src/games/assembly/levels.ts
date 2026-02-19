import { AssemblyLevel, Part3D, Point3D } from './types';

function createPart(
  id: string,
  type: string,
  color: string,
  size: Point3D,
  connections: Array<{ position: Point3D; type: string }>
): Part3D {
  return {
    id,
    type,
    position: { x: 0, y: 0, z: 0 },
    rotation: { x: 0, y: 0, z: 0 },
    connections: connections.map((conn) => ({
      ...conn,
      occupied: false,
    })),
    color,
    size,
    placed: false,
  };
}

export const assemblyLevels: AssemblyLevel[] = [
  {
    id: 1,
    name: 'Simple Vehicle',
    targetObject: 'Basic Car',
    timeLimit: 120,
    difficulty: 'easy',
    description: 'Build a simple vehicle with chassis and wheels',
    requiredParts: [
      createPart('chassis-1', 'chassis', '#6b7280', { x: 3, y: 0.5, z: 1.5 }, [
        { position: { x: -1.2, y: -0.25, z: 0.6 }, type: 'wheel' },
        { position: { x: 1.2, y: -0.25, z: 0.6 }, type: 'wheel' },
        { position: { x: -1.2, y: -0.25, z: -0.6 }, type: 'wheel' },
        { position: { x: 1.2, y: -0.25, z: -0.6 }, type: 'wheel' },
        { position: { x: 0, y: 0.25, z: 0 }, type: 'cabin' },
      ]),
      createPart('wheel-1', 'wheel', '#1f2937', { x: 0.5, y: 0.5, z: 0.5 }, [
        { position: { x: 0, y: 0, z: 0 }, type: 'axle' },
      ]),
      createPart('wheel-2', 'wheel', '#1f2937', { x: 0.5, y: 0.5, z: 0.5 }, [
        { position: { x: 0, y: 0, z: 0 }, type: 'axle' },
      ]),
      createPart('wheel-3', 'wheel', '#1f2937', { x: 0.5, y: 0.5, z: 0.5 }, [
        { position: { x: 0, y: 0, z: 0 }, type: 'axle' },
      ]),
      createPart('wheel-4', 'wheel', '#1f2937', { x: 0.5, y: 0.5, z: 0.5 }, [
        { position: { x: 0, y: 0, z: 0 }, type: 'axle' },
      ]),
    ],
  },
  {
    id: 2,
    name: 'Complex Machine',
    targetObject: 'Industrial Robot Arm',
    timeLimit: 90,
    difficulty: 'medium',
    description: 'Assemble a robot arm with base, joints, and gripper',
    requiredParts: [
      createPart('base-1', 'base', '#4b5563', { x: 2, y: 0.5, z: 2 }, [
        { position: { x: 0, y: 0.25, z: 0 }, type: 'joint' },
      ]),
      createPart('arm-1', 'arm', '#f97316', { x: 0.4, y: 2, z: 0.4 }, [
        { position: { x: 0, y: -1, z: 0 }, type: 'joint' },
        { position: { x: 0, y: 1, z: 0 }, type: 'joint' },
      ]),
      createPart('arm-2', 'arm', '#f97316', { x: 0.4, y: 1.5, z: 0.4 }, [
        { position: { x: 0, y: -0.75, z: 0 }, type: 'joint' },
        { position: { x: 0, y: 0.75, z: 0 }, type: 'joint' },
      ]),
      createPart('joint-1', 'joint', '#94a3b8', { x: 0.6, y: 0.6, z: 0.6 }, [
        { position: { x: 0, y: 0.3, z: 0 }, type: 'connector' },
        { position: { x: 0, y: -0.3, z: 0 }, type: 'connector' },
      ]),
      createPart('joint-2', 'joint', '#94a3b8', { x: 0.6, y: 0.6, z: 0.6 }, [
        { position: { x: 0, y: 0.3, z: 0 }, type: 'connector' },
        { position: { x: 0, y: -0.3, z: 0 }, type: 'connector' },
      ]),
      createPart('gripper-1', 'gripper', '#eab308', { x: 0.8, y: 0.4, z: 0.3 }, [
        { position: { x: 0, y: 0.2, z: 0 }, type: 'joint' },
      ]),
      createPart('sensor-1', 'sensor', '#22c55e', { x: 0.3, y: 0.3, z: 0.3 }, [
        { position: { x: 0, y: 0, z: 0 }, type: 'mount' },
      ]),
      createPart('panel-1', 'panel', '#3b82f6', { x: 1, y: 0.8, z: 0.1 }, [
        { position: { x: 0, y: 0, z: 0 }, type: 'mount' },
      ]),
    ],
  },
  {
    id: 3,
    name: 'Advanced Assembly',
    targetObject: 'Mechanical Drone',
    timeLimit: 60,
    difficulty: 'hard',
    description: 'Build a complex drone with frame, motors, and propellers',
    requiredParts: [
      createPart('frame-1', 'frame', '#6b7280', { x: 2, y: 0.2, z: 2 }, [
        { position: { x: 0.8, y: 0, z: 0.8 }, type: 'motor' },
        { position: { x: -0.8, y: 0, z: 0.8 }, type: 'motor' },
        { position: { x: 0.8, y: 0, z: -0.8 }, type: 'motor' },
        { position: { x: -0.8, y: 0, z: -0.8 }, type: 'motor' },
        { position: { x: 0, y: 0.1, z: 0 }, type: 'controller' },
      ]),
      createPart('motor-1', 'motor', '#ef4444', { x: 0.3, y: 0.5, z: 0.3 }, [
        { position: { x: 0, y: -0.25, z: 0 }, type: 'mount' },
        { position: { x: 0, y: 0.25, z: 0 }, type: 'propeller' },
      ]),
      createPart('motor-2', 'motor', '#ef4444', { x: 0.3, y: 0.5, z: 0.3 }, [
        { position: { x: 0, y: -0.25, z: 0 }, type: 'mount' },
        { position: { x: 0, y: 0.25, z: 0 }, type: 'propeller' },
      ]),
      createPart('motor-3', 'motor', '#ef4444', { x: 0.3, y: 0.5, z: 0.3 }, [
        { position: { x: 0, y: -0.25, z: 0 }, type: 'mount' },
        { position: { x: 0, y: 0.25, z: 0 }, type: 'propeller' },
      ]),
      createPart('motor-4', 'motor', '#ef4444', { x: 0.3, y: 0.5, z: 0.3 }, [
        { position: { x: 0, y: -0.25, z: 0 }, type: 'mount' },
        { position: { x: 0, y: 0.25, z: 0 }, type: 'propeller' },
      ]),
      createPart('prop-1', 'propeller', '#22c55e', { x: 0.8, y: 0.05, z: 0.8 }, [
        { position: { x: 0, y: 0, z: 0 }, type: 'shaft' },
      ]),
      createPart('prop-2', 'propeller', '#22c55e', { x: 0.8, y: 0.05, z: 0.8 }, [
        { position: { x: 0, y: 0, z: 0 }, type: 'shaft' },
      ]),
      createPart('prop-3', 'propeller', '#22c55e', { x: 0.8, y: 0.05, z: 0.8 }, [
        { position: { x: 0, y: 0, z: 0 }, type: 'shaft' },
      ]),
      createPart('prop-4', 'propeller', '#22c55e', { x: 0.8, y: 0.05, z: 0.8 }, [
        { position: { x: 0, y: 0, z: 0 }, type: 'shaft' },
      ]),
      createPart('controller-1', 'controller', '#3b82f6', { x: 0.6, y: 0.2, z: 0.6 }, [
        { position: { x: 0, y: -0.1, z: 0 }, type: 'mount' },
      ]),
      createPart('battery-1', 'battery', '#eab308', { x: 0.8, y: 0.3, z: 0.4 }, [
        { position: { x: 0, y: 0, z: 0 }, type: 'mount' },
      ]),
      createPart('camera-1', 'camera', '#8b5cf6', { x: 0.3, y: 0.3, z: 0.4 }, [
        { position: { x: 0, y: 0, z: 0 }, type: 'mount' },
      ]),
    ],
  },
];
