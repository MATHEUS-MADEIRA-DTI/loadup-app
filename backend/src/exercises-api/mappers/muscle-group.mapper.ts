const MUSCLE_MAP: Record<string, string> = {
  chest: 'Peito',
  biceps: 'Bíceps',
  triceps: 'Tríceps',
  back: 'Costas',
  shoulders: 'Ombros',
  abdominals: 'Abdômen',
  quadriceps: 'Perna',
  hamstrings: 'Perna',
  glutes: 'Glúteo',
  calves: 'Perna',
  forearms: 'Bíceps',
  middle_back: 'Costas',
  lower_back: 'Costas',
  lats: 'Costas',
  neck: 'Ombros',
};

/**
 * Maps an English muscle group name (from API Ninjas) to Portuguese.
 * Applied after receiving results from the external API, before caching.
 */
export function mapMuscleGroup(value: string): string {
  return MUSCLE_MAP[value.toLowerCase()] ?? value;
}

/**
 * Reverse map: Portuguese muscle group name → English (for API Ninjas query param).
 * Applied before forwarding the user's muscle param to the external API.
 *
 * Note: Multiple English values map to the same Portuguese label (e.g.,
 * quadriceps, hamstrings, calves → "Perna"). Last-write-wins in reduce, so
 * "Perna" resolves to "calves" (last in iteration order). This is a known,
 * documented approximation — API Ninjas accepts any of these values.
 */
const REVERSE_MUSCLE_MAP: Record<string, string> = Object.entries(MUSCLE_MAP).reduce<
  Record<string, string>
>((acc, [en, pt]) => ({ ...acc, [pt.toLowerCase()]: en }), {});

export function mapMuscleGroupToEnglish(ptValue: string): string {
  return REVERSE_MUSCLE_MAP[ptValue.trim().toLowerCase()] ?? ptValue;
}

/**
 * Maps an English exercise type (from API Ninjas) to Portuguese.
 * Applied after receiving results from the external API, before caching.
 */
const EXERCISE_TYPE_MAP: Record<string, string> = {
  strength: 'Força',
  cardio: 'Cardio',
  stretching: 'Alongamento',
  powerlifting: 'Powerlifting',
  plyometrics: 'Pliometria',
  olympic_weightlifting: 'Halterofilia',
  strongman: 'Strongman',
};

export function mapExerciseType(value: string): string {
  return EXERCISE_TYPE_MAP[value.toLowerCase()] ?? value;
}
