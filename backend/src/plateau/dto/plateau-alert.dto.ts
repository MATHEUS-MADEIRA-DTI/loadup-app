export class PlateauAlertItemDto {
  _id: string;
  exerciseName: string;
  dayOfWeek: string;
  alertType: 'exercise' | 'day';
  suggestion: string | null;
  sessionCount: number;
  detectedAt: Date;
  active: boolean;
}

export class PlateauAlertsResponseDto {
  data: PlateauAlertItemDto[];
  timestamp: string;
}

export class ExercisePlateauStatusDto {
  exerciseName: string;
  plateau: boolean;
  suggestion: string | null;
  dayOfWeek?: string;
  alertType?: 'exercise';
  sessionCount?: number;
  detectedAt?: Date;
}
