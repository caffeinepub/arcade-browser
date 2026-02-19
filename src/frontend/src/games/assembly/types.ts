export interface Point3D {
  x: number;
  y: number;
  z: number;
}

export interface ConnectionPoint {
  position: Point3D;
  type: string;
  occupied: boolean;
  partId?: string;
}

export interface Part3D {
  id: string;
  type: string;
  position: Point3D;
  rotation: Point3D;
  connections: ConnectionPoint[];
  color: string;
  size: Point3D;
  placed: boolean;
}

export interface AssemblyLevel {
  id: number;
  name: string;
  targetObject: string;
  requiredParts: Part3D[];
  timeLimit: number;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export type GameMode = 'build' | 'drive';

export interface VehiclePhysics {
  velocity: Point3D;
  acceleration: number;
  angularVelocity: number;
  friction: number;
  turnRate: number;
  maxSpeed: number;
  mass: number;
}

export interface AssemblyState {
  availableParts: Part3D[];
  placedParts: Part3D[];
  currentLevel: number;
  score: number;
  timeElapsed: number;
  isComplete: boolean;
  mistakes: number;
  gameMode: GameMode;
  vehiclePhysics: VehiclePhysics;
}

export interface MultiplayerState {
  mode: 'single' | 'multiplayer';
  currentPlayer: 1 | 2;
  player1Score: number;
  player2Score: number;
  player1Time: number;
  player2Time: number;
}
