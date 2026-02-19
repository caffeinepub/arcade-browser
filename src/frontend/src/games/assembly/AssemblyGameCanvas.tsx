import { useRef, useState, useEffect } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { AssemblyGame } from './AssemblyGame';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, RotateCcw, Settings } from 'lucide-react';
import AssemblyUI from './components/AssemblyUI';
import PartsInventory from './components/PartsInventory';
import Part3DComponent from './components/Part3DComponent';
import LevelSelector from './components/LevelSelector';
import ModeSelector from './components/ModeSelector';
import ProgressResetButton from './components/ProgressResetButton';
import ThirdPersonCamera from './components/ThirdPersonCamera';
import ScoreSummary from '../../components/ScoreSummary';
import LeaderboardPanel from '../../components/LeaderboardPanel';
import * as THREE from 'three';

interface AssemblyGameCanvasProps {
  gameId: string;
}

function Scene({ game }: { game: AssemblyGame }) {
  const { camera, raycaster, pointer } = useThree();
  const [hoveredPart, setHoveredPart] = useState<string | null>(null);

  useFrame(() => {
    const state = game.getState();
    const draggedPart = game.getDraggedPart();

    if (draggedPart && state.gameMode === 'build') {
      raycaster.setFromCamera(pointer, camera);
      const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
      const intersection = new THREE.Vector3();
      raycaster.ray.intersectPlane(plane, intersection);

      if (intersection) {
        game.updateDragPosition(intersection.x, intersection.y, intersection.z);
      }
    }
  });

  const state = game.getState();
  const draggedPart = game.getDraggedPart();
  const isDriveMode = state.gameMode === 'drive';

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
      <directionalLight position={[-10, 10, -5]} intensity={0.5} />
      <pointLight position={[0, 5, 0]} intensity={0.5} />

      <gridHelper args={[20, 20, 0x444444, 0x222222]} />

      {state.placedParts.map((part) => (
        <Part3DComponent key={part.id} part={part} />
      ))}

      {draggedPart && state.gameMode === 'build' && (
        <Part3DComponent
          part={draggedPart}
          isSelected={true}
          isDragging={true}
        />
      )}

      {isDriveMode ? (
        <ThirdPersonCamera
          targetPosition={game.getVehiclePosition()}
          targetRotation={game.getVehicleRotation()}
        />
      ) : (
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          maxPolarAngle={Math.PI / 2}
          minDistance={5}
          maxDistance={30}
        />
      )}
    </>
  );
}

export default function AssemblyGameCanvas({ gameId }: AssemblyGameCanvasProps) {
  const gameRef = useRef<AssemblyGame | null>(null);
  const [gameState, setGameState] = useState<'menu' | 'levelSelect' | 'playing' | 'gameOver'>('menu');
  const [score, setScore] = useState(0);
  const [selectedMode, setSelectedMode] = useState<'single' | 'multiplayer'>('single');
  const [currentLevel, setCurrentLevel] = useState(1);
  const [, setUpdateTrigger] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      if (gameRef.current && gameState === 'playing') {
        gameRef.current.update(16);
        setScore(gameRef.current.getScore());
        
        if (gameRef.current.isGameOver()) {
          setGameState('gameOver');
        }
        
        setUpdateTrigger((prev) => prev + 1);
      }
    }, 16);

    return () => clearInterval(interval);
  }, [gameState]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameRef.current && gameState === 'playing') {
        gameRef.current.handleKeyDown(e.key);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (gameRef.current && gameState === 'playing') {
        gameRef.current.handleKeyUp(e.key);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gameState]);

  const handleModeSelect = (mode: 'single' | 'multiplayer') => {
    setSelectedMode(mode);
    setGameState('levelSelect');
  };

  const handleLevelSelect = (levelId: number) => {
    setCurrentLevel(levelId);
    gameRef.current = new AssemblyGame(levelId, selectedMode);
    setGameState('playing');
  };

  const handleRestart = () => {
    if (gameRef.current) {
      gameRef.current.reset();
      setScore(0);
      setGameState('playing');
    }
  };

  const handleBackToMenu = () => {
    gameRef.current = null;
    setGameState('menu');
  };

  const handleSelectPart = (partId: string) => {
    if (gameRef.current) {
      gameRef.current.selectPart(partId);
    }
  };

  const handleCanvasClick = () => {
    if (gameRef.current && gameRef.current.getDraggedPart() && gameRef.current.getGameMode() === 'build') {
      const success = gameRef.current.tryPlacePart();
      if (!success) {
        gameRef.current.cancelDrag();
      }
    }
  };

  const handleToggleMode = () => {
    if (gameRef.current) {
      const success = gameRef.current.toggleGameMode();
      if (success) {
        setUpdateTrigger((prev) => prev + 1);
      }
    }
  };

  if (gameState === 'menu') {
    return (
      <div className="space-y-6">
        <Card className="p-8">
          <div className="text-center space-y-4 mb-8">
            <h2 className="text-3xl font-bold text-primary arcade-title">Mechanical Assembly</h2>
            <p className="text-muted-foreground">
              Build complex machines by assembling parts in 3D space. Drag parts, snap them together, and complete the assembly before time runs out!
            </p>
          </div>
          <ModeSelector onSelectMode={handleModeSelect} />
        </Card>
      </div>
    );
  }

  if (gameState === 'levelSelect') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-primary arcade-title">Select Level</h2>
          <div className="flex gap-2">
            <ProgressResetButton onReset={() => setUpdateTrigger((prev) => prev + 1)} />
            <Button variant="outline" onClick={handleBackToMenu}>
              Back to Menu
            </Button>
          </div>
        </div>
        <LevelSelector onSelectLevel={handleLevelSelect} currentLevel={currentLevel} />
      </div>
    );
  }

  const state = gameRef.current?.getState();
  const multiplayerState = gameRef.current?.getMultiplayerState();
  const level = gameRef.current?.getCurrentLevel();
  const canEnterDriveMode = gameRef.current?.canEnterDriveMode() || false;

  return (
    <div className="space-y-6">
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="overflow-hidden relative">
            <div className="relative bg-black" style={{ height: '600px' }}>
              <Canvas
                camera={{ position: [8, 8, 8], fov: 50 }}
                onClick={handleCanvasClick}
              >
                {gameRef.current && <Scene game={gameRef.current} />}
              </Canvas>

              {state && level && (
                <>
                  <AssemblyUI
                    state={state}
                    multiplayerState={multiplayerState}
                    timeLimit={level.timeLimit}
                    onToggleMode={handleToggleMode}
                    canEnterDriveMode={canEnterDriveMode}
                  />
                  <PartsInventory
                    parts={state.availableParts}
                    onSelectPart={handleSelectPart}
                    selectedPartId={gameRef.current?.getDraggedPart()?.id || null}
                    gameMode={state.gameMode}
                  />
                </>
              )}

              {gameState === 'gameOver' && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-20">
                  <div className="text-center space-y-4 max-w-md mx-auto px-4">
                    <h2 className="text-3xl font-bold text-white arcade-title">
                      {state?.isComplete ? 'Level Complete!' : 'Time Up!'}
                    </h2>
                    <ScoreSummary gameId={gameId} currentScore={score} />
                    <div className="flex gap-2 justify-center">
                      <Button size="lg" onClick={handleRestart} className="gap-2">
                        <RotateCcw className="h-5 w-5" />
                        Retry Level
                      </Button>
                      <Button size="lg" variant="outline" onClick={() => setGameState('levelSelect')} className="gap-2">
                        <Settings className="h-5 w-5" />
                        Level Select
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Card>

          <div className="mt-4 flex items-center justify-between">
            <div className="text-lg font-semibold">
              Score: <span className="text-primary">{score.toLocaleString()}</span>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setGameState('levelSelect')}>
                Change Level
              </Button>
              <Button variant="outline" size="sm" onClick={handleBackToMenu}>
                Main Menu
              </Button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <LeaderboardPanel gameId={gameId} currentScore={gameState === 'gameOver' ? score : undefined} />
        </div>
      </div>
    </div>
  );
}
