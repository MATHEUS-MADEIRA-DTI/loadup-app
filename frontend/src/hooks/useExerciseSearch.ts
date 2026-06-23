"use client";

import { useEffect, useState } from "react";

import { MuscleGroup, SearchResult } from "@/types";
import { useExerciseSearchQuery } from "@/services/exerciseSearchService";

export interface UseExerciseSearchState {
  results: SearchResult[];
  isLoading: boolean;
  error: Error | null;
  query: string;
  muscleGroup: "Todos" | MuscleGroup;
  setQuery: (q: string) => void;
  setMuscleGroup: (m: "Todos" | MuscleGroup) => void;
  retry: () => void;
}

export function useExerciseSearch(): UseExerciseSearchState {
  const [query, setQuery] = useState<string>("");
  const [muscleGroup, setMuscleGroup] = useState<"Todos" | MuscleGroup>(
    "Todos",
  );
  const [debouncedQuery, setDebouncedQuery] = useState<string>("");

  // Debounce: 300ms after user stops typing (name input only)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Parameter building — muscle filter changes apply immediately via muscleGroup state
  const getApiParams = (): { name?: string; muscle?: string } => {
    if (debouncedQuery.length < 2 && muscleGroup === "Todos") {
      return {};
    }
    if (debouncedQuery.length < 2 && muscleGroup !== "Todos") {
      return { muscle: muscleGroup };
    }
    if (debouncedQuery.length >= 2 && muscleGroup === "Todos") {
      return { name: debouncedQuery };
    }
    return { name: debouncedQuery, muscle: muscleGroup };
  };

  const params = getApiParams();
  const {
    data = [],
    isLoading,
    error,
    refetch,
  } = useExerciseSearchQuery(params.name, params.muscle);

  return {
    results: data,
    isLoading,
    error: error ?? null,
    query,
    muscleGroup,
    setQuery,
    setMuscleGroup,
    retry: () => void refetch(),
  };
}
