"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { sessionService } from "@/services/sessionService";
import {
  AddRecordPayload,
  CompleteSessionPayload,
  LoggedSet,
  TrainingSession,
  UpdateRecordPayload,
} from "@/types";

const TODAY_KEY = ["training-sessions", "today"] as const;

export function useTodaySession() {
  return useQuery({
    queryKey: TODAY_KEY,
    queryFn: () => sessionService.getTodaySession(),
  });
}

/**
 * Leitura passiva do cache da sessão de hoje — não dispara fetch/criação
 * própria (`enabled: false`), só reage a atualizações feitas por outros
 * lugares que já chamam `useTodaySession()`. Para uso em componentes globais
 * (ex.: widgets de layout) que não devem, por si só, criar uma sessão do dia.
 */
export function useTodaySessionCache() {
  return useQuery({
    queryKey: TODAY_KEY,
    queryFn: () => sessionService.getTodaySession(),
    enabled: false,
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
    onMutate: async (payload) => {
      await qc.cancelQueries({ queryKey: TODAY_KEY });
      const prev = qc.getQueryData<TrainingSession>(TODAY_KEY);
      if (prev) {
        const optimisticRecord: LoggedSet = {
          _id: `optimistic-${Date.now()}`,
          exerciseName: payload.exerciseName,
          seriesType: payload.seriesType,
          seriesOrder: payload.seriesOrder,
          weight: payload.weight,
          repsCompleted: payload.repsCompleted,
          restTime: payload.restTime,
        };
        qc.setQueryData<TrainingSession>(TODAY_KEY, {
          ...prev,
          records: [...(prev.records ?? []), optimisticRecord],
        });
      }
      return { prev };
    },
    onError: (_err, _payload, context) => {
      if (context?.prev) {
        qc.setQueryData(TODAY_KEY, context.prev);
      }
    },
    onSuccess: (data) => {
      qc.setQueryData(TODAY_KEY, data.session);
    },
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
    onSuccess: (data) => {
      qc.setQueryData(TODAY_KEY, data);
    },
  });
}

export function useDeleteRecord(sessionId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (recordId: string) =>
      sessionService.deleteRecord(sessionId, recordId),
    onSuccess: (data) => {
      qc.setQueryData(TODAY_KEY, data);
    },
  });
}

export function useCompleteSession(sessionId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CompleteSessionPayload) =>
      sessionService.completeSession(sessionId, payload),
    onSuccess: (data) => {
      qc.setQueryData(TODAY_KEY, data.session);
    },
  });
}

export function useStartSession(sessionId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => sessionService.startSession(sessionId),
    onSuccess: (data) => {
      qc.setQueryData(TODAY_KEY, data);
    },
  });
}

export function usePauseSession(sessionId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => sessionService.pauseSession(sessionId),
    onSuccess: (data) => {
      qc.setQueryData(TODAY_KEY, data);
    },
  });
}
