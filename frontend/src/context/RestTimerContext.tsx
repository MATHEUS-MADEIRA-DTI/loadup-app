"use client";

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export interface NextExercisePreview {
  name: string;
  muscleGroup: string;
  isNewExercise: boolean;
  seriesTypeLabel: string;
  lastWeight: number | null;
  repsMin: number | null;
  repsMax: number | null;
}

interface RestTimerContextValue {
  isActive: boolean;
  timeLeft: number;
  restDuration: number;
  nextExercise: NextExercisePreview | null;
  startRestTimer: (duration: number, next: NextExercisePreview | null) => void;
  stopRestTimer: () => void;
}

const RestTimerContext = createContext<RestTimerContextValue | null>(null);

export function RestTimerProvider({ children }: { children: ReactNode }) {
  const [isActive, setIsActive] = useState(false);
  const [targetTime, setTargetTime] = useState<number | null>(null);
  const [restDuration, setRestDuration] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [nextExercise, setNextExercise] = useState<NextExercisePreview | null>(null);

  useEffect(() => {
    if (!isActive || !targetTime) return;

    const interval = setInterval(() => {
      const remaining = Math.round((targetTime - Date.now()) / 1000);
      const clamped = Math.max(0, remaining);
      setTimeLeft(clamped);

      if (remaining <= 0) {
        clearInterval(interval);
        setIsActive(false);
        setTargetTime(null);
        // Notifica todos os listeners (overlay ou widget) que o timer acabou
        window.dispatchEvent(new CustomEvent("rest-timer-end"));
      }
    }, 500);

    return () => clearInterval(interval);
  }, [isActive, targetTime]);

  const startRestTimer = useCallback(
    (duration: number, next: NextExercisePreview | null) => {
      setRestDuration(duration);
      setTimeLeft(duration);
      setTargetTime(Date.now() + duration * 1000);
      setNextExercise(next);
      setIsActive(true);
    },
    [],
  );

  const stopRestTimer = useCallback(() => {
    setIsActive(false);
    setTargetTime(null);
    setTimeLeft(0);
    setNextExercise(null);
  }, []);

  const value = useMemo(
    () => ({ isActive, timeLeft, restDuration, nextExercise, startRestTimer, stopRestTimer }),
    [isActive, timeLeft, restDuration, nextExercise, startRestTimer, stopRestTimer],
  );

  return (
    <RestTimerContext.Provider value={value}>
      {children}
    </RestTimerContext.Provider>
  );
}

export function useRestTimer() {
  const ctx = useContext(RestTimerContext);
  if (!ctx) throw new Error("useRestTimer must be used within a RestTimerProvider");
  return ctx;
}
