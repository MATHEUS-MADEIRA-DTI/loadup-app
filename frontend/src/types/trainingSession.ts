import { SeriesType } from "./trainingSheet";

export type SessionStatus = "partial" | "completed" | "skipped";

export interface LoggedSet {
  _id: string;
  exerciseName: string;
  seriesType: SeriesType;
  seriesOrder: number;
  weight: number;
  repsCompleted: number;
  restTime: number;
}

export interface TrainingSession {
  _id: string;
  userId: string;
  date: string;
  dayOfWeek: string;
  status: SessionStatus;
  records: LoggedSet[];
  createdAt: string;
  updatedAt: string;
}

export interface AddRecordPayload {
  exerciseName: string;
  seriesType: SeriesType;
  seriesOrder: number;
  weight: number;
  repsCompleted: number;
  restTime: number;
}

export interface UpdateRecordPayload {
  exerciseName?: string;
  seriesType?: SeriesType;
  seriesOrder?: number;
  weight?: number;
  repsCompleted?: number;
  restTime?: number;
}

export interface CompleteSessionPayload {
  status: "completed" | "skipped";
}
