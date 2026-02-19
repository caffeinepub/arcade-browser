import { GameEngine } from '../types';

interface Brick {
  x: number;
  y: number;
  width: number;
  height: number;
  visible: boolean;
}

export class BreakoutGame implements GameEngine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private paddleWidth = 100;
  private paddleHeight = 10;
  private paddleX = 350;
  private ballX = 400;
  private ballY = 300;
  private ballRadius = 8;
  private ballSpeedX = 4;
  private ballSpeedY = -4;
  private score = 0;
  private gameOver = false;
  private gameWon = false;
  private bricks: Brick[] = [];
  private brickRows = 5;
  private brickCols = 10;
  private brickWidth = 70;
  private brickHeight = 20;
  private brickPadding = 10;
  private brickOffsetTop = 50;
  private brickOffsetLeft = 35;
  private keys: { [key: string]: boolean } = {};
  private ballLaunched = false;

  constructor(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
    this.canvas = canvas;
    this.ctx = ctx;
    console.log('Breakout game initialized');
    this.reset();
  }

  reset(): void {
    this.paddleX = this.canvas.width / 2 - this.paddleWidth / 2;
    this.ballX = this.canvas.width / 2;
    this.ballY = this.canvas.height - 100;
    this.ballSpeedX = 4;
    this.ballSpeedY = -4;
    this.score = 0;
    this.gameOver = false;
    this.gameWon = false;
    this.keys = {};
    this.ballLaunched = false;
    this.initBricks();
    console.log('Breakout game reset');
  }

  private initBricks(): void {
    this.bricks = [];
    for (let row = 0; row < this.brickRows; row++) {
      for (let col = 0; col < this.brickCols; col++) {
        this.bricks.push({
          x: col * (this.brickWidth + this.brickPadding) + this.brickOffsetLeft,
          y: row * (this.brickHeight + this.brickPadding) + this.brickOffsetTop,
          width: this.brickWidth,
          height: this.brickHeight,
          visible: true,
        });
      }
    }
  }

  handleKeyDown(key: string): void {
    this.keys[key] = true;
    
    if (key === ' ' && !this.ballLaunched && !this.gameOver) {
      this.ballLaunched = true;
    }
  }

  handleKeyUp(key: string): void {
    this.keys[key] = false;
  }

  update(_deltaTime: number): void {
    if (this.gameOver || this.gameWon) return;

    if (this.keys['ArrowLeft'] || this.keys['a'] || this.keys['A']) {
      this.paddleX = Math.max(0, this.paddleX - 8);
    }
    if (this.keys['ArrowRight'] || this.keys['d'] || this.keys['D']) {
      this.paddleX = Math.min(this.canvas.width - this.paddleWidth, this.paddleX + 8);
    }

    if (!this.ballLaunched) {
      this.ballX = this.paddleX + this.paddleWidth / 2;
      return;
    }

    this.ballX += this.ballSpeedX;
    this.ballY += this.ballSpeedY;

    if (this.ballX - this.ballRadius <= 0 || this.ballX + this.ballRadius >= this.canvas.width) {
      this.ballSpeedX = -this.ballSpeedX;
    }

    if (this.ballY - this.ballRadius <= 0) {
      this.ballSpeedY = -this.ballSpeedY;
    }

    if (
      this.ballY + this.ballRadius >= this.canvas.height - this.paddleHeight &&
      this.ballX >= this.paddleX &&
      this.ballX <= this.paddleX + this.paddleWidth
    ) {
      this.ballSpeedY = -Math.abs(this.ballSpeedY);
      
      const hitPos = (this.ballX - this.paddleX) / this.paddleWidth;
      this.ballSpeedX = (hitPos - 0.5) * 8;
    }

    if (this.ballY > this.canvas.height) {
      this.gameOver = true;
    }

    for (const brick of this.bricks) {
      if (!brick.visible) continue;

      if (
        this.ballX + this.ballRadius >= brick.x &&
        this.ballX - this.ballRadius <= brick.x + brick.width &&
        this.ballY + this.ballRadius >= brick.y &&
        this.ballY - this.ballRadius <= brick.y + brick.height
      ) {
        this.ballSpeedY = -this.ballSpeedY;
        brick.visible = false;
        this.score += 10;
      }
    }

    if (this.bricks.every((brick) => !brick.visible)) {
      this.gameWon = true;
      this.gameOver = true;
    }
  }

  render(): void {
    if (!this.ctx) {
      console.error('No canvas context available');
      return;
    }

    this.ctx.fillStyle = '#0a0a0a';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.fillStyle = '#22c55e';
    this.ctx.fillRect(this.paddleX, this.canvas.height - this.paddleHeight, this.paddleWidth, this.paddleHeight);

    this.ctx.fillStyle = '#ffffff';
    this.ctx.beginPath();
    this.ctx.arc(this.ballX, this.ballY, this.ballRadius, 0, Math.PI * 2);
    this.ctx.fill();

    const colors = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6'];
    for (const brick of this.bricks) {
      if (!brick.visible) continue;

      const row = Math.floor((brick.y - this.brickOffsetTop) / (this.brickHeight + this.brickPadding));
      this.ctx.fillStyle = colors[row % colors.length];
      this.ctx.fillRect(brick.x, brick.y, brick.width, brick.height);
      
      this.ctx.strokeStyle = '#000000';
      this.ctx.lineWidth = 2;
      this.ctx.strokeRect(brick.x, brick.y, brick.width, brick.height);
    }

    if (!this.ballLaunched) {
      this.ctx.fillStyle = '#ffffff';
      this.ctx.font = '16px Arial';
      this.ctx.textAlign = 'center';
      this.ctx.fillText('Press SPACE to launch', this.canvas.width / 2, this.canvas.height / 2);
    }
  }

  getScore(): number {
    return this.score;
  }

  isGameOver(): boolean {
    return this.gameOver;
  }
}
