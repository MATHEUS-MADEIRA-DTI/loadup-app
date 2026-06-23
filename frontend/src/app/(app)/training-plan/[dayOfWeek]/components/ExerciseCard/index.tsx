"use client";

import MuscleChip from "@/components/MuscleChip";
import { strings } from "@/constants/strings";
import { Exercise } from "@/types";

import { SERIES_COLOR, SERIES_LABEL } from "../../utils";
import { VideoTipsSection } from "./VideoTipsSection";

import {
  StyledEditBtn,
  StyledExCard,
  StyledExFooter,
  StyledExHeader,
  StyledExMuscle,
  StyledExName,
  StyledExNumCircle,
  StyledSeriesCircle,
  StyledSeriesList,
  StyledSeriesReps,
  StyledSeriesRow,
  StyledSeriesType,
  StyledTrashBtn,
} from "./styles";

interface ExerciseCardProps {
  exercise: Exercise;
  index: number;
  onEdit: () => void;
  onDelete: () => void;
}

export default function ExerciseCard({
  exercise,
  index,
  onEdit,
  onDelete,
}: ExerciseCardProps) {
  const total = exercise.series.length;
  const warmCount = exercise.series.filter((s) => s.type === "warm-up").length;
  const workingCount = exercise.series.filter(
    (s) => s.type === "working",
  ).length;
  const adjustCount = exercise.series.filter(
    (s) => s.type === "adjustment",
  ).length;

  const footerParts: string[] = [
    strings.trainingPlan.seriesFooter.total(total),
  ];
  if (warmCount > 0)
    footerParts.push(strings.trainingPlan.seriesFooter.warmUp(warmCount));
  if (adjustCount > 0)
    footerParts.push(strings.trainingPlan.seriesFooter.adjustment(adjustCount));
  if (workingCount > 0)
    footerParts.push(strings.trainingPlan.seriesFooter.working(workingCount));

  return (
    <StyledExCard>
      <StyledExHeader>
        <StyledExNumCircle>{index + 1}</StyledExNumCircle>
        <StyledExName>{exercise.name}</StyledExName>
        <StyledEditBtn
          onClick={onEdit}
          aria-label={strings.common.ariaEditExercise}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zm17.71-10.21c.39-.39.39-1.02 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
          </svg>
        </StyledEditBtn>
        <StyledTrashBtn
          onClick={onDelete}
          aria-label={strings.common.ariaDeleteExercise}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zm2.46-7.12l1.41-1.41L12 12.59l2.12-2.12 1.41 1.41L13.41 14l2.12 2.12-1.41 1.41L12 15.41l-2.12 2.12-1.41-1.41L10.59 14l-2.13-2.12zM15.5 4l-1-1h-5l-1 1H5v2h14V4z" />
          </svg>
        </StyledTrashBtn>
      </StyledExHeader>

      <StyledExMuscle>
        <MuscleChip muscleGroup={exercise.muscleGroup} />
      </StyledExMuscle>

      <StyledSeriesList>
        {exercise.series.map((s, i) => (
          <StyledSeriesRow key={i} $bg={SERIES_COLOR[s.type].bg}>
            <StyledSeriesCircle $color={SERIES_COLOR[s.type].text}>
              {i + 1}
            </StyledSeriesCircle>
            <StyledSeriesType $color={SERIES_COLOR[s.type].text}>
              {SERIES_LABEL[s.type]}
            </StyledSeriesType>
            <StyledSeriesReps>{s.reps} reps</StyledSeriesReps>
          </StyledSeriesRow>
        ))}
      </StyledSeriesList>

      <StyledExFooter>{footerParts.join(" · ")}</StyledExFooter>

      <VideoTipsSection
        videoUrl={exercise.videoUrl}
        tip={exercise.tip}
        exerciseName={exercise.name}
      />
    </StyledExCard>
  );
}
