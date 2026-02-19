import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, Users } from 'lucide-react';

interface ModeSelectorProps {
  onSelectMode: (mode: 'single' | 'multiplayer') => void;
}

export default function ModeSelector({ onSelectMode }: ModeSelectorProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
      <Card className="p-8 hover:border-primary transition-all cursor-pointer" onClick={() => onSelectMode('single')}>
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="p-4 rounded-full bg-primary/20">
              <User className="h-12 w-12 text-primary" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-primary">Single Player</h3>
          <p className="text-muted-foreground">
            Build assemblies at your own pace. Complete levels to unlock new challenges and compete for high scores.
          </p>
          <Button size="lg" className="w-full">
            Play Solo
          </Button>
        </div>
      </Card>

      <Card className="p-8 hover:border-accent transition-all cursor-pointer" onClick={() => onSelectMode('multiplayer')}>
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="p-4 rounded-full bg-accent/20">
              <Users className="h-12 w-12 text-accent" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-accent">Local Multiplayer</h3>
          <p className="text-muted-foreground">
            Take turns with a friend on the same device. Compete to place parts correctly and achieve the highest score!
          </p>
          <Button size="lg" variant="outline" className="w-full">
            Play Together
          </Button>
        </div>
      </Card>
    </div>
  );
}
