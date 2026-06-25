export type SeriesType = 'aquecimento' | 'adaptacao' | 'trabalho';

export interface Exercise {
  id: string;
  name: string;
  muscle: string;
  seriesType: SeriesType;
  totalSeries: number;
  workSeries: number;
}

export interface DayPlan {
  id: string;
  abbr: string;
  name: string;
  isRest: boolean;
  muscles: string[];
  exercises: Exercise[];
  isToday?: boolean;
}

export interface SessionRecord {
  id: string;
  dayName: string;
  status: 'concluido' | 'parcial';
  muscles: string[];
  date: string;
  icon: string;
}

export const user = {
  name: 'Lucas',
  initials: 'LS',
  email: 'lucas.silva@loadup.app',
};

export const stats = {
  streak: 12,
  week: 4,
  total: 87,
};

export const weeklyCalendar = [
  { abbr: 'SEG', day: 16, status: 'done' as const },
  { abbr: 'TER', day: 17, status: 'done' as const },
  { abbr: 'QUA', day: 18, status: 'done' as const },
  { abbr: 'QUI', day: 19, status: 'rest' as const },
  { abbr: 'SEX', day: 20, status: 'active' as const },
  { abbr: 'SÁB', day: 21, status: 'upcoming' as const },
  { abbr: 'DOM', day: 22, status: 'upcoming' as const },
];

export const todayMuscles = ['Peito', 'Tríceps', 'Ombro'];

export const todayExercises: Exercise[] = [
  { id: 't1', name: 'Supino Reto com Halteres', muscle: 'Peito', seriesType: 'trabalho', totalSeries: 4, workSeries: 4 },
  { id: 't2', name: 'Crossover no Cabo', muscle: 'Peito', seriesType: 'trabalho', totalSeries: 3, workSeries: 3 },
  { id: 't3', name: 'Tríceps Pulley', muscle: 'Tríceps', seriesType: 'trabalho', totalSeries: 3, workSeries: 3 },
  { id: 't4', name: 'Elevação Lateral', muscle: 'Ombro', seriesType: 'trabalho', totalSeries: 4, workSeries: 4 },
  { id: 't5', name: 'Desenvolvimento Militar', muscle: 'Ombro', seriesType: 'trabalho', totalSeries: 3, workSeries: 3 },
];

export const plan: DayPlan[] = [
  {
    id: 'd1',
    abbr: 'SEG',
    name: 'Segunda-feira',
    isRest: false,
    muscles: ['Peito', 'Tríceps'],
    exercises: [
      { id: 'e1', name: 'Supino Reto', muscle: 'Peito', seriesType: 'trabalho', totalSeries: 4, workSeries: 4 },
      { id: 'e2', name: 'Supino Inclinado', muscle: 'Peito', seriesType: 'trabalho', totalSeries: 3, workSeries: 3 },
      { id: 'e3', name: 'Tríceps Pulley', muscle: 'Tríceps', seriesType: 'trabalho', totalSeries: 3, workSeries: 3 },
      { id: 'e4', name: 'Tríceps Francês', muscle: 'Tríceps', seriesType: 'trabalho', totalSeries: 3, workSeries: 3 },
    ],
  },
  {
    id: 'd2',
    abbr: 'TER',
    name: 'Terça-feira',
    isRest: false,
    muscles: ['Costas', 'Bíceps'],
    exercises: [
      { id: 'e5', name: 'Puxada Frontal', muscle: 'Costas', seriesType: 'trabalho', totalSeries: 4, workSeries: 4 },
      { id: 'e6', name: 'Remada Baixa', muscle: 'Costas', seriesType: 'trabalho', totalSeries: 3, workSeries: 3 },
      { id: 'e7', name: 'Rosca Direta', muscle: 'Bíceps', seriesType: 'trabalho', totalSeries: 3, workSeries: 3 },
    ],
  },
  {
    id: 'd3',
    abbr: 'QUA',
    name: 'Quarta-feira',
    isRest: false,
    muscles: ['Pernas', 'Glúteos'],
    exercises: [
      { id: 'e8', name: 'Agachamento Livre', muscle: 'Pernas', seriesType: 'trabalho', totalSeries: 4, workSeries: 4 },
      { id: 'e9', name: 'Leg Press 45°', muscle: 'Pernas', seriesType: 'trabalho', totalSeries: 3, workSeries: 3 },
      { id: 'e10', name: 'Stiff', muscle: 'Glúteos', seriesType: 'trabalho', totalSeries: 3, workSeries: 3 },
    ],
  },
  {
    id: 'd4',
    abbr: 'QUI',
    name: 'Quinta-feira',
    isRest: true,
    muscles: [],
    exercises: [],
  },
  {
    id: 'd5',
    abbr: 'SEX',
    name: 'Sexta-feira',
    isRest: false,
    isToday: true,
    muscles: ['Peito', 'Tríceps', 'Ombro'],
    exercises: todayExercises,
  },
  {
    id: 'd6',
    abbr: 'SÁB',
    name: 'Sábado',
    isRest: false,
    muscles: ['Full Body'],
    exercises: [
      { id: 'e11', name: 'Burpee', muscle: 'Full Body', seriesType: 'adaptacao', totalSeries: 4, workSeries: 4 },
      { id: 'e12', name: 'Box Jump', muscle: 'Pernas', seriesType: 'trabalho', totalSeries: 3, workSeries: 3 },
    ],
  },
  {
    id: 'd7',
    abbr: 'DOM',
    name: 'Domingo',
    isRest: true,
    muscles: [],
    exercises: [],
  },
];

export const recentSessions: SessionRecord[] = [
  { id: 's1', dayName: 'Quarta-feira', status: 'concluido', muscles: ['Pernas', 'Glúteos'], date: '18 jun', icon: 'P' },
  { id: 's2', dayName: 'Terça-feira', status: 'concluido', muscles: ['Costas', 'Bíceps'], date: '17 jun', icon: 'C' },
  { id: 's3', dayName: 'Segunda-feira', status: 'parcial', muscles: ['Peito', 'Tríceps'], date: '16 jun', icon: 'P' },
  { id: 's4', dayName: 'Sábado', status: 'concluido', muscles: ['Full Body'], date: '14 jun', icon: 'F' },
];

export const weeklyVolume = [
  { day: 'S', value: 3200 },
  { day: 'T', value: 2800 },
  { day: 'Q', value: 4100 },
  { day: 'Q', value: 0 },
  { day: 'S', value: 3600 },
  { day: 'S', value: 2400 },
  { day: 'D', value: 0 },
];

export const personalRecords = [
  { exercise: 'Supino Reto', value: '85 kg', delta: '+5 kg' },
  { exercise: 'Agachamento Livre', value: '120 kg', delta: '+10 kg' },
  { exercise: 'Puxada Frontal', value: '70 kg', delta: '+3 kg' },
  { exercise: 'Rosca Direta', value: '25 kg', delta: '+2 kg' },
];

export const exerciseLibrary = [
  { name: 'Supino Reto com Barra', muscle: 'Peito' },
  { name: 'Supino Inclinado com Halteres', muscle: 'Peito' },
  { name: 'Crossover no Cabo', muscle: 'Peito' },
  { name: 'Crucifixo no Banco', muscle: 'Peito' },
  { name: 'Puxada Frontal', muscle: 'Costas' },
  { name: 'Remada Curvada', muscle: 'Costas' },
  { name: 'Levantamento Terra', muscle: 'Costas' },
  { name: 'Rosca Direta', muscle: 'Bíceps' },
  { name: 'Rosca Martelo', muscle: 'Bíceps' },
  { name: 'Tríceps Pulley', muscle: 'Tríceps' },
  { name: 'Tríceps Francês', muscle: 'Tríceps' },
  { name: 'Agachamento Livre', muscle: 'Pernas' },
  { name: 'Leg Press 45°', muscle: 'Pernas' },
  { name: 'Cadeira Extensora', muscle: 'Pernas' },
  { name: 'Elevação Lateral', muscle: 'Ombro' },
  { name: 'Desenvolvimento Militar', muscle: 'Ombro' },
];

export const muscleGroups = [
  'Peito', 'Costas', 'Pernas', 'Ombro', 'Bíceps', 'Tríceps', 'Glúteos', 'Abdômen', 'Panturrilha', 'Full Body',
];

export const filterChips = ['Todos', 'Peito', 'Costas', 'Pernas', 'Ombro', 'Bíceps', 'Tríceps', 'Glúteos'];

export const seriesTypeLabel: Record<SeriesType, string> = {
  aquecimento: 'Aquecimento',
  adaptacao: 'Adaptação',
  trabalho: 'Trabalho',
};

export const seriesTypeShort: Record<SeriesType, string> = {
  aquecimento: 'AQUECIMENTO',
  adaptacao: 'ADAPTAÇÃO',
  trabalho: 'TRABALHO',
};
