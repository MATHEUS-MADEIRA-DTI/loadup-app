export const SUGGESTIONS = {
  INCREASE_WEIGHT: 'Tente aumentar 2.5kg no próximo treino',
  INCREASE_REPS: 'Tente fazer mais 1 repetição na próxima sessão',
  REDUCE_REST: 'Considere reduzir o tempo de descanso entre séries',
  VARY_EXERCISE: 'Tente variar o exercício por 1 semana',
} as const;

export function pickSuggestion(
  tuples: Array<{ weight: number; reps: number }>,
  consecutiveCount: number,
): string {
  if (consecutiveCount >= 5) {
    return consecutiveCount % 2 === 0 ? SUGGESTIONS.REDUCE_REST : SUGGESTIONS.VARY_EXERCISE;
  }
  const current = tuples[0];
  const before = tuples[consecutiveCount] ?? null;
  if (!before) return SUGGESTIONS.INCREASE_WEIGHT;
  if (current.weight === before.weight) return SUGGESTIONS.INCREASE_WEIGHT;
  return SUGGESTIONS.INCREASE_REPS;
}
