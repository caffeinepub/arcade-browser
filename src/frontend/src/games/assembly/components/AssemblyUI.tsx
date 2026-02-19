import { AssemblyState, MultiplayerState } from '../types';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Clock, Target, AlertCircle, Trophy, Car, Wrench } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface AssemblyUIProps {
  state: AssemblyState;
  multiplayerState?: MultiplayerState;
  timeLimit: number;
  onToggleMode: () => void;
  canEnterDriveMode: boolean;
}

export default function AssemblyUI({ state, multiplayerState, timeLimit, onToggleMode, canEnterDriveMode }: AssemblyUIProps) {
  const timeRemaining = Math.max(0, timeLimit - state.timeElapsed);
  const minutes = Math.floor(timeRemaining / 60);
  const seconds = Math.floor(timeRemaining % 60);
  const progress = (state.placedParts.length / (state.placedParts.length + state.availableParts.length)) * 100;

  const isDriveMode = state.gameMode === 'drive';

  return (
    <div className="absolute top-4 left-4 right-4 pointer-events-none z-10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {!isDriveMode && (
          <>
            <Card className="p-4 bg-black/80 border-primary/30 backdrop-blur-sm pointer-events-auto">
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-primary" />
                <div>
                  <div className="text-xs text-muted-foreground font-mono">TIME</div>
                  <div className="text-2xl font-bold text-primary font-mono">
                    {minutes}:{seconds.toString().padStart(2, '0')}
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-4 bg-black/80 border-primary/30 backdrop-blur-sm pointer-events-auto">
              <div className="flex items-center gap-3">
                <Target className="h-5 w-5 text-primary" />
                <div className="flex-1">
                  <div className="text-xs text-muted-foreground font-mono mb-1">PROGRESS</div>
                  <Progress value={progress} className="h-2" />
                  <div className="text-xs text-muted-foreground font-mono mt-1">
                    {state.placedParts.length} / {state.placedParts.length + state.availableParts.length}
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-4 bg-black/80 border-primary/30 backdrop-blur-sm pointer-events-auto">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-destructive" />
                <div>
                  <div className="text-xs text-muted-foreground font-mono">MISTAKES</div>
                  <div className="text-2xl font-bold text-destructive font-mono">
                    {state.mistakes}
                  </div>
                </div>
              </div>
            </Card>
          </>
        )}

        {isDriveMode && (
          <Card className="p-4 bg-black/80 border-primary/30 backdrop-blur-sm pointer-events-auto col-span-full">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Car className="h-5 w-5 text-primary" />
                <div>
                  <div className="text-xs text-muted-foreground font-mono">DRIVE MODE</div>
                  <div className="text-sm text-primary font-mono">
                    Use WASD to drive • Press mode button to return to building
                  </div>
                </div>
              </div>
            </div>
          </Card>
        )}
      </div>

      {multiplayerState && multiplayerState.mode === 'multiplayer' && !isDriveMode && (
        <Card className="mt-4 p-4 bg-black/80 border-primary/30 backdrop-blur-sm pointer-events-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`flex items-center gap-2 ${multiplayerState.currentPlayer === 1 ? 'text-primary' : 'text-muted-foreground'}`}>
                <Trophy className="h-5 w-5" />
                <div>
                  <div className="text-xs font-mono">PLAYER 1</div>
                  <div className="text-lg font-bold font-mono">{multiplayerState.player1Score}</div>
                </div>
              </div>
              <div className={`flex items-center gap-2 ${multiplayerState.currentPlayer === 2 ? 'text-primary' : 'text-muted-foreground'}`}>
                <Trophy className="h-5 w-5" />
                <div>
                  <div className="text-xs font-mono">PLAYER 2</div>
                  <div className="text-lg font-bold font-mono">{multiplayerState.player2Score}</div>
                </div>
              </div>
            </div>
            <div className="text-sm font-mono text-primary">
              Current: Player {multiplayerState.currentPlayer}
            </div>
          </div>
        </Card>
      )}

      <div className="mt-4 flex justify-end pointer-events-auto">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={onToggleMode}
                disabled={!isDriveMode && !canEnterDriveMode}
                variant={isDriveMode ? 'default' : 'outline'}
                className="gap-2"
              >
                {isDriveMode ? (
                  <>
                    <Wrench className="h-4 w-4" />
                    Build Mode
                  </>
                ) : (
                  <>
                    <Car className="h-4 w-4" />
                    Drive Mode
                  </>
                )}
              </Button>
            </TooltipTrigger>
            {!isDriveMode && !canEnterDriveMode && (
              <TooltipContent>
                <p>Place a chassis to enable Drive Mode</p>
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
}
