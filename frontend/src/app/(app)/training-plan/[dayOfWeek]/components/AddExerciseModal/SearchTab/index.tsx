"use client";

import { useState } from "react";

import { SearchResult, MuscleGroup } from "@/types";
import { strings, MUSCLE_GROUPS } from "@/constants/strings";
import { useExerciseSearch } from "@/hooks/useExerciseSearch";
import { ExerciseSearchResult } from "../ExerciseSearchResult";
import { SearchSkeleton } from "../SearchSkeleton";
import {
  SearchContainer,
  SearchBarWrapper,
  SearchInput,
  ChipsContainer,
  FilterChip,
  ResultsContainer,
  StateMessage,
  ErrorSection,
  RetryButton,
} from "./styles";

interface SearchTabProps {
  onExerciseSelect: (result: SearchResult) => void;
}

export function SearchTab({ onExerciseSelect }: SearchTabProps) {
  const [selectedMuscle, setSelectedMuscle] = useState<"Todos" | MuscleGroup>(
    "Todos",
  );
  const { results, isLoading, error, setQuery, setMuscleGroup, retry } =
    useExerciseSearch();

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleFilterChange = (muscle: "Todos" | MuscleGroup) => {
    setSelectedMuscle(muscle);
    setMuscleGroup(muscle);
  };

  const hasResults = results.length > 0;
  const isSearchEmpty = !results && !isLoading && !error;

  return (
    <SearchContainer>
      <SearchBarWrapper>
        <SearchInput
          type="text"
          placeholder={strings.exerciseSearch.placeholder}
          onChange={handleSearch}
          aria-label="Search exercises"
        />
      </SearchBarWrapper>

      <ChipsContainer>
        {MUSCLE_GROUPS.map((muscle) => (
          <FilterChip
            key={muscle}
            onClick={() => handleFilterChange(muscle)}
            $isActive={muscle === selectedMuscle}
          >
            {muscle}
          </FilterChip>
        ))}
      </ChipsContainer>

      <ResultsContainer>
        {isLoading && <SearchSkeleton count={3} />}

        {!isLoading && isSearchEmpty && (
          <StateMessage>{strings.exerciseSearch.initialState}</StateMessage>
        )}

        {!isLoading && !hasResults && !isSearchEmpty && !error && (
          <StateMessage>{strings.exerciseSearch.noResults}</StateMessage>
        )}

        {error && (
          <ErrorSection>
            <StateMessage>{strings.exerciseSearch.error}</StateMessage>
            <RetryButton onClick={retry}>
              {strings.exerciseSearch.retry}
            </RetryButton>
          </ErrorSection>
        )}

        {hasResults && !isLoading && (
          <>
            {results.map((result, index) => (
              <ExerciseSearchResult
                key={`${result.name}-${index}`}
                result={result}
                onSelect={onExerciseSelect}
              />
            ))}
          </>
        )}
      </ResultsContainer>
    </SearchContainer>
  );
}
