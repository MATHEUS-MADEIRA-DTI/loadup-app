import { apiClient } from "@/lib/apiClient";
import {
  AddRecordPayload,
  CompleteSessionPayload,
  TrainingSession,
  UpdateRecordPayload,
} from "@/types";

export const sessionService = {
  getTodaySession(): Promise<TrainingSession> {
    return apiClient.get<TrainingSession>("/training-sessions/today");
  },

  createSession(date: string): Promise<TrainingSession> {
    return apiClient.post<TrainingSession>("/training-sessions", { date });
  },

  addRecord(
    sessionId: string,
    payload: AddRecordPayload,
  ): Promise<TrainingSession> {
    return apiClient.post<TrainingSession>(
      `/training-sessions/${sessionId}/records`,
      payload,
    );
  },

  updateRecord(
    sessionId: string,
    recordId: string,
    payload: UpdateRecordPayload,
  ): Promise<TrainingSession> {
    return apiClient.patch<TrainingSession>(
      `/training-sessions/${sessionId}/records/${recordId}`,
      payload,
    );
  },

  deleteRecord(sessionId: string, recordId: string): Promise<TrainingSession> {
    return apiClient.delete<TrainingSession>(
      `/training-sessions/${sessionId}/records/${recordId}`,
    );
  },

  completeSession(
    sessionId: string,
    payload: CompleteSessionPayload,
  ): Promise<TrainingSession> {
    return apiClient.patch<TrainingSession>(
      `/training-sessions/${sessionId}/complete`,
      payload,
    );
  },
};
