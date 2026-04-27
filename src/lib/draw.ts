type DrawMode = "random" | "weighted";

const MAX_NUMBER = 45;
const DRAW_SIZE = 5;

function uniqueRandomNumbers(count: number, max: number): number[] {
  const numbers = new Set<number>();
  while (numbers.size < count) {
    numbers.add(Math.floor(Math.random() * max) + 1);
  }
  return Array.from(numbers).sort((a, b) => a - b);
}

export function buildEntryFromScores(scores: number[]): number[] {
  return [...scores].sort((a, b) => b - a).slice(0, DRAW_SIZE);
}

export function generateWinningNumbers(mode: DrawMode, allScores: number[]): number[] {
  if (mode === "random" || allScores.length === 0) {
    return uniqueRandomNumbers(DRAW_SIZE, MAX_NUMBER);
  }

  const frequency = new Map<number, number>();
  for (const score of allScores) {
    const current = frequency.get(score) ?? 0;
    frequency.set(score, current + 1);
  }

  const weighted = Array.from(frequency.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([score]) => score)
    .filter((score) => score >= 1 && score <= MAX_NUMBER);

  const selected = new Set<number>();
  for (const score of weighted) {
    selected.add(score);
    if (selected.size === DRAW_SIZE) {
      break;
    }
  }

  if (selected.size < DRAW_SIZE) {
    uniqueRandomNumbers(DRAW_SIZE, MAX_NUMBER).forEach((score) => selected.add(score));
  }

  return Array.from(selected).slice(0, DRAW_SIZE).sort((a, b) => a - b);
}

export function calculateMatchTier(entry: number[], winningNumbers: number[]) {
  const winning = new Set(winningNumbers);
  const matchedCount = entry.filter((score) => winning.has(score)).length;

  if (matchedCount >= 5) return { matchedCount, tier: "5-match" as const };
  if (matchedCount === 4) return { matchedCount, tier: "4-match" as const };
  if (matchedCount === 3) return { matchedCount, tier: "3-match" as const };

  return { matchedCount, tier: "none" as const };
}

export function calculatePrizeSplit(totalPoolCents: number, winnerCount: number): number {
  if (winnerCount <= 0) return 0;
  return Math.floor(totalPoolCents / winnerCount);
}
