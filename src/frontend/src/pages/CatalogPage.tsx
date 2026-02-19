import { Link } from '@tanstack/react-router';
import { gamesCatalog } from '../data/gamesCatalog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Gamepad2 } from 'lucide-react';

export default function CatalogPage() {
  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold text-primary arcade-title">
          Play Games Instantly
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          No downloads. No installs. Just pure gaming fun running 100% in your browser.
          Pick a game and start playing right now!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {gamesCatalog.map((game) => (
          <Link key={game.id} to="/play/$gameId" params={{ gameId: game.id }}>
            <Card className="h-full hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/20 cursor-pointer group">
              <div className="aspect-video overflow-hidden rounded-t-lg">
                <img
                  src={game.thumbnail}
                  alt={`${game.title} game preview showing gameplay`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-xl group-hover:text-primary transition-colors">
                    {game.title}
                  </CardTitle>
                  <Gamepad2 className="h-5 w-5 text-primary flex-shrink-0" />
                </div>
                <CardDescription>{game.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {game.controls.map((control, idx) => (
                    <Badge key={idx} variant="secondary" className="text-xs">
                      {control}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
