"use client";

import { SearchResult } from "@/types";
import MuscleChip from "@/components/MuscleChip";
import { ResultCard, TextContent, ExerciseTitle, ChipWrapper } from "./styles";

interface ExerciseSearchResultProps {
  result: SearchResult;
  onSelect: (result: SearchResult) => void;
}

export function ExerciseSearchResult({
  result,
  onSelect,
}: ExerciseSearchResultProps) {
  return (
    <ResultCard
      onClick={() => onSelect(result)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onSelect(result)}
    >
      <TextContent>
        <ExerciseTitle>{result.name}</ExerciseTitle>
      </TextContent>
      <ChipWrapper>
        <MuscleChip muscleGroup={result.muscleGroup} />
      </ChipWrapper>
    </ResultCard>
  );
}
