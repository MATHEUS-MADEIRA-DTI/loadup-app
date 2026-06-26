"use client";

import { GripVertical } from "lucide-react";
import MuscleChip from "@/components/MuscleChip";
import { strings } from "@/constants/strings";
import { DayOfWeek, DayType, MuscleGroup, TrainingDay } from "@/types";
import { DAY_LABEL, DAY_SHORT } from "../../utils";
import {
  StyledAbbrCol,
  StyledAbbrPill,
  StyledCardRow,
  StyledChevronBtn,
  StyledChipsRow,
  StyledContent,
  StyledControls,
  StyledDayCard,
  StyledDayName,
  StyledDragHandle,
  StyledMeta,
  StyledNameRow,
  StyledToggle,
  StyledToggleThumb,
  StyledTodayBadge,
  StyledTodayLabel,
  StyledTypeBadge,
} from "./styles";

interface DayCardProps {
  day: TrainingDay;
  isToday: boolean;
  onNavigate: (day: DayOfWeek) => void;
  onToggle: (day: DayOfWeek, currentStatus: DayType) => void;
  isUpdating: boolean;
  dragHandleProps?: Record<string, unknown>;
  isDragging?: boolean;
}

export default function DayCard({
  day,
  isToday,
  onNavigate,
  onToggle,
  isUpdating,
  dragHandleProps,
  isDragging,
}: DayCardProps) {
  const isTraining = day.status === "training";
  const count = day.exercises.length;
  const totalSeries = day.exercises.reduce(
    (acc, ex) => acc + ex.series.length,
    0,
  );
  const uniqueMuscles = Array.from(
    new Set(day.exercises.map((ex) => ex.muscleGroup)),
  ) as MuscleGroup[];

  return (
    <StyledDayCard
      $isToday={isToday}
      $isRest={!isTraining}
      $isDragging={isDragging}
    >
      <StyledCardRow>
        <StyledDragHandle {...dragHandleProps}>
          <GripVertical size={16} />
        </StyledDragHandle>

        <StyledAbbrCol>
          <StyledAbbrPill $isToday={isToday}>
            {DAY_SHORT[day.dayOfWeek]}
          </StyledAbbrPill>
          {isToday && (
            <StyledTodayLabel>
              {strings.trainingPlan.todayLabel}
            </StyledTodayLabel>
          )}
        </StyledAbbrCol>

        <StyledContent>
          <StyledNameRow>
            <StyledDayName>{DAY_LABEL[day.dayOfWeek]}</StyledDayName>
            {isToday && (
              <StyledTodayBadge>
                {strings.trainingPlan.todayBadge}
              </StyledTodayBadge>
            )}
          </StyledNameRow>
          {isTraining && uniqueMuscles.length > 0 && (
            <StyledChipsRow>
              {uniqueMuscles.map((mg) => (
                <MuscleChip key={mg} muscleGroup={mg} />
              ))}
            </StyledChipsRow>
          )}
          <StyledMeta>
            {isTraining
              ? count > 0
                ? strings.trainingPlan.dayMetaCount(count, totalSeries)
                : strings.trainingPlan.noExercisesDay
              : strings.trainingPlan.dayRest}
          </StyledMeta>
        </StyledContent>

        <StyledControls>
          <StyledToggle
            type="button"
            onClick={() => onToggle(day.dayOfWeek, day.status)}
            disabled={isUpdating}
            aria-checked={isTraining}
            aria-label={
              isTraining
                ? strings.trainingPlan.toggleToRest
                : strings.trainingPlan.toggleToTraining
            }
          >
            <StyledToggleThumb $on={isTraining} />
          </StyledToggle>
          <StyledTypeBadge $training={isTraining}>
            {isTraining
              ? strings.trainingPlan.dayTraining
              : strings.trainingPlan.dayRest}
          </StyledTypeBadge>
          {isTraining && (
            <StyledChevronBtn
              onClick={() => onNavigate(day.dayOfWeek)}
              aria-label={strings.common.ariaViewExercises}
              disabled={isUpdating}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z" />
              </svg>
            </StyledChevronBtn>
          )}
        </StyledControls>
      </StyledCardRow>
    </StyledDayCard>
  );
}
