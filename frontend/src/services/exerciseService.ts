import { apiClient } from "@/lib/apiClient";
import {
  CreateExercisePayload,
  DayOfWeek,
  Exercise,
  TrainingSheet,
  UpdateExercisePayload,
} from "@/types";

export const exerciseService = {
  getExercises(day: DayOfWeek): Promise<Exercise[]> {
    return apiClient.get<Exercise[]>(`/training-sheet/days/${day}/exercises`);
  },

  addExercise(
    day: DayOfWeek,
    payload: CreateExercisePayload,
  ): Promise<TrainingSheet> {
    return apiClient.post<TrainingSheet>(
      `/training-sheet/days/${day}/exercises`,
      payload,
    );
  },

  updateExercise(
    day: DayOfWeek,
    id: string,
    payload: UpdateExercisePayload,
  ): Promise<TrainingSheet> {
    return apiClient.patch<TrainingSheet>(
      `/training-sheet/days/${day}/exercises/${id}`,
      payload,
    );
  },

  reorderExercises(day: DayOfWeek, orderedIds: string[]): Promise<Exercise[]> {
    return apiClient.patch<Exercise[]>(
      `/training-sheet/days/${day}/exercises/reorder`,
      { orderedIds },
    );
  },

  deleteExercise(day: DayOfWeek, id: string): Promise<void> {
    return apiClient.delete<void>(
      `/training-sheet/days/${day}/exercises/${id}`,
    );
  },
};
