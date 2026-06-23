"use client";

import { strings } from "@/constants/strings";
import { TrainingDay } from "@/types";

import { DAY_FULL, DAY_SHORT } from "../../utils";

import {
  StyledDayAbbr,
  StyledDayCard,
  StyledDayExCount,
  StyledDayInfo,
  StyledDayMeta,
  StyledDayMuscleText,
  StyledDayName,
  StyledDaySelectIndicator,
} from "./styles";

interface DaySelectCardProps {
  day: TrainingDay;
  isSelected: boolean;
  onClick: () => void;
}

export default function DaySelectCard({
  day,
  isSelected,
  onClick,
}: DaySelectCardProps) {
  const uniqueMuscles = Array.from(
    new Set(day.exercises.map((ex) => ex.muscleGroup)),
  );

  return (
    <StyledDayCard onClick={onClick} $selected={isSelected}>
      <StyledDayAbbr $selected={isSelected}>
        {DAY_SHORT[day.dayOfWeek]}
      </StyledDayAbbr>
      <StyledDayInfo>
        <StyledDayName>{DAY_FULL[day.dayOfWeek]}</StyledDayName>
        <StyledDayMeta>
          <StyledDayMuscleText>{uniqueMuscles.join(" · ")}</StyledDayMuscleText>
          <StyledDayExCount>
            · {strings.workout.exerciseCount(day.exercises.length)}
          </StyledDayExCount>
        </StyledDayMeta>
      </StyledDayInfo>
      <StyledDaySelectIndicator $selected={isSelected}>
        {isSelected && (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
          </svg>
        )}
      </StyledDaySelectIndicator>
    </StyledDayCard>
  );
}
