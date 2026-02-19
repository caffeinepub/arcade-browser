import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useSubmitScore } from '../hooks/useQueries';
import { getLocalBestScore } from '../storage/localHighScores';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trophy, Upload, Lock } from 'lucide-react';
import { useState } from 'react';

interface LeaderboardPanelProps {
  gameId: string;
  currentScore?: number;
}

export default function LeaderboardPanel({ gameId, currentScore }: LeaderboardPanelProps) {
  const { identity } = useInternetIdentity();
  const submitScore = useSubmitScore();
  const [submitted, setSubmitted] = useState(false);
  const localBest = getLocalBestScore(gameId);

  const isAuthenticated = !!identity;
  const canSubmit = isAuthenticated && currentScore !== undefined && currentScore > 0 && !submitted;

  const handleSubmitScore = async () => {
    if (!canSubmit || currentScore === undefined) return;
    
    try {
      await submitScore.mutateAsync({ gameId, score: currentScore });
      setSubmitted(true);
    } catch (error) {
      console.error('Failed to submit score:', error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-primary" />
          <CardTitle>Leaderboard</CardTitle>
        </div>
        <CardDescription>Track your progress and compete globally</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <h3 className="font-semibold text-sm">Your Best Score</h3>
          <div className="p-4 rounded-lg bg-muted/50 text-center">
            <div className="text-3xl font-bold text-primary">{localBest}</div>
            <div className="text-xs text-muted-foreground mt-1">Saved locally</div>
          </div>
        </div>

        {!isAuthenticated && (
          <div className="p-4 rounded-lg bg-muted/30 border border-dashed space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Lock className="h-4 w-4" />
              Global Leaderboard
            </div>
            <p className="text-xs text-muted-foreground">
              Sign in to submit your scores and see how you rank against other players worldwide!
            </p>
          </div>
        )}

        {isAuthenticated && canSubmit && (
          <Button 
            onClick={handleSubmitScore} 
            className="w-full gap-2"
            disabled={submitScore.isPending}
          >
            <Upload className="h-4 w-4" />
            {submitScore.isPending ? 'Submitting...' : 'Submit Score'}
          </Button>
        )}

        {submitted && (
          <div className="p-3 rounded-lg bg-primary/10 text-center text-sm text-primary font-medium">
            ✓ Score submitted successfully!
          </div>
        )}

        {isAuthenticated && !currentScore && (
          <p className="text-xs text-center text-muted-foreground">
            Complete a game to submit your score to the global leaderboard
          </p>
        )}
      </CardContent>
    </Card>
  );
}
