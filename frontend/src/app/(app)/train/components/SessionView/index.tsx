"use client";

import React, { useEffect, useMemo, useState } from "react";
import { CheckCircle2, MinusCircle } from "lucide-react";

import MuscleChip from "@/components/MuscleChip";
import { strings } from "@/constants/strings";
import {
  useCompleteSession,
  useCreateSession,
  useTodaySession,
} from "@/hooks/useSession";
import { DayOfWeek, TrainingDay } from "@/types";

import { DAY_FULL, todayIso } from "../../utils";
import RestTimerButton from "../RestTimerButton";
import SeriesInputRow from "../SeriesInputRow";

import {
  StyledBackBtn,
  StyledConcludeBtn,
  StyledDoneBanner,
  StyledDoneBannerIcon,
  StyledDoneBannerSub,
  StyledDoneBannerText,
  StyledEmptyText,
  StyledExerciseHeader,
  StyledExerciseInfo,
  StyledExerciseName,
  StyledExerciseNum,
  StyledExerciseSection,
  StyledExerciseSkeleton,
  StyledProgressBarFill,
  StyledProgressBarTrack,
  StyledProgressCounter,
  StyledReadOnlyNotice,
  StyledSeriesList,
  StyledSessionBody,
  StyledSessionBottomBar,
  StyledSessionDayName,
  StyledSessionHeader,
  StyledSessionPage,
  StyledSessionStatusText,
  StyledSessionTopRow,
  StyledSkipBtn,
} from "./styles";

interface SessionViewProps {
  dayOfWeek: DayOfWeek;
  sheetDay: TrainingDay | undefined;
  onBack: () => void;
}

export default function SessionView({
  dayOfWeek,
  sheetDay,
  onBack,
}: SessionViewProps) {
  const session = useTodaySession();
  const createSession = useCreateSession();
  const [createAttempted, setCreateAttempted] = useState(false);

  useEffect(() => {
    if (session.isError && !createAttempted) {
      setCreateAttempted(true);
      createSession.mutate(todayIso());
    }
  }, [session.isError, createAttempted, createSession]);

  const sessionData = session.data;
  const exercises = sheetDay?.exercises ?? [];
  const totalSeries = exercises.reduce((acc, ex) => acc + ex.series.length, 0);

  const loggedCount = useMemo(() => {
    if (!sessionData) return 0;
    return exercises.reduce(
      (acc, ex) =>
        acc +
        ex.series.filter((_, i) =>
          sessionData.records?.some(
            (s) => s.exerciseName === ex.name && s.seriesOrder === i + 1,
          ),
        ).length,
      0,
    );
  }, [sessionData, exercises]);

  const progress =
    totalSeries > 0 ? Math.round((loggedCount / totalSeries) * 100) : 0;
  const isReadOnly =
    sessionData?.status === "completed" || sessionData?.status === "skipped";
  const completeSession = useCompleteSession(sessionData?._id ?? "");
  const isLoading =
    session.isLoading ||
    (session.isError && !createAttempted) ||
    createSession.isPending;

  return (
    <StyledSessionPage>
      <StyledSessionHeader>
        <StyledSessionTopRow>
          <StyledBackBtn onClick={onBack}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
            </svg>
          </StyledBackBtn>
          <StyledSessionStatusText>
            {isReadOnly
              ? sessionData?.status === "completed"
                ? strings.workout.completedTitle
                : strings.workout.skippedTitle
              : strings.workout.inProgress}
          </StyledSessionStatusText>
          <StyledProgressCounter>
            {strings.workout.progressCounter(loggedCount, totalSeries)}
          </StyledProgressCounter>
        </StyledSessionTopRow>
        <StyledSessionDayName>{DAY_FULL[dayOfWeek]}</StyledSessionDayName>
        <StyledProgressBarTrack>
          <StyledProgressBarFill $pct={progress} />
        </StyledProgressBarTrack>
      </StyledSessionHeader>

      {isLoading ? (
        <StyledSessionBody>
          {Array.from({ length: 2 }).map((_, i) => (
            <StyledExerciseSkeleton key={i} />
          ))}
        </StyledSessionBody>
      ) : !sessionData ? (
        <StyledSessionBody>
          <StyledEmptyText>{strings.common.error}</StyledEmptyText>
        </StyledSessionBody>
      ) : (
        <>
          {isReadOnly && (
            <StyledDoneBanner $skipped={sessionData?.status === "skipped"}>
              <StyledDoneBannerIcon>
                {sessionData?.status === "completed" ? (
                  <CheckCircle2 size={24} strokeWidth={2} />
                ) : (
                  <MinusCircle size={24} strokeWidth={2} />
                )}
              </StyledDoneBannerIcon>
              <StyledDoneBannerText>
                {sessionData?.status === "completed"
                  ? strings.workout.completedTitle
                  : strings.workout.skippedTitle}
              </StyledDoneBannerText>
              <StyledDoneBannerSub>
                {strings.workout.readOnlyNotice}
              </StyledDoneBannerSub>
            </StyledDoneBanner>
          )}
          <StyledSessionBody>
            {exercises.map((exercise, exIndex) => (
              <StyledExerciseSection key={exercise._id}>
                <StyledExerciseHeader>
                  <StyledExerciseNum>{exIndex + 1}</StyledExerciseNum>
                  <StyledExerciseInfo>
                    <StyledExerciseName>{exercise.name}</StyledExerciseName>
                    <MuscleChip muscleGroup={exercise.muscleGroup} />
                  </StyledExerciseInfo>
                </StyledExerciseHeader>
                <StyledSeriesList>
                  {exercise.series.map((s, sIndex) => {
                    const loggedSet = sessionData.records?.find(
                      (ls) =>
                        ls.exerciseName === exercise.name &&
                        ls.seriesOrder === sIndex + 1,
                    );
                    return (
                      <React.Fragment key={sIndex}>
                        <SeriesInputRow
                          exercise={exercise}
                          series={s}
                          seriesIndex={sIndex}
                          sessionId={sessionData._id}
                          loggedSet={loggedSet}
                          isReadOnly={isReadOnly}
                        />
                        {!isReadOnly && s.restTime && s.restTime > 0 && (
                          <RestTimerButton
                            restTime={s.restTime}
                            exerciseName={exercise.name}
                          />
                        )}
                      </React.Fragment>
                    );
                  })}
                </StyledSeriesList>
              </StyledExerciseSection>
            ))}
            {isReadOnly && (
              <StyledReadOnlyNotice>
                {strings.workout.readOnlyNotice}
              </StyledReadOnlyNotice>
            )}
          </StyledSessionBody>

          {!isReadOnly && (
            <StyledSessionBottomBar>
              <StyledSkipBtn
                onClick={() => completeSession.mutate({ status: "skipped" })}
                disabled={completeSession.isPending}
              >
                {strings.workout.skipBtn}
              </StyledSkipBtn>
              <StyledConcludeBtn
                onClick={() => completeSession.mutate({ status: "completed" })}
                disabled={completeSession.isPending}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                </svg>
                {strings.workout.concludeBtn(loggedCount, totalSeries)}
              </StyledConcludeBtn>
            </StyledSessionBottomBar>
          )}
        </>
      )}
    </StyledSessionPage>
  );
}
