"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { CheckCircle2, MinusCircle } from "lucide-react";

import { strings } from "@/constants/strings";
import {
  useCompleteSession,
  useCreateSession,
  useTodaySession,
} from "@/hooks/useSession";
import MuscleChip from "@/components/MuscleChip";
import { DayOfWeek, SeriesType, TrainingDay } from "@/types";

import { DAY_FULL, todayIso } from "../../utils";
import RestTimerOverlay from "../RestTimerButton";
import SeriesInputRow, { SeriesInputRowHandle } from "../SeriesInputRow";

import {
  StyledActiveSessionLayout,
  StyledBackBtn,
  StyledConcludeBtn,
  StyledDoneBanner,
  StyledDoneBannerIcon,
  StyledDoneBannerSub,
  StyledDoneBannerText,
  StyledEmptyText,
  StyledErrorToast,
  StyledExerciseFocus,
  StyledExerciseHeader,
  StyledExerciseInfo,
  StyledExerciseMuscleFocus,
  StyledExerciseName,
  StyledExerciseNameFocus,
  StyledExerciseNum,
  StyledExerciseSection,
  StyledExerciseSkeleton,
  StyledProgressBadge,
  StyledSeriesList,
  StyledSeriesProgressDot,
  StyledSeriesProgressDots,
  StyledSeriesTypeBadgeFocus,
  StyledSessionBody,
  StyledSessionBottomBar,
  StyledSessionHeader,
  StyledSessionPage,
  StyledSessionTopRow,
  StyledSkipBtn,
} from "./styles";

interface SessionViewProps {
  dayOfWeek: DayOfWeek;
  sheetDay: TrainingDay | undefined;
  onBack: () => void;
}

const SERIES_TYPE_LABEL: Record<SeriesType, string> = {
  working: "TRABALHO",
  "warm-up": "AQUECIMENTO",
  adjustment: "ADAPTAÇÃO",
};

export default function SessionView({
  dayOfWeek,
  sheetDay,
  onBack,
}: SessionViewProps) {
  const session = useTodaySession();
  const createSession = useCreateSession();
  const [createAttempted, setCreateAttempted] = useState(false);

  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [currentSeriesIndex, setCurrentSeriesIndex] = useState(0);
  const [showRestTimer, setShowRestTimer] = useState(false);
  const [restDuration, setRestDuration] = useState(0);

  const seriesInputRef = useRef<SeriesInputRowHandle>(null);
  const hasInitialized = useRef(false);

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

  const isReadOnly =
    sessionData?.status === "completed" || sessionData?.status === "skipped";
  useEffect(() => {
    if (
      !sessionData ||
      !exercises.length ||
      isReadOnly ||
      hasInitialized.current
    )
      return;

    hasInitialized.current = true;

    for (let exIdx = 0; exIdx < exercises.length; exIdx++) {
      const exercise = exercises[exIdx];
      for (let sIdx = 0; sIdx < exercise.series.length; sIdx++) {
        const isLogged = sessionData.records?.some(
          (r) => r.exerciseName === exercise.name && r.seriesOrder === sIdx + 1,
        );
        if (!isLogged) {
          setCurrentExerciseIndex(exIdx);
          setCurrentSeriesIndex(sIdx);
          return;
        }
      }
    }
  }, [sessionData, exercises, isReadOnly]);
  const completeSession = useCompleteSession(sessionData?._id ?? "");
  const isLoading =
    session.isLoading ||
    (session.isError && !createAttempted) ||
    createSession.isPending;

  const [errorToast, setErrorToast] = useState<string | null>(null);

  const currentExercise = exercises[currentExerciseIndex];
  const currentSeries = currentExercise?.series[currentSeriesIndex];
  const totalSeriesInExercise = currentExercise?.series.length ?? 0;

  const completedSeriesInExercise = useMemo(() => {
    if (!sessionData || !currentExercise) return 0;
    return currentExercise.series.filter((_, i) =>
      sessionData.records?.some(
        (r) =>
          r.exerciseName === currentExercise.name && r.seriesOrder === i + 1,
      ),
    ).length;
  }, [sessionData, currentExercise]);

  const isSeriesLogged = useMemo(() => {
    if (!sessionData || !currentExercise) return false;
    return sessionData.records?.some(
      (r) =>
        r.exerciseName === currentExercise.name &&
        r.seriesOrder === currentSeriesIndex + 1,
    );
  }, [sessionData, currentExercise, currentSeriesIndex]);

  const showError = (msg: string) => {
    setErrorToast(msg);
    setTimeout(() => setErrorToast(null), 3500);
  };

  const handleConclude = useCallback(() => {
    completeSession.mutate(
      { status: "completed" },
      { onError: () => showError("Erro ao concluir treino. Tente novamente.") },
    );
  }, [completeSession]);

  const handleDismissRest = useCallback(() => {
    setShowRestTimer(false);
  }, []);

  const advanceAfterSeries = useCallback(
    (restTime: number) => {
      const exercise = exercises[currentExerciseIndex];
      if (!exercise) return;

      const hasMoreSeries = currentSeriesIndex < exercise.series.length - 1;

      if (hasMoreSeries) {
        setCurrentSeriesIndex((prev) => prev + 1);
        if (restTime > 0) {
          setRestDuration(restTime);
          setShowRestTimer(true);
        }
        return;
      }

      if (currentExerciseIndex < exercises.length - 1) {
        setCurrentExerciseIndex((prev) => prev + 1);
        setCurrentSeriesIndex(0);
        if (restTime > 0) {
          setRestDuration(restTime);
          setShowRestTimer(true);
        }
        return;
      }

      handleConclude();
    },
    [currentExerciseIndex, currentSeriesIndex, exercises, handleConclude],
  );

  const handleSeriesConclude = async () => {
    if (!seriesInputRef.current) return;
    const ok = await seriesInputRef.current.check();
    if (!ok) return;
    const restTime = seriesInputRef.current.getRestTime();
    advanceAfterSeries(restTime);
  };

  const handleSeriesSkip = () => {
    const restTime =
      seriesInputRef.current?.getRestTime() ?? currentSeries?.restTime ?? 0;
    advanceAfterSeries(restTime);
  };

  const renderReadOnlyBody = () => (
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
              const loggedSet = sessionData!.records?.find(
                (ls) =>
                  ls.exerciseName === exercise.name &&
                  ls.seriesOrder === sIndex + 1,
              );
              return (
                <SeriesInputRow
                  key={sIndex}
                  exercise={exercise}
                  series={s}
                  seriesIndex={sIndex}
                  sessionId={sessionData!._id}
                  loggedSet={loggedSet}
                  isReadOnly={isReadOnly}
                />
              );
            })}
          </StyledSeriesList>
        </StyledExerciseSection>
      ))}
    </StyledSessionBody>
  );

  const renderActiveBody = () => {
    if (!currentExercise || !currentSeries) {
      return (
        <StyledSessionBody>
          <StyledEmptyText>{strings.common.error}</StyledEmptyText>
        </StyledSessionBody>
      );
    }

    const loggedSet = sessionData!.records?.find(
      (ls) =>
        ls.exerciseName === currentExercise.name &&
        ls.seriesOrder === currentSeriesIndex + 1,
    );

    return (
      <StyledActiveSessionLayout>
        <StyledExerciseFocus>
          <StyledSeriesTypeBadgeFocus>
            {SERIES_TYPE_LABEL[currentSeries.type]}
          </StyledSeriesTypeBadgeFocus>
          <StyledExerciseNameFocus>
            {currentExercise.name}
          </StyledExerciseNameFocus>
          <StyledExerciseMuscleFocus>
            {currentExercise.muscleGroup}
          </StyledExerciseMuscleFocus>

          <SeriesInputRow
            ref={seriesInputRef}
            key={`${currentExercise._id}-${currentSeriesIndex}`}
            exercise={currentExercise}
            series={currentSeries}
            seriesIndex={currentSeriesIndex}
            sessionId={sessionData!._id}
            loggedSet={loggedSet}
            isReadOnly={false}
            inputsOnly
          />
        </StyledExerciseFocus>

        <StyledSeriesProgressDots>
          {currentExercise.series.map((_, index) => (
            <StyledSeriesProgressDot
              key={index}
              $completed={
                index < currentSeriesIndex ||
                (index === currentSeriesIndex && isSeriesLogged)
              }
              $current={index === currentSeriesIndex && !isSeriesLogged}
            />
          ))}
        </StyledSeriesProgressDots>
      </StyledActiveSessionLayout>
    );
  };

  return (
    <StyledSessionPage>
      <StyledSessionHeader>
        <StyledSessionTopRow>
          <StyledBackBtn onClick={onBack} aria-label="Voltar">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
            </svg>
          </StyledBackBtn>
          {!isReadOnly && exercises.length > 0 ? (
            <StyledProgressBadge>
              {currentExerciseIndex + 1}/{exercises.length}
            </StyledProgressBadge>
          ) : (
            <StyledProgressBadge>
              {strings.workout.progressCounter(loggedCount, totalSeries)}
            </StyledProgressBadge>
          )}
        </StyledSessionTopRow>
        {isReadOnly && (
          <>
            <StyledExerciseNameFocus as="h1">
              {DAY_FULL[dayOfWeek]}
            </StyledExerciseNameFocus>
          </>
        )}
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
              <StyledDoneBannerIcon
                $skipped={sessionData?.status === "skipped"}
              >
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

          {isReadOnly ? renderReadOnlyBody() : renderActiveBody()}

          {!isReadOnly && currentExercise && (
            <StyledSessionBottomBar>
              <StyledSkipBtn
                onClick={handleSeriesSkip}
                disabled={completeSession.isPending || showRestTimer}
              >
                {strings.workout.skipBtn}
              </StyledSkipBtn>
              <StyledConcludeBtn
                onClick={() => {
                  void handleSeriesConclude();
                }}
                disabled={completeSession.isPending || showRestTimer}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                </svg>
                {strings.workout.concludeBtn(
                  currentSeriesIndex + 1,
                  totalSeriesInExercise,
                )}
              </StyledConcludeBtn>
            </StyledSessionBottomBar>
          )}

          {showRestTimer && (
            <RestTimerOverlay
              visible={showRestTimer}
              restDuration={restDuration}
              onDismiss={handleDismissRest}
            />
          )}

          {errorToast && <StyledErrorToast>{errorToast}</StyledErrorToast>}
        </>
      )}
    </StyledSessionPage>
  );
}
