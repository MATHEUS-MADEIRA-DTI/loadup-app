"use client";

import { useQuery, UseQueryResult } from "@tanstack/react-query";

import { apiClient } from "@/lib/apiClient";
import { SearchResult } from "@/types";
import { MuscleGroup } from "@/types/trainingSheet";

interface ExerciseAPIResponse {
  name: string;
  muscleGroup: string;
  videoUrl: string;
  tip?: string;
}

export async function getExercisesFromAPI(
  name?: string,
  muscle?: string,
): Promise<SearchResult[]> {
  if (!name && !muscle) {
    return [];
  }

  const params = new URLSearchParams();
  if (name && name.length >= 2) {
    params.append("name", name);
  }
  if (muscle && muscle !== "Todos") {
    params.append("muscle", muscle);
  }

  const queryString = params.toString();
  if (!queryString) {
    return [];
  }

  interface APIResponse {
    results: ExerciseAPIResponse[];
    cached: boolean;
    warning: string | null;
  }

  const response = await apiClient.get<APIResponse>(
    `/exercises/search?${queryString}`,
  );

  return response.results.map((item) => ({
    name: item.name,
    muscleGroup: item.muscleGroup as MuscleGroup,
    videoUrl: item.videoUrl,
    tip: item.tip,
  }));
}

export function useExerciseSearchQuery(
  name?: string,
  muscle?: string,
): UseQueryResult<SearchResult[], Error> {
  return useQuery({
    queryKey: ["exerciseSearch", name, muscle],
    queryFn: async () => {
      return getExercisesFromAPI(name, muscle);
    },
    enabled: !!((name && name.length >= 2) || (muscle && muscle !== "Todos")),
    staleTime: 5 * 60 * 1000,
  });
}
