import { apiClient } from "@/lib/apiClient";
import { DayOfWeek, DayType, TrainingSheet } from "@/types";

export const trainingSheetService = {
  getTrainingSheet(): Promise<TrainingSheet> {
    return apiClient.get<TrainingSheet>("/training-sheet");
  },

  createTrainingSheet(): Promise<TrainingSheet> {
    const defaultDays: Record<string, { status: "training" | "rest" }> = {
      monday: { status: "training" },
      tuesday: { status: "training" },
      wednesday: { status: "training" },
      thursday: { status: "training" },
      friday: { status: "training" },
      saturday: { status: "rest" },
      sunday: { status: "rest" },
    };
    return apiClient.post<TrainingSheet>("/training-sheet", {
      days: defaultDays,
    });
  },

  updateDay(day: DayOfWeek, status: DayType): Promise<TrainingSheet> {
    return apiClient.patch<TrainingSheet>(`/training-sheet/days/${day}`, {
      status,
    });
  },
};
