"use client";

import { useQuery } from "@tanstack/react-query";

import { progressionService } from "@/services/progressionService";

export function useProgressionSummary() {
  return useQuery({
    queryKey: ["progression", "summary"],
    queryFn: () => progressionService.getSummary(),
  });
}

export function useProgressionChart(exerciseName: string) {
  return useQuery({
    queryKey: ["progression", "chart", exerciseName],
    queryFn: () => progressionService.getChart(exerciseName),
    enabled: exerciseName.trim().length > 0,
  });
}
