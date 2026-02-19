export interface ScoreCalculation {
  baseScore: number;
  timeBonus: number;
  accuracyBonus: number;
  penaltyDeduction: number;
  finalScore: number;
}

export function calculateScore(
  correctPlacements: number,
  timeElapsed: number,
  timeLimit: number,
  mistakes: number,
  totalParts: number
): ScoreCalculation {
  const baseScore = correctPlacements * 100;
  
  const timeRatio = Math.max(0, 1 - timeElapsed / timeLimit);
  const timeBonus = Math.floor(baseScore * timeRatio * 0.5);
  
  const accuracyRatio = correctPlacements / totalParts;
  const accuracyBonus = Math.floor(baseScore * accuracyRatio * 0.3);
  
  const penaltyDeduction = mistakes * 20;
  
  const finalScore = Math.max(0, baseScore + timeBonus + accuracyBonus - penaltyDeduction);
  
  return {
    baseScore,
    timeBonus,
    accuracyBonus,
    penaltyDeduction,
    finalScore,
  };
}

export function getPointsForPlacement(isCorrect: boolean): number {
  return isCorrect ? 100 : 0;
}

export function getPenaltyForMistake(): number {
  return 20;
}
