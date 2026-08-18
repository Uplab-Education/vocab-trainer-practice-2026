export function checkAnswer(selected: string, correct: string): boolean {
  return selected.trim().toLowerCase() === correct.trim().toLowerCase();
}

export function calculateAccuracy(correctCount: number, totalCount: number): number {
  if (totalCount === 0) return 0;
  return Math.round((correctCount / totalCount) * 100);
}