import { MuscleGroup } from "./trainingSheet";

export interface SearchResult {
  name: string;
  muscleGroup: MuscleGroup;
  videoUrl: string;
  tip?: string;
}

export interface CsvImportError {
  row: number;
  field: string;
  message: string;
}
