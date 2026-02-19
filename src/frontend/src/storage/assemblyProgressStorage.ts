export interface AssemblyProgress {
  unlockedLevels: number[];
  completedLevels: number[];
  levelScores: Record<number, number>;
  lastPlayed: number;
}

const STORAGE_KEY = 'assembly_progress';

export function loadProgress(): AssemblyProgress {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Failed to load assembly progress:', error);
  }

  return {
    unlockedLevels: [1],
    completedLevels: [],
    levelScores: {},
    lastPlayed: Date.now(),
  };
}

export function saveProgress(progress: AssemblyProgress): void {
  try {
    progress.lastPlayed = Date.now();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (error) {
    console.error('Failed to save assembly progress:', error);
  }
}

export function unlockNextLevel(currentLevel: number): void {
  const progress = loadProgress();
  const nextLevel = currentLevel + 1;
  
  if (!progress.unlockedLevels.includes(nextLevel)) {
    progress.unlockedLevels.push(nextLevel);
  }
  
  if (!progress.completedLevels.includes(currentLevel)) {
    progress.completedLevels.push(currentLevel);
  }
  
  saveProgress(progress);
}

export function saveLevelScore(level: number, score: number): void {
  const progress = loadProgress();
  const currentBest = progress.levelScores[level] || 0;
  
  if (score > currentBest) {
    progress.levelScores[level] = score;
    saveProgress(progress);
  }
}

export function clearProgress(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear assembly progress:', error);
  }
}

export function isLevelUnlocked(level: number): boolean {
  const progress = loadProgress();
  return progress.unlockedLevels.includes(level);
}

export function getLevelBestScore(level: number): number {
  const progress = loadProgress();
  return progress.levelScores[level] || 0;
}
