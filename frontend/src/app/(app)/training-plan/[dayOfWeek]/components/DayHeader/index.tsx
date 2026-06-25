"use client";

import MuscleChip from "@/components/MuscleChip";
import { strings } from "@/constants/strings";
import { MuscleGroup } from "@/types";

import {
  StyledBreadcrumb,
  StyledHeader,
  StyledMuscleRow,
  StyledTitle,
  StyledTopRow,
} from "./styles";

interface DayHeaderProps {
  dayLabel: string;
  uniqueMuscles: MuscleGroup[];
  onBack: () => void;
}

export default function DayHeader({
  dayLabel,
  uniqueMuscles,
  onBack,
}: DayHeaderProps) {
  return (
    <StyledHeader>
      <StyledTopRow>
        <StyledBreadcrumb
          onClick={onBack}
          aria-label={strings.common.ariaGoBack}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
          </svg>
        </StyledBreadcrumb>
      </StyledTopRow>
      <StyledTitle>{dayLabel}</StyledTitle>
      {uniqueMuscles.length > 0 && (
        <StyledMuscleRow>
          {uniqueMuscles.map((mg) => (
            <MuscleChip key={mg} muscleGroup={mg} />
          ))}
        </StyledMuscleRow>
      )}
    </StyledHeader>
  );
}
