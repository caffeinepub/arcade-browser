import { GameEngine } from '../types';

export class PongGame implements GameEngine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private paddleHeight = 100;
  private paddleWidth = 10;
  private ballSize = 10;
  private playerY = 250;
  private aiY = 250;
  private ballX = 400;
  private ballY = 300;
  private ballSpeedX = 5;
  private ballSpeedY = 3;
  private score = 0;
  private gameOver = false;
  private keys: { [key: string]: boolean } = {};

  constructor(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
    this.canvas = canvas;
    this.ctx = ctx;
    console.log('Pong game initialized');
    this.reset();
  }

  reset(): void {
    this.playerY = this.canvas.height / 2 - this.paddleHeight / 2;
    this.aiY = this.canvas.height / 2 - this.paddleHeight / 2;
    this.ballX = this.canvas.width / 2;
    this.ballY = this.canvas.height / 2;
    this.ballSpeedX = 5;
    this.ballSpeedY = 3;
    this.score = 0;
    this.gameOver = false;
    this.keys = {};
    console.log('Pong game reset');
  }

  handleKeyDown(key: string): void {
    this.keys[key] = true;
  }

  handleKeyUp(key: string): void {
    this.keys[key] = false;
  }

  update(_deltaTime: number): void {
    if (this.gameOver) return;

    if (this.keys['ArrowUp'] || this.keys['w'] || this.keys['W']) {
      this.playerY = Math.max(0, this.playerY - 6);
    }
    if (this.keys['ArrowDown'] || this.keys['s'] || this.keys['S']) {
      this.playerY = Math.min(this.canvas.height - this.paddleHeight, this.playerY + 6);
    }

    const aiCenter = this.aiY + this.paddleHeight / 2;
    if (aiCenter < this.ballY - 20) {
      this.aiY = Math.min(this.canvas.height - this.paddleHeight, this.aiY + 4);
    } else if (aiCenter > this.ballY + 20) {
      this.aiY = Math.max(0, this.aiY - 4);
    }

    this.ballX += this.ballSpeedX;
    this.ballY += this.ballSpeedY;

    if (this.ballY <= 0 || this.ballY >= this.canvas.height - this.ballSize) {
      this.ballSpeedY = -this.ballSpeedY;
    }

    if (
      this.ballX <= this.paddleWidth &&
      this.ballY >= this.playerY &&
      this.ballY <= this.playerY + this.paddleHeight
    ) {
      this.ballSpeedX = Math.abs(this.ballSpeedX);
      this.score += 10;
    }

    if (
      this.ballX >= this.canvas.width - this.paddleWidth - this.ballSize &&
      this.ballY >= this.aiY &&
      this.ballY <= this.aiY + this.paddleHeight
    ) {
      this.ballSpeedX = -Math.abs(this.ballSpeedX);
    }

    if (this.ballX < 0) {
      this.gameOver = true;
    }

    if (this.ballX > this.canvas.width) {
      this.ballX = this.canvas.width / 2;
      this.ballY = this.canvas.height / 2;
      this.ballSpeedX = -5;
      this.score += 50;
    }
  }

  render(): void {
    if (!this.ctx) {
      console.error('No canvas context available');
      return;
    }

    this.ctx.fillStyle = '#0a0a0a';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.strokeStyle = '#1a1a1a';
    this.ctx.lineWidth = 2;
    this.ctx.setLineDash([10, 10]);
    this.ctx.beginPath();
    this.ctx.moveTo(this.canvas.width / 2, 0);
    this.ctx.lineTo(this.canvas.width / 2, this.canvas.height);
    this.ctx.stroke();
    this.ctx.setLineDash([]);

    this.ctx.fillStyle = '#22c55e';
    this.ctx.fillRect(0, this.playerY, this.paddleWidth, this.paddleHeight);

    this.ctx.fillStyle = '#ef4444';
    this.ctx.fillRect(
      this.canvas.width - this.paddleWidth,
      this.aiY,
      this.paddleWidth,
      this.paddleHeight
    );

    this.ctx.fillStyle = '#ffffff';
    this.ctx.fillRect(this.ballX, this.ballY, this.ballSize, this.ballSize);
  }

  getScore(): number {
    return this.score;
  }

  isGameOver(): boolean {
    return this.gameOver;
  }
}
