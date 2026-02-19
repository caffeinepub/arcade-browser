import { GameMetadata } from '../data/gamesCatalog';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';

interface GameControlsOverlayProps {
  game: GameMetadata;
  open: boolean;
  onClose: () => void;
}

export default function GameControlsOverlay({ game, open, onClose }: GameControlsOverlayProps) {
  const getDetailedControls = () => {
    switch (game.id) {
      case 'snake':
        return [
          { key: 'W / ↑', action: 'Move up' },
          { key: 'A / ←', action: 'Move left' },
          { key: 'S / ↓', action: 'Move down' },
          { key: 'D / →', action: 'Move right' },
          { key: 'Space', action: 'Pause/Resume game' },
        ];
      case 'pong':
        return [
          { key: 'W / ↑', action: 'Move paddle up' },
          { key: 'S / ↓', action: 'Move paddle down' },
          { key: 'Space', action: 'Start/Pause game' },
        ];
      case 'breakout':
        return [
          { key: 'A / ←', action: 'Move paddle left' },
          { key: 'D / →', action: 'Move paddle right' },
          { key: 'Space', action: 'Launch ball / Pause' },
        ];
      default:
        return [];
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{game.title} - Controls</DialogTitle>
          <DialogDescription>{game.description}</DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          {getDetailedControls().map((control, idx) => (
            <div key={idx} className="flex items-center justify-between gap-4 p-3 rounded-lg bg-muted/50">
              <Badge variant="secondary" className="font-mono">
                {control.key}
              </Badge>
              <span className="text-sm text-muted-foreground flex-1 text-right">{control.action}</span>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
