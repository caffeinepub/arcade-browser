import { assemblyLevels } from '../levels';
import { isLevelUnlocked, getLevelBestScore } from '../../../storage/assemblyProgressStorage';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lock, Trophy, Clock } from 'lucide-react';

interface LevelSelectorProps {
  onSelectLevel: (levelId: number) => void;
  currentLevel: number;
}

export default function LevelSelector({ onSelectLevel, currentLevel }: LevelSelectorProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {assemblyLevels.map((level) => {
        const unlocked = isLevelUnlocked(level.id);
        const bestScore = getLevelBestScore(level.id);
        const isActive = level.id === currentLevel;

        return (
          <Card
            key={level.id}
            className={`p-6 transition-all ${
              isActive
                ? 'border-primary bg-primary/10'
                : unlocked
                ? 'hover:border-primary/50 cursor-pointer'
                : 'opacity-50'
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-lg font-bold text-primary font-mono">Level {level.id}</h3>
                <p className="text-sm text-muted-foreground">{level.name}</p>
              </div>
              {!unlocked && <Lock className="h-5 w-5 text-muted-foreground" />}
            </div>

            <p className="text-sm text-muted-foreground mb-4">{level.description}</p>

            <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>{level.timeLimit}s</span>
              </div>
              <div className={`px-2 py-1 rounded ${
                level.difficulty === 'easy' ? 'bg-green-500/20 text-green-500' :
                level.difficulty === 'medium' ? 'bg-yellow-500/20 text-yellow-500' :
                'bg-red-500/20 text-red-500'
              }`}>
                {level.difficulty.toUpperCase()}
              </div>
            </div>

            {bestScore > 0 && (
              <div className="flex items-center gap-2 mb-4 text-sm">
                <Trophy className="h-4 w-4 text-accent" />
                <span className="text-accent font-mono">Best: {bestScore}</span>
              </div>
            )}

            <Button
              onClick={() => onSelectLevel(level.id)}
              disabled={!unlocked}
              className="w-full"
              variant={isActive ? 'default' : 'outline'}
            >
              {isActive ? 'Current Level' : unlocked ? 'Select Level' : 'Locked'}
            </Button>
          </Card>
        );
      })}
    </div>
  );
}
