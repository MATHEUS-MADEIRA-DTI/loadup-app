"use client";

import MuscleChip from "@/components/MuscleChip";
import { strings } from "@/constants/strings";
import { CalendarDay, MuscleGroup, TrainingDay } from "@/types";

import { DAY_FULL, formatHistoryDate } from "../../utils";

import {
  StyledHistoryBadge,
  StyledHistoryCard,
  StyledHistoryDate,
  StyledHistoryDayName,
  StyledHistoryExCount,
  StyledHistoryIcon,
  StyledHistoryInfo,
  StyledHistoryMuscles,
  StyledHistoryTopRow,
} from "./styles";

interface HistorySessionItemProps {
  day: CalendarDay;
  sheetDay: TrainingDay | undefined;
  onClick: () => void;
}

export default function HistorySessionItem({
  day,
  sheetDay,
  onClick,
}: HistorySessionItemProps) {
  const status = day.sessionStatus;
  const statusLabel =
    status === "recorded"
      ? strings.workout.statusRecorded
      : status === "skipped"
        ? strings.workout.statusSkipped
        : status === "pending"
          ? "Parcial"
          : strings.workout.statusPending;
  const uniqueMuscles = sheetDay
    ? Array.from(new Set(sheetDay.exercises.map((ex) => ex.muscleGroup))).slice(
        0,
        3,
      )
    : [];

  return (
    <StyledHistoryCard onClick={onClick}>
      <StyledHistoryIcon $status={status}>
        {status === "recorded" ? (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
          </svg>
        ) : status === "skipped" ? (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" />
          </svg>
        ) : status === "pending" ? (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
          </svg>
        ) : (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
          </svg>
        )}
      </StyledHistoryIcon>
      <StyledHistoryInfo>
        <StyledHistoryTopRow>
          <StyledHistoryDayName>{DAY_FULL[day.dayOfWeek]}</StyledHistoryDayName>
          <StyledHistoryBadge $status={status}>
            {statusLabel}
          </StyledHistoryBadge>
        </StyledHistoryTopRow>
        <StyledHistoryDate>{formatHistoryDate(day.date)}</StyledHistoryDate>
        {uniqueMuscles.length > 0 && (
          <StyledHistoryMuscles>
            {uniqueMuscles.map((mg) => (
              <MuscleChip key={mg} muscleGroup={mg as MuscleGroup} />
            ))}
          </StyledHistoryMuscles>
        )}
        {day.exerciseCount !== undefined && (
          <StyledHistoryExCount>
            {strings.workout.exerciseCount(day.exerciseCount)}
          </StyledHistoryExCount>
        )}
      </StyledHistoryInfo>
    </StyledHistoryCard>
  );
}
