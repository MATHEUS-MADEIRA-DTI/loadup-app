export interface ProgressionPoint {
  date: string;
  weight: number;
  reps: number;
  sessionCount: number;
}

export interface ExerciseChartStatistics {
  averageWeight: number;
  maxWeight: number;
  minWeight: number;
  averageReps: number;
  maxReps: number;
}

export interface ExerciseChart {
  exerciseName: string;
  seriesType: string | null;
  chartData: ProgressionPoint[];
  statistics: ExerciseChartStatistics;
}

export interface PersonalRecord {
  exerciseName: string;
  weight: number;
  reps: number;
  date: string;
}

export interface ProgressionSummary {
  totalSessionsRecorded: number;
  totalExercisesLogged: number;
  lastSessionDate: string | null;
  workoutStreak: {
    currentDays: number;
    longestStreak: number;
  };
  topExercises: {
    name: string;
    totalRecords: number;
    latestWeight: number;
    maxWeight: number;
  }[];
}
