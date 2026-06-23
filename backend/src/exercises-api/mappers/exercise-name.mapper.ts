/**
 * Maps Portuguese exercise names to English equivalents for API Ninjas.
 * This ensures users can search in Portuguese while the external API receives English queries.
 */
const EXERCISE_NAME_MAP: Record<string, string> = {
  // Chest exercises
  supino: 'bench press',
  'supino reto': 'bench press',
  'supino inclinado': 'incline bench press',
  'supino declinado': 'decline bench press',
  'cross over': 'cable crossover',
  'peck deck': 'peck deck',
  voador: 'cable crossover',

  // Back exercises
  agachamento: 'squat',
  'agachamento livre': 'barbell squat',
  'agachamento hack': 'hack squat',
  rosca: 'barbell curl',
  'rosca direta': 'barbell curl',
  'rosca direta sentado': 'seated barbell curl',
  'rosca scott': 'scott curl',
  'rosca inversa': 'reverse curl',
  'puxada alta': 'lat pulldown',
  'puxada frontal': 'lat pulldown',
  'puxada costas': 'lat pulldown',
  remada: 'barbell row',
  'remada curvada': 'barbell row',
  'remada cavalinho': 'barbell row',
  'remada máquina': 'machine row',
  'remada unilateral': 'dumbbell row',
  'puxada individual': 'single arm lat pulldown',
  'pull down': 'lat pulldown',

  // Shoulder exercises
  desenvolvimento: 'shoulder press',
  'desenvolvimento militar': 'shoulder press',
  'desenvolvimento máquina': 'machine shoulder press',
  'desenvolvimento halteres': 'dumbbell shoulder press',
  elevação: 'lateral raise',
  'elevação lateral': 'lateral raise',
  'elevação frontal': 'front raise',
  encolhimento: 'shrugs',
  'encolhimento halteres': 'dumbbell shrugs',

  // Arms exercises
  tríceps: 'triceps dip',
  'tríceps banco': 'bench dip',
  'tríceps corda': 'triceps rope pushdown',
  'tríceps testa': 'skull crusher',
  'extensão tríceps': 'triceps extension',
  mergulho: 'dips',

  // Leg exercises
  'leg press': 'leg press',
  'leg press máquina': 'leg press',
  'cadeira extensora': 'leg extension',
  'cadeira flexora': 'leg curl',
  'flexora máquina': 'leg curl',
  'extensora máquina': 'leg extension',
  estensora: 'leg extension',

  // Glute exercises
  glúteo: 'glute exercises',
  'agachamento sumo': 'sumo squat',
  'elevação pélvica': 'hip thrust',
  'ponte glúteos': 'glute bridge',
  'abdutor máquina': 'abductor machine',

  // Abs exercises
  abdominal: 'crunches',
  'abdominal máquina': 'cable crunch',
  'abdominal solo': 'crunches',
  prancha: 'plank',
  'levantamento joelhos': 'knee raises',
  'levantamento pernas': 'leg raises',

  // Cardio exercises
  corrida: 'running',
  'corrida esteira': 'treadmill',
  'bicicleta ergométrica': 'stationary bike',
  'bicicleta elíptica': 'elliptical',
  elíptico: 'elliptical',
  remo: 'rowing',

  // Stretching
  alongamento: 'stretching',
  'alongamento dinâmico': 'dynamic stretching',
  'alongamento estático': 'static stretching',
};

/**
 * Translates a Portuguese exercise name to English for API Ninjas queries.
 * If no mapping exists, returns the original name.
 */
export function mapExerciseNameToEnglish(ptName: string): string {
  if (!ptName) return ptName;
  const normalized = ptName.trim().toLowerCase();
  return EXERCISE_NAME_MAP[normalized] ?? ptName;
}
