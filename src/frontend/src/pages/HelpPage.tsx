import { Link } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Gamepad2, Keyboard, Trophy, Zap } from 'lucide-react';

export default function HelpPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-primary arcade-title">How It Works</h1>
        <p className="text-lg text-muted-foreground">
          Everything you need to know about playing games on Arcade Browser
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              <CardTitle>100% Browser-Based</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-muted-foreground">
              All games run entirely in your browser using modern web technologies. No downloads,
              no installations, no plugins required. Just click and play!
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Keyboard className="h-5 w-5 text-primary" />
              <CardTitle>Keyboard Controls</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-muted-foreground">
              Most games use arrow keys or WASD for movement. Specific controls are shown when you
              start each game. Press the help button in-game to see controls anytime.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-primary" />
              <CardTitle>Score Tracking</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-muted-foreground">
              Your best scores are automatically saved locally on your device. Sign in to submit
              scores to the global leaderboard and compete with other players!
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Gamepad2 className="h-5 w-5 text-primary" />
              <CardTitle>Available Games</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <ul className="list-disc list-inside text-muted-foreground space-y-1">
              <li><strong>Snake:</strong> Classic snake game - eat food, grow longer, avoid walls</li>
              <li><strong>Pong:</strong> Retro paddle game - keep the ball in play</li>
              <li><strong>Breakout:</strong> Break bricks with a bouncing ball</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Game Controls Reference</CardTitle>
          <CardDescription>Common keyboard controls used across games</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <h3 className="font-semibold mb-2">Snake</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>Arrow Keys: Change direction</li>
                <li>Space: Pause/Resume</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Pong</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>W/S or Up/Down: Move paddle</li>
                <li>Space: Start/Pause</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Breakout</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>Left/Right Arrows: Move paddle</li>
                <li>Space: Launch ball/Pause</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="text-center">
        <Link to="/">
          <Button size="lg" className="gap-2">
            <Gamepad2 className="h-5 w-5" />
            Start Playing
          </Button>
        </Link>
      </div>
    </div>
  );
}
