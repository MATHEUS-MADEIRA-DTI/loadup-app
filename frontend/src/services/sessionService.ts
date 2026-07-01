import { apiClient } from "@/lib/apiClient";
import {
  AddRecordPayload,
  AddRecordResponse,
  CompleteSessionPayload,
  CompleteSessionResponse,
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
  ): Promise<AddRecordResponse> {
    return apiClient.post<AddRecordResponse>(
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
  ): Promise<CompleteSessionResponse> {
    return apiClient.patch<CompleteSessionResponse>(
      `/training-sessions/${sessionId}/complete`,
      payload,
    );
  },

  startSession(sessionId: string): Promise<TrainingSession> {
    return apiClient.patch<TrainingSession>(
      `/training-sessions/${sessionId}/start`,
      {},
    );
  },

  pauseSession(sessionId: string): Promise<TrainingSession> {
    return apiClient.patch<TrainingSession>(
      `/training-sessions/${sessionId}/pause`,
      {},
    );
  },
};
