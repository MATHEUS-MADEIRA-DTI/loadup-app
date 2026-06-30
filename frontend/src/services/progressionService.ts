import { apiClient } from "@/lib/apiClient";
import { ExerciseChart, ProgressionSummary } from "@/types";

export const progressionService = {
  getSummary(): Promise<ProgressionSummary> {
    return apiClient.get<ProgressionSummary>("/progression/summary");
  },

  getChart(exerciseName: string, seriesType?: string): Promise<ExerciseChart> {
    const qs = seriesType ? `?seriesType=${encodeURIComponent(seriesType)}` : "";
    return apiClient.get<ExerciseChart>(
      `/progression/chart/${encodeURIComponent(exerciseName)}${qs}`,
    );
  },
};
