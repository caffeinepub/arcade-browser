import { useEffect } from 'react';
import { getLocalBestScore, saveLocalBestScore } from '../storage/localHighScores';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, Target } from 'lucide-react';

interface ScoreSummaryProps {
  gameId: string;
  currentScore: number;
}

export default function ScoreSummary({ gameId, currentScore }: ScoreSummaryProps) {
  const localBest = getLocalBestScore(gameId);
  const isNewBest = currentScore > localBest;

  useEffect(() => {
    if (isNewBest) {
      saveLocalBestScore(gameId, currentScore);
    }
  }, [gameId, currentScore, isNewBest]);

  return (
    <Card className="bg-card/80 backdrop-blur">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Your Score</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between p-3 rounded-lg bg-primary/10">
          <div className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            <span className="font-medium">Current</span>
          </div>
          <span className="text-2xl font-bold text-primary">{currentScore}</span>
        </div>
        <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
          <div className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            <span className="font-medium">Your Best</span>
          </div>
          <span className="text-2xl font-bold">{isNewBest ? currentScore : localBest}</span>
        </div>
        {isNewBest && localBest > 0 && (
          <p className="text-sm text-center text-primary font-semibold">🎉 New Personal Best!</p>
        )}
      </CardContent>
    </Card>
  );
}
