"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { exerciseService } from "@/services/exerciseService";
import {
  CreateExercisePayload,
  DayOfWeek,
  UpdateExercisePayload,
} from "@/types";

const sheetKey = ["training-sheet"] as const;
const dayKey = (day: DayOfWeek) =>
  ["training-sheet", "day", day, "exercises"] as const;

export function useExercises(day: DayOfWeek) {
  return useQuery({
    queryKey: dayKey(day),
    queryFn: () => exerciseService.getExercises(day),
  });
}

export function useAddExercise(day: DayOfWeek) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateExercisePayload) =>
      exerciseService.addExercise(day, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: sheetKey });
      qc.invalidateQueries({ queryKey: dayKey(day) });
    },
  });
}

export function useUpdateExercise(day: DayOfWeek) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateExercisePayload;
    }) => exerciseService.updateExercise(day, id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: sheetKey });
      qc.invalidateQueries({ queryKey: dayKey(day) });
    },
  });
}

export function useDeleteExercise(day: DayOfWeek) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => exerciseService.deleteExercise(day, id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: sheetKey });
      qc.invalidateQueries({ queryKey: dayKey(day) });
    },
  });
}

export function useReorderExercises(day: DayOfWeek) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (orderedIds: string[]) =>
      exerciseService.reorderExercises(day, orderedIds),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: sheetKey });
      qc.invalidateQueries({ queryKey: dayKey(day) });
    },
  });
}
