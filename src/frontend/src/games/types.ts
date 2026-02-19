export interface GameState {
  score: number;
  isGameOver: boolean;
  isPaused: boolean;
}

export interface GameEngine {
  update(deltaTime: number): void;
  render(): void;
  reset(): void;
  getScore(): number;
  isGameOver(): boolean;
  handleKeyDown(key: string): void;
  handleKeyUp(key: string): void;
}
