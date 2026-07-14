interface ResolveDisplayValueSources {
  logged?: number | null;
  suggested?: number | null;
  chartLast?: number | null;
  previousInSession?: number | null;
}

/**
 * Ordem de prioridade única para "qual valor mostrar" (peso, reps ou tempo
 * de descanso) — usada tanto no card de próximo exercício (RestTimer) quanto
 * no input da série ativa (SeriesInputRow), para que nunca divirjam entre si.
 */
export function resolveDisplayValue({
  logged,
  suggested,
  chartLast,
  previousInSession,
}: ResolveDisplayValueSources): number | null {
  if (logged != null && logged > 0) return logged;
  if (suggested != null && suggested > 0) return suggested;
  if (chartLast != null && chartLast > 0) return chartLast;
  if (previousInSession != null && previousInSession > 0) return previousInSession;
  return null;
}
