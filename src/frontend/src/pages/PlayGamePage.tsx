import { useParams, useNavigate } from '@tanstack/react-router';
import { gamesCatalog } from '../data/gamesCatalog';
import GameCanvas from '../components/GameCanvas';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function PlayGamePage() {
  const { gameId } = useParams({ from: '/play/$gameId' });
  const navigate = useNavigate();
  const game = gamesCatalog.find((g) => g.id === gameId);

  if (!game) {
    return (
      <div className="text-center space-y-4">
        <h1 className="text-2xl font-bold">Game not found</h1>
        <Button onClick={() => navigate({ to: '/' })}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Catalog
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary arcade-title">{game.title}</h1>
          <p className="text-muted-foreground">{game.description}</p>
        </div>
        <Button variant="outline" onClick={() => navigate({ to: '/' })}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
      </div>

      <GameCanvas game={game} />
    </div>
  );
}
