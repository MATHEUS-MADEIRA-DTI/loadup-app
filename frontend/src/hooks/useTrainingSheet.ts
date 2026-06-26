"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  trainingSheetService,
  SnapshotSummary,
} from "@/services/trainingSheetService";
import { DayOfWeek, DayType } from "@/types";

const SHEET_KEY = ["training-sheet"] as const;

export function useTrainingSheet() {
  return useQuery({
    queryKey: SHEET_KEY,
    queryFn: () => trainingSheetService.getTrainingSheet(),
  });
}

export function useCreateTrainingSheet() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => trainingSheetService.createTrainingSheet(),
    onSuccess: () => qc.invalidateQueries({ queryKey: SHEET_KEY }),
  });
}

export function useUpdateDay() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ day, status }: { day: DayOfWeek; status: DayType }) =>
      trainingSheetService.updateDay(day, status),
    onSuccess: () => qc.invalidateQueries({ queryKey: SHEET_KEY }),
  });
}

export function useSwapDays() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ dayA, dayB }: { dayA: DayOfWeek; dayB: DayOfWeek }) =>
      trainingSheetService.swapDays(dayA, dayB),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: SHEET_KEY });
    },
  });
}

export function useFriendSheet(userId: string) {
  return useQuery({
    queryKey: ["training-sheet", "friend", userId],
    queryFn: () => trainingSheetService.getFriendSheet(userId),
    enabled: !!userId,
  });
}

export function useCopyDay() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      sourceUserId: string;
      sourceDayOfWeek: string;
      targetDayOfWeek: string;
    }) => trainingSheetService.copyDay(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: SHEET_KEY });
      qc.invalidateQueries({ queryKey: ["snapshots"] });
    },
  });
}

export function useSaveSnapshot() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (label?: string) => trainingSheetService.saveSnapshot(label),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["snapshots"] });
    },
  });
}

export function useSnapshots(muscleGroup?: string) {
  return useQuery({
    queryKey: ["snapshots", muscleGroup ?? "all"],
    queryFn: () => trainingSheetService.getSnapshots(muscleGroup),
  });
}

export function useRestoreSnapshot() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (snapshotId: string) =>
      trainingSheetService.restoreSnapshot(snapshotId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: SHEET_KEY });
      qc.invalidateQueries({ queryKey: ["snapshots"] });
    },
  });
}
