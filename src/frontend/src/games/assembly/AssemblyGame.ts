import { GameEngine } from '../types';
import { AssemblyLevel, AssemblyState, Part3D, MultiplayerState, GameMode } from './types';
import { assemblyLevels } from './levels';
import { calculateScore, getPenaltyForMistake, getPointsForPlacement } from './scoring';
import { findNearestConnectionPoint, canConnect, snapToConnectionPoint } from './utils/collisionDetection';
import { saveLevelScore, unlockNextLevel } from '../../storage/assemblyProgressStorage';
import {
  createDefaultVehiclePhysics,
  applyAcceleration,
  applyBraking,
  applyTurning,
  updateVelocity,
  updatePosition,
  updateRotation,
  resetPhysics,
} from './utils/vehiclePhysics';
import { hasValidChassis, countWheels, getVehicleCenterOfMass } from './utils/vehicleValidation';

export class AssemblyGame implements GameEngine {
  private state: AssemblyState;
  private multiplayerState: MultiplayerState;
  private currentLevel: AssemblyLevel;
  private selectedPartId: string | null = null;
  private draggedPart: Part3D | null = null;
  private startTime: number = 0;
  private gameOver = false;
  private lastUpdateTime: number = 0;
  private vehicleRotation: number = 0;
  private vehiclePosition: { x: number; y: number; z: number } = { x: 0, y: 0, z: 0 };
  private keyState: { [key: string]: boolean } = {};

  constructor(levelId: number = 1, mode: 'single' | 'multiplayer' = 'single') {
    this.currentLevel = assemblyLevels.find((l) => l.id === levelId) || assemblyLevels[0];
    
    this.state = {
      availableParts: JSON.parse(JSON.stringify(this.currentLevel.requiredParts)),
      placedParts: [],
      currentLevel: levelId,
      score: 0,
      timeElapsed: 0,
      isComplete: false,
      mistakes: 0,
      gameMode: 'build',
      vehiclePhysics: createDefaultVehiclePhysics(0),
    };

    this.multiplayerState = {
      mode,
      currentPlayer: 1,
      player1Score: 0,
      player2Score: 0,
      player1Time: 0,
      player2Time: 0,
    };

    this.startTime = Date.now();
  }

  update(deltaTime: number): void {
    if (this.gameOver || this.state.isComplete) return;

    const dt = Math.min(deltaTime / 1000, 0.1); // Cap delta time

    if (this.state.gameMode === 'build') {
      this.state.timeElapsed = (Date.now() - this.startTime) / 1000;

      if (this.state.timeElapsed >= this.currentLevel.timeLimit) {
        this.endGame();
      }

      if (this.state.placedParts.length === this.currentLevel.requiredParts.length) {
        this.completeLevel();
      }
    } else if (this.state.gameMode === 'drive') {
      this.updateDriveMode(dt);
    }
  }

  private updateDriveMode(deltaTime: number): void {
    let forwardInput = 0;
    let turnInput = 0;

    // Process WASD input
    if (this.keyState['w'] || this.keyState['W']) forwardInput += 1;
    if (this.keyState['s'] || this.keyState['S']) forwardInput -= 1;
    if (this.keyState['a'] || this.keyState['A']) turnInput += 1;
    if (this.keyState['d'] || this.keyState['D']) turnInput -= 1;

    // Apply physics
    if (forwardInput !== 0) {
      this.state.vehiclePhysics = applyAcceleration(
        this.state.vehiclePhysics,
        forwardInput,
        deltaTime
      );
    } else {
      // Apply friction when no input
      this.state.vehiclePhysics.acceleration *= 0.9;
    }

    if (forwardInput < 0 && Math.abs(this.state.vehiclePhysics.acceleration) > 0.1) {
      // Braking
      this.state.vehiclePhysics = applyBraking(this.state.vehiclePhysics, deltaTime);
    }

    this.state.vehiclePhysics = applyTurning(
      this.state.vehiclePhysics,
      turnInput,
      deltaTime
    );

    this.state.vehiclePhysics = updateVelocity(
      this.state.vehiclePhysics,
      this.vehicleRotation,
      deltaTime
    );

    this.vehiclePosition = updatePosition(
      this.vehiclePosition,
      this.state.vehiclePhysics.velocity,
      deltaTime
    );

    this.vehicleRotation = updateRotation(
      this.vehicleRotation,
      this.state.vehiclePhysics.angularVelocity,
      deltaTime
    );

    // Update all placed parts to follow vehicle
    const centerOfMass = getVehicleCenterOfMass(this.state.placedParts);
    this.state.placedParts.forEach(part => {
      const relativeX = part.position.x - centerOfMass.x;
      const relativeZ = part.position.z - centerOfMass.z;
      
      const rotatedX = relativeX * Math.cos(this.vehicleRotation) - relativeZ * Math.sin(this.vehicleRotation);
      const rotatedZ = relativeX * Math.sin(this.vehicleRotation) + relativeZ * Math.cos(this.vehicleRotation);
      
      part.position.x = this.vehiclePosition.x + rotatedX;
      part.position.z = this.vehiclePosition.z + rotatedZ;
      part.rotation.y = this.vehicleRotation;
    });
  }

  render(): void {
    // Rendering is handled by React Three Fiber in AssemblyGameCanvas
  }

  reset(): void {
    this.state = {
      availableParts: JSON.parse(JSON.stringify(this.currentLevel.requiredParts)),
      placedParts: [],
      currentLevel: this.state.currentLevel,
      score: 0,
      timeElapsed: 0,
      isComplete: false,
      mistakes: 0,
      gameMode: 'build',
      vehiclePhysics: createDefaultVehiclePhysics(0),
    };

    this.selectedPartId = null;
    this.draggedPart = null;
    this.startTime = Date.now();
    this.gameOver = false;
    this.vehicleRotation = 0;
    this.vehiclePosition = { x: 0, y: 0, z: 0 };
    this.keyState = {};
  }

  getScore(): number {
    return this.state.score;
  }

  isGameOver(): boolean {
    return this.gameOver || this.state.isComplete;
  }

  handleKeyDown(key: string): void {
    this.keyState[key] = true;

    if (this.state.gameMode === 'build' && this.draggedPart) {
      switch (key) {
        case 'r':
        case 'R':
          this.draggedPart.rotation.y += Math.PI / 4;
          break;
        case 'e':
        case 'E':
          this.draggedPart.rotation.y -= Math.PI / 4;
          break;
      }
    }
  }

  handleKeyUp(key: string): void {
    this.keyState[key] = false;
  }

  selectPart(partId: string): void {
    if (this.state.gameMode !== 'build') return;
    
    const part = this.state.availableParts.find((p) => p.id === partId);
    if (part) {
      this.selectedPartId = partId;
      this.draggedPart = part;
    }
  }

  updateDragPosition(x: number, y: number, z: number): void {
    if (this.draggedPart && this.state.gameMode === 'build') {
      this.draggedPart.position = { x, y, z };
    }
  }

  tryPlacePart(): boolean {
    if (!this.draggedPart || this.state.gameMode !== 'build') return false;

    // Special case: If this is the first part being placed, allow it without connection validation
    if (this.state.placedParts.length === 0) {
      this.draggedPart.placed = true;
      this.state.placedParts.push(this.draggedPart);
      this.state.availableParts = this.state.availableParts.filter(
        (p) => p.id !== this.draggedPart!.id
      );

      this.state.score += getPointsForPlacement(true);

      if (this.multiplayerState.mode === 'multiplayer') {
        if (this.multiplayerState.currentPlayer === 1) {
          this.multiplayerState.player1Score += getPointsForPlacement(true);
        } else {
          this.multiplayerState.player2Score += getPointsForPlacement(true);
        }
        this.switchPlayer();
      }

      this.draggedPart = null;
      this.selectedPartId = null;

      return true;
    }

    // For subsequent parts, require connection to existing parts
    const snapTarget = findNearestConnectionPoint(
      this.draggedPart,
      this.state.placedParts,
      0.8
    );

    if (snapTarget && canConnect(this.draggedPart.type, snapTarget.connectionPoint.type)) {
      const snappedPosition = snapToConnectionPoint(
        this.draggedPart,
        snapTarget.targetPart,
        snapTarget.connectionPoint
      );

      this.draggedPart.position = snappedPosition;
      this.draggedPart.placed = true;

      snapTarget.connectionPoint.occupied = true;
      snapTarget.connectionPoint.partId = this.draggedPart.id;

      this.state.placedParts.push(this.draggedPart);
      this.state.availableParts = this.state.availableParts.filter(
        (p) => p.id !== this.draggedPart!.id
      );

      this.state.score += getPointsForPlacement(true);

      if (this.multiplayerState.mode === 'multiplayer') {
        if (this.multiplayerState.currentPlayer === 1) {
          this.multiplayerState.player1Score += getPointsForPlacement(true);
        } else {
          this.multiplayerState.player2Score += getPointsForPlacement(true);
        }
        this.switchPlayer();
      }

      this.draggedPart = null;
      this.selectedPartId = null;

      return true;
    } else {
      // Only count as a mistake if there are already placed parts
      this.state.mistakes++;
      this.state.score = Math.max(0, this.state.score - getPenaltyForMistake());
      return false;
    }
  }

  cancelDrag(): void {
    this.draggedPart = null;
    this.selectedPartId = null;
  }

  toggleGameMode(): boolean {
    if (this.state.gameMode === 'build') {
      if (this.canEnterDriveMode()) {
        this.state.gameMode = 'drive';
        const wheelCount = countWheels(this.state.placedParts);
        this.state.vehiclePhysics = createDefaultVehiclePhysics(wheelCount);
        
        // Initialize vehicle position at center of mass
        const centerOfMass = getVehicleCenterOfMass(this.state.placedParts);
        this.vehiclePosition = { ...centerOfMass };
        this.vehicleRotation = 0;
        
        return true;
      }
      return false;
    } else {
      this.state.gameMode = 'build';
      this.state.vehiclePhysics = resetPhysics(this.state.vehiclePhysics);
      this.keyState = {};
      return true;
    }
  }

  canEnterDriveMode(): boolean {
    return hasValidChassis(this.state.placedParts);
  }

  getGameMode(): GameMode {
    return this.state.gameMode;
  }

  getVehiclePosition(): { x: number; y: number; z: number } {
    return this.vehiclePosition;
  }

  getVehicleRotation(): number {
    return this.vehicleRotation;
  }

  private completeLevel(): void {
    this.state.isComplete = true;
    this.gameOver = true;

    const scoreCalc = calculateScore(
      this.state.placedParts.length,
      this.state.timeElapsed,
      this.currentLevel.timeLimit,
      this.state.mistakes,
      this.currentLevel.requiredParts.length
    );

    this.state.score = scoreCalc.finalScore;

    saveLevelScore(this.currentLevel.id, this.state.score);
    unlockNextLevel(this.currentLevel.id);
  }

  private endGame(): void {
    this.gameOver = true;
  }

  private switchPlayer(): void {
    this.multiplayerState.currentPlayer = this.multiplayerState.currentPlayer === 1 ? 2 : 1;
  }

  getState(): AssemblyState {
    return this.state;
  }

  getMultiplayerState(): MultiplayerState {
    return this.multiplayerState;
  }

  getCurrentLevel(): AssemblyLevel {
    return this.currentLevel;
  }

  getDraggedPart(): Part3D | null {
    return this.draggedPart;
  }

  changeLevel(levelId: number): void {
    this.currentLevel = assemblyLevels.find((l) => l.id === levelId) || assemblyLevels[0];
    this.reset();
  }
}
