import { apiClient } from "@/lib/apiClient";
import { ExerciseChart, ProgressionSummary } from "@/types";

export const progressionService = {
  getSummary(): Promise<ProgressionSummary> {
    return apiClient.get<ProgressionSummary>("/progression/summary");
  },

  getChart(exerciseName: string): Promise<ExerciseChart> {
    return apiClient.get<ExerciseChart>(
      `/progression/chart/${encodeURIComponent(exerciseName)}`,
    );
  },
};
