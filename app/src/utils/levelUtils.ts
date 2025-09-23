export const calculateLevel = (points: number): number => {
  // Example: 100 points per level, max level 10
  return Math.min(10, Math.floor(points / 100) + 1);
};

export const getPointsForNextLevel = (currentLevel: number): number => {
  if (currentLevel >= 10) return 0; // Max level reached
  return currentLevel * 100; // Points needed for next level
};