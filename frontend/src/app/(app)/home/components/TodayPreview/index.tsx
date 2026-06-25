"use client";

import { strings } from "@/constants/strings";
import { DayOfWeek, Exercise } from "@/types";

import { DAY_FULL_LABELS } from "../../utils";

import {
  StyledPreviewBullet,
  StyledPreviewDayLabel,
  StyledPreviewDayRow,
  StyledPreviewExName,
  StyledPreviewExSeries,
  StyledPreviewFooter,
  StyledPreviewItem,
  StyledPreviewList,
  StyledPreviewOverflow,
  StyledPreviewStartBtn,
  StyledPreviewTitle,
  StyledPreviewWrapper,
} from "./styles";

interface TodayPreviewProps {
  dayOfWeek: DayOfWeek;
  exercises: Exercise[];
  isDone: boolean;
  onStart: () => void;
}

export default function TodayPreview({
  dayOfWeek,
  exercises,
  isDone,
  onStart,
}: TodayPreviewProps) {
  const MAX_VISIBLE = 3;
  const visible = exercises.slice(0, MAX_VISIBLE);
  const overflow = exercises.length - MAX_VISIBLE;
  const muscles = Array.from(
    new Set(exercises.map((ex) => ex.muscleGroup)),
  ).join(" + ");
  const totalSeries = exercises.reduce((acc, ex) => acc + ex.series.length, 0);

  return (
    <StyledPreviewWrapper>
      <StyledPreviewDayRow>
        <svg
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill="currentColor"
          opacity="0.55"
        >
          <path d="M20.57 14.86L22 13.43 20.57 12 17 15.57 8.43 7 12 3.43 10.57 2 9.14 3.43 7.71 2 5.57 4.14 4.14 2.71 2.71 4.14l1.43 1.43L2 7.71l1.43 1.43L2 10.57 3.43 12 7 8.43 15.57 17 12 20.57 13.43 22l1.43-1.43L16.29 22l2.14-2.14 1.43 1.43 1.43-1.43-1.43-1.43L22 16.29l-1.43-1.43z" />
        </svg>
        <StyledPreviewDayLabel>
          {DAY_FULL_LABELS[dayOfWeek]}
        </StyledPreviewDayLabel>
      </StyledPreviewDayRow>

      <StyledPreviewTitle>{muscles}</StyledPreviewTitle>

      <StyledPreviewList>
        {visible.map((ex) => (
          <StyledPreviewItem key={ex._id}>
            <StyledPreviewBullet />
            <StyledPreviewExName>{ex.name}</StyledPreviewExName>
            <StyledPreviewExSeries>
              {strings.home.seriesCount(ex.series.length)}
            </StyledPreviewExSeries>
          </StyledPreviewItem>
        ))}
        {overflow > 0 && (
          <StyledPreviewOverflow>
            {strings.home.moreExercises(overflow)}
          </StyledPreviewOverflow>
        )}
      </StyledPreviewList>

      <StyledPreviewFooter>
        {!isDone && (
          <StyledPreviewStartBtn onClick={onStart}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
            {strings.home.startWorkoutShort}
          </StyledPreviewStartBtn>
        )}
      </StyledPreviewFooter>
    </StyledPreviewWrapper>
  );
}
