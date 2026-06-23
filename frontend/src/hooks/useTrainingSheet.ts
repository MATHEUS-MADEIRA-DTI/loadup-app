"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { trainingSheetService } from "@/services/trainingSheetService";
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
