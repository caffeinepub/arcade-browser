const STORAGE_KEY_PREFIX = 'arcade_best_';

export function getLocalBestScore(gameId: string): number {
  try {
    const stored = localStorage.getItem(`${STORAGE_KEY_PREFIX}${gameId}`);
    return stored ? parseInt(stored, 10) : 0;
  } catch (error) {
    console.error('Failed to get local best score:', error);
    return 0;
  }
}

export function saveLocalBestScore(gameId: string, score: number): void {
  try {
    const currentBest = getLocalBestScore(gameId);
    if (score > currentBest) {
      localStorage.setItem(`${STORAGE_KEY_PREFIX}${gameId}`, score.toString());
    }
  } catch (error) {
    console.error('Failed to save local best score:', error);
  }
}
