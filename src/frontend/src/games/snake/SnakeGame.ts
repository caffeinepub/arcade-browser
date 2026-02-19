import { GameEngine } from '../types';

interface Point {
  x: number;
  y: number;
}

export class SnakeGame implements GameEngine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private snake: Point[] = [];
  private food: Point = { x: 0, y: 0 };
  private direction: Point = { x: 1, y: 0 };
  private nextDirection: Point = { x: 1, y: 0 };
  private score = 0;
  private gameOver = false;
  private gridSize = 20;
  private tileCountX = 40;
  private tileCountY = 30;
  private moveCounter = 0;
  private moveInterval = 8;

  constructor(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
    this.canvas = canvas;
    this.ctx = ctx;
    
    this.tileCountX = Math.floor(this.canvas.width / this.gridSize);
    this.tileCountY = Math.floor(this.canvas.height / this.gridSize);
    
    console.log('Snake game initialized:', { tileCountX: this.tileCountX, tileCountY: this.tileCountY });
    this.reset();
  }

  reset(): void {
    const centerX = Math.floor(this.tileCountX / 2);
    const centerY = Math.floor(this.tileCountY / 2);
    
    this.snake = [{ x: centerX, y: centerY }];
    this.direction = { x: 1, y: 0 };
    this.nextDirection = { x: 1, y: 0 };
    this.score = 0;
    this.gameOver = false;
    this.moveCounter = 0;
    this.placeFood();
    
    console.log('Snake game reset');
  }

  private placeFood(): void {
    let newFood: Point;
    let attempts = 0;
    const maxAttempts = 100;
    
    do {
      newFood = {
        x: Math.floor(Math.random() * this.tileCountX),
        y: Math.floor(Math.random() * this.tileCountY),
      };
      attempts++;
    } while (
      attempts < maxAttempts &&
      this.snake.some((segment) => segment.x === newFood.x && segment.y === newFood.y)
    );
    
    this.food = newFood;
  }

  handleKeyDown(key: string): void {
    switch (key) {
      case 'ArrowUp':
      case 'w':
      case 'W':
        if (this.direction.y === 0) this.nextDirection = { x: 0, y: -1 };
        break;
      case 'ArrowDown':
      case 's':
      case 'S':
        if (this.direction.y === 0) this.nextDirection = { x: 0, y: 1 };
        break;
      case 'ArrowLeft':
      case 'a':
      case 'A':
        if (this.direction.x === 0) this.nextDirection = { x: -1, y: 0 };
        break;
      case 'ArrowRight':
      case 'd':
      case 'D':
        if (this.direction.x === 0) this.nextDirection = { x: 1, y: 0 };
        break;
    }
  }

  handleKeyUp(_key: string): void {
    // Not used in snake
  }

  update(_deltaTime: number): void {
    if (this.gameOver) return;

    this.moveCounter++;
    if (this.moveCounter < this.moveInterval) return;
    this.moveCounter = 0;

    this.direction = this.nextDirection;

    const head = { ...this.snake[0] };
    head.x += this.direction.x;
    head.y += this.direction.y;

    if (head.x < 0 || head.x >= this.tileCountX || head.y < 0 || head.y >= this.tileCountY) {
      this.gameOver = true;
      return;
    }

    if (this.snake.some((segment) => segment.x === head.x && segment.y === head.y)) {
      this.gameOver = true;
      return;
    }

    this.snake.unshift(head);

    if (head.x === this.food.x && head.y === this.food.y) {
      this.score += 10;
      this.placeFood();
    } else {
      this.snake.pop();
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
    this.ctx.lineWidth = 1;
    
    for (let i = 0; i <= this.tileCountX; i++) {
      this.ctx.beginPath();
      this.ctx.moveTo(i * this.gridSize, 0);
      this.ctx.lineTo(i * this.gridSize, this.canvas.height);
      this.ctx.stroke();
    }
    
    for (let i = 0; i <= this.tileCountY; i++) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, i * this.gridSize);
      this.ctx.lineTo(this.canvas.width, i * this.gridSize);
      this.ctx.stroke();
    }

    this.snake.forEach((segment, index) => {
      if (index === 0) {
        this.ctx.fillStyle = '#22c55e';
      } else {
        this.ctx.fillStyle = '#16a34a';
      }
      
      this.ctx.fillRect(
        segment.x * this.gridSize + 1,
        segment.y * this.gridSize + 1,
        this.gridSize - 2,
        this.gridSize - 2
      );
    });

    this.ctx.fillStyle = '#ef4444';
    this.ctx.beginPath();
    this.ctx.arc(
      this.food.x * this.gridSize + this.gridSize / 2,
      this.food.y * this.gridSize + this.gridSize / 2,
      this.gridSize / 2 - 2,
      0,
      Math.PI * 2
    );
    this.ctx.fill();
  }

  getScore(): number {
    return this.score;
  }

  isGameOver(): boolean {
    return this.gameOver;
  }
}
