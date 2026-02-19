import { Part3D, GameMode } from '../types';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Package } from 'lucide-react';

interface PartsInventoryProps {
  parts: Part3D[];
  onSelectPart: (partId: string) => void;
  selectedPartId: string | null;
  gameMode: GameMode;
}

export default function PartsInventory({ parts, onSelectPart, selectedPartId, gameMode }: PartsInventoryProps) {
  if (gameMode === 'drive') {
    return null;
  }

  return (
    <div className="absolute bottom-4 left-4 right-4 pointer-events-none z-10">
      <Card className="p-4 bg-black/90 border-primary/30 backdrop-blur-sm pointer-events-auto">
        <div className="flex items-center gap-2 mb-3">
          <Package className="h-5 w-5 text-primary" />
          <h3 className="text-sm font-bold font-mono text-primary">AVAILABLE PARTS</h3>
        </div>
        <ScrollArea className="h-24">
          <div className="flex gap-2">
            {parts.map((part) => (
              <button
                key={part.id}
                onClick={() => onSelectPart(part.id)}
                className={`shrink-0 p-3 rounded border-2 transition-all ${
                  selectedPartId === part.id
                    ? 'border-primary bg-primary/20 scale-105'
                    : 'border-muted-foreground/30 bg-muted/20 hover:border-primary/50'
                }`}
              >
                <div
                  className="w-12 h-12 rounded"
                  style={{ backgroundColor: part.color }}
                />
                <div className="text-xs font-mono mt-1 text-center text-muted-foreground">
                  {part.type}
                </div>
              </button>
            ))}
          </div>
        </ScrollArea>
      </Card>
    </div>
  );
}
