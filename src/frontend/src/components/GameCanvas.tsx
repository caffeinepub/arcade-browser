import { useEffect, useRef, useState } from 'react';
import { GameMetadata } from '../data/gamesCatalog';
import { SnakeGame } from '../games/snake/SnakeGame';
import { PongGame } from '../games/pong/PongGame';
import { BreakoutGame } from '../games/breakout/BreakoutGame';
import { useGameLoop } from '../games/engine/useGameLoop';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import GameControlsOverlay from './GameControlsOverlay';
import ScoreSummary from './ScoreSummary';
import LeaderboardPanel from './LeaderboardPanel';
import { Play, RotateCcw, MousePointerClick } from 'lucide-react';

interface GameCanvasProps {
  game: GameMetadata;
}

export default function GameCanvas({ game }: GameCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameContainerRef = useRef<HTMLDivElement>(null);
  const gameInstanceRef = useRef<SnakeGame | PongGame | BreakoutGame | null>(null);
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'paused' | 'gameOver'>('idle');
  const [score, setScore] = useState(0);
  const [showControls, setShowControls] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [canvasError, setCanvasError] = useState<string | null>(null);

  const createGameInstance = () => {
    const canvas = canvasRef.current;
    if (!canvas) {
      console.error('Canvas element not found');
      return null;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      setCanvasError('Canvas 2D context is not available. Please try refreshing the page or use a different browser.');
      console.error('Failed to get 2D context');
      return null;
    }

    console.log('Creating game instance for:', game.id);
    let instance: SnakeGame | PongGame | BreakoutGame | null = null;

    switch (game.id) {
      case 'snake':
        instance = new SnakeGame(canvas, ctx);
        break;
      case 'pong':
        instance = new PongGame(canvas, ctx);
        break;
      case 'breakout':
        instance = new BreakoutGame(canvas, ctx);
        break;
      default:
        console.error('Unknown game id:', game.id);
        return null;
    }

    console.log('Game instance created successfully');
    return instance;
  };

  const gameLoop = useGameLoop((deltaTime: number) => {
    const gameInstance = gameInstanceRef.current;
    if (!gameInstance || gameState !== 'playing') return;

    try {
      gameInstance.update(deltaTime);
      gameInstance.render();

      const newScore = gameInstance.getScore();
      setScore(newScore);

      if (gameInstance.isGameOver()) {
        setGameState('gameOver');
      }
    } catch (error) {
      console.error('Error in game loop:', error);
      setGameState('gameOver');
    }
  });

  const startGame = () => {
    console.log('Starting game...');
    
    if (!gameInstanceRef.current) {
      gameInstanceRef.current = createGameInstance();
      if (!gameInstanceRef.current) {
        console.error('Failed to create game instance');
        return;
      }
    }
    
    gameInstanceRef.current.reset();
    setScore(0);
    setGameState('playing');
    gameLoop.start();
    
    // Auto-focus the game container when starting
    setTimeout(() => {
      gameContainerRef.current?.focus();
    }, 100);
    
    console.log('Game started');
  };

  const restartGame = () => {
    console.log('Restarting game...');
    gameLoop.stop();
    setTimeout(() => {
      startGame();
    }, 100);
  };

  // Centralized keyboard input handling
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const gameInstance = gameInstanceRef.current;
      if (!gameInstance || gameState !== 'playing' || !isFocused) return;
      
      // Prevent default for game control keys
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' ', 'w', 'W', 's', 'S'].includes(e.key)) {
        e.preventDefault();
      }
      
      gameInstance.handleKeyDown(e.key);
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const gameInstance = gameInstanceRef.current;
      if (!gameInstance || gameState !== 'playing' || !isFocused) return;
      
      gameInstance.handleKeyUp(e.key);
    };

    const container = gameContainerRef.current;
    if (container) {
      container.addEventListener('keydown', handleKeyDown);
      container.addEventListener('keyup', handleKeyUp);
    }

    return () => {
      if (container) {
        container.removeEventListener('keydown', handleKeyDown);
        container.removeEventListener('keyup', handleKeyUp);
      }
    };
  }, [gameState, isFocused]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      console.log('Cleaning up game...');
      gameLoop.stop();
      gameInstanceRef.current = null;
    };
  }, []);

  // Show canvas error if context creation failed
  if (canvasError) {
    return (
      <div className="space-y-6">
        <Card className="p-8">
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold text-destructive">Canvas Error</h2>
            <p className="text-muted-foreground">{canvasError}</p>
            <Button onClick={() => window.location.reload()}>
              Refresh Page
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="overflow-hidden">
            <div
              ref={gameContainerRef}
              tabIndex={0}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              onClick={() => gameContainerRef.current?.focus()}
              className="relative bg-black outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
            >
              <canvas
                ref={canvasRef}
                width={800}
                height={600}
                className="w-full h-auto max-h-[600px] block"
              />

              {gameState === 'idle' && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/80">
                  <div className="text-center space-y-4">
                    <h2 className="text-3xl font-bold text-white arcade-title">Ready to Play?</h2>
                    <Button size="lg" onClick={startGame} className="gap-2">
                      <Play className="h-5 w-5" />
                      Start Game
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowControls(true)}
                      className="ml-2"
                    >
                      Show Controls
                    </Button>
                  </div>
                </div>
              )}

              {gameState === 'playing' && !isFocused && (
                <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/90 text-white px-4 py-2 rounded-lg flex items-center gap-2 border border-primary/50 animate-pulse">
                  <MousePointerClick className="h-4 w-4" />
                  <span className="text-sm font-medium">Click here to enable controls</span>
                </div>
              )}

              {gameState === 'gameOver' && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/80">
                  <div className="text-center space-y-4 max-w-md mx-auto px-4">
                    <h2 className="text-3xl font-bold text-white arcade-title">Game Over!</h2>
                    <ScoreSummary gameId={game.id} currentScore={score} />
                    <Button size="lg" onClick={restartGame} className="gap-2">
                      <RotateCcw className="h-5 w-5" />
                      Play Again
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </Card>

          <div className="mt-4 flex items-center justify-between">
            <div className="text-lg font-semibold">
              Score: <span className="text-primary">{score}</span>
            </div>
            <Button variant="outline" size="sm" onClick={() => setShowControls(true)}>
              Show Controls
            </Button>
          </div>
        </div>

        <div className="lg:col-span-1">
          <LeaderboardPanel gameId={game.id} currentScore={gameState === 'gameOver' ? score : undefined} />
        </div>
      </div>

      <GameControlsOverlay
        game={game}
        open={showControls}
        onClose={() => setShowControls(false)}
      />
    </div>
  );
}
