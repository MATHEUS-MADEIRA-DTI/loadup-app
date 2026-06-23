"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { sessionService } from "@/services/sessionService";
import {
  AddRecordPayload,
  CompleteSessionPayload,
  UpdateRecordPayload,
} from "@/types";

const TODAY_KEY = ["training-sessions", "today"] as const;

export function useTodaySession() {
  return useQuery({
    queryKey: TODAY_KEY,
    queryFn: () => sessionService.getTodaySession(),
  });
}

export function useCreateSession() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (date: string) => sessionService.createSession(date),
    onSuccess: () => qc.invalidateQueries({ queryKey: TODAY_KEY }),
  });
}

export function useAddRecord(sessionId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: AddRecordPayload) =>
      sessionService.addRecord(sessionId, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: TODAY_KEY }),
  });
}

export function useUpdateRecord(sessionId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      recordId,
      payload,
    }: {
      recordId: string;
      payload: UpdateRecordPayload;
    }) => sessionService.updateRecord(sessionId, recordId, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: TODAY_KEY }),
  });
}

export function useDeleteRecord(sessionId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (recordId: string) =>
      sessionService.deleteRecord(sessionId, recordId),
    onSuccess: () => qc.invalidateQueries({ queryKey: TODAY_KEY }),
  });
}

export function useCompleteSession(sessionId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CompleteSessionPayload) =>
      sessionService.completeSession(sessionId, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: TODAY_KEY }),
  });
}
