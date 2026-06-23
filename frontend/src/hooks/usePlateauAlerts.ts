import { useState, useMemo, useCallback } from "react";
import { useTrainingSheet } from "@/hooks/useTrainingSheet";
import { usePlateauAlertsQuery } from "@/services/plateauService";
import {
  getDismissedFromStorage,
  addToDismissed,
  clearDismissed,
} from "@/lib/alerts";
import type {
  PlateauAlert,
  PlateauAlertWithMuscleGroup,
  MuscleGroup,
} from "@/types";

interface UsePlateauAlertsReturn {
  activeAlerts: PlateauAlertWithMuscleGroup[];
  isLoading: boolean;
  error: Error | null;
  dismiss: (alertId: string) => void;
  dismissAll: () => void;
}

/**
 * Custom hook for managing plateau alerts with dismissal state and muscle group resolution.
 *
 * Features:
 * - Fetches alerts from API via React Query
 * - Manages dismissed alert IDs in state + localStorage
 * - Resolves muscleGroup from training sheet by exercise name
 * - Provides dismiss() and dismissAll() callbacks
 *
 * @returns Object with activeAlerts, loading state, error, and control functions
 */
export function usePlateauAlerts(): UsePlateauAlertsReturn {
  const { data: trainingSheet } = useTrainingSheet();
  const { data: alerts = [], isLoading, error } = usePlateauAlertsQuery();

  // Initialize dismissed IDs from localStorage
  const [dismissedIds, setDismissedIds] = useState<string[]>(() =>
    getDismissedFromStorage(),
  );

  // Extract exercises from training sheet for muscle group resolution
  const exercises = useMemo(
    () => trainingSheet?.days?.flatMap((day) => day.exercises) ?? [],
    [trainingSheet],
  );

  // Create exercise name -> muscle group map for O(1) lookup
  const muscleGroupMap = useMemo(() => {
    const map = new Map<string, MuscleGroup>();
    exercises.forEach((exercise) => {
      map.set(exercise.name, exercise.muscleGroup);
    });
    return map;
  }, [exercises]);

  // Filter dismissed alerts and resolve muscle group
  const activeAlerts = useMemo(() => {
    return alerts
      .filter((alert) => !dismissedIds.includes(alert._id))
      .map((alert) => ({
        ...alert,
        muscleGroup: muscleGroupMap.get(alert.exerciseName),
      })) as PlateauAlertWithMuscleGroup[];
  }, [alerts, dismissedIds, muscleGroupMap]);

  // Dismiss a single alert
  const dismiss = useCallback((alertId: string) => {
    setDismissedIds((prev) => {
      const updated = [...prev, alertId];
      addToDismissed(alertId);
      return updated;
    });
  }, []);

  // Dismiss all alerts
  const dismissAll = useCallback(() => {
    setDismissedIds([]);
    clearDismissed();
  }, []);

  return {
    activeAlerts,
    isLoading,
    error: error || null,
    dismiss,
    dismissAll,
  };
}
