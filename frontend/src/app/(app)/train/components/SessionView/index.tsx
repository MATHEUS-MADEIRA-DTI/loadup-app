"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { CheckCircle2, MinusCircle } from "lucide-react";

import { toast } from "sonner";

import { strings } from "@/constants/strings";
import {
  useCompleteSession,
  useCreateSession,
  usePauseSession,
  useStartSession,
  useTodaySession,
} from "@/hooks/useSession";
import MuscleChip from "@/components/MuscleChip";
import { DayOfWeek, RepRangeAlert, SeriesType, TrainingDay } from "@/types";
import { trainingSheetService } from "@/services/trainingSheetService";
import RepRangeAlertSheet from "../RepRangeAlertSheet";

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
  const [nextExercisePreview, setNextExercisePreview] = useState<{
    name: string;
    muscleGroup: string;
    isNewExercise: boolean;
    seriesTypeLabel: string;
    lastWeight: number | null;
  } | null>(null);
  const [repRangeAlert, setRepRangeAlert] = useState<RepRangeAlert | null>(null);
  const [endOfSessionAlerts, setEndOfSessionAlerts] = useState<RepRangeAlert[]>([]);
  const [suggestedWeightAlert, setSuggestedWeightAlert] = useState<{
    exerciseId: string;
    seriesOrder: number;
    suggestedWeight: number;
  } | null>(null);

  const seriesInputRef = useRef<SeriesInputRowHandle>(null);
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (session.isError && !createAttempted) {
      setCreateAttempted(true);
      createSession.mutate(todayIso());
    }
  }, [session.isError, createAttempted, createSession]);

  const sessionData = session.data;
  const exercises = useMemo(
    () => sheetDay?.exercises ?? [],
    [sheetDay?.exercises],
  );
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
  const startSession = useStartSession(sessionData?._id ?? "");
  const pauseSession = usePauseSession(sessionData?._id ?? "");
  const startSessionRef = useRef(startSession.mutate);
  startSessionRef.current = startSession.mutate;
  const pauseSessionRef = useRef(pauseSession.mutate);
  pauseSessionRef.current = pauseSession.mutate;
  const wakeLockRef = useRef<WakeLockSentinel | null>(null);

  const acquireWakeLock = useCallback(async () => {
    if (!("wakeLock" in navigator)) return;
    try {
      wakeLockRef.current = await navigator.wakeLock.request("screen");
    } catch {}
  }, []);

  // Only count time while the user is actually on this screen: start the
  // clock when it mounts (or when leaving read-only), pause it on unmount,
  // navigation away, or when the tab/app is backgrounded.
  useEffect(() => {
    const sessionId = sessionData?._id;
    if (!sessionId || isReadOnly) return;

    startSessionRef.current();
    void acquireWakeLock();

    const handleVisibility = () => {
      if (document.hidden) {
        pauseSessionRef.current();
        wakeLockRef.current = null;
      } else {
        startSessionRef.current();
        void acquireWakeLock();
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      pauseSessionRef.current();
      wakeLockRef.current?.release().then(() => {
        wakeLockRef.current = null;
      });
    };
  }, [sessionData?._id, isReadOnly, acquireWakeLock]);

  const isLoading =
    session.isLoading ||
    (session.isError && !createAttempted) ||
    createSession.isPending;

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

  const handleConclude = useCallback(() => {
    completeSession.mutate(
      { status: "completed" },
      {
        onSuccess: (data) => {
          if (data.repRangeAlerts?.length) {
            setEndOfSessionAlerts(data.repRangeAlerts);
          } else {
            toast.success("Treino concluído!");
          }
        },
        onError: () => toast.error("Erro ao concluir treino. Tente novamente."),
      },
    );
  }, [completeSession]);

  const handleDismissRest = useCallback(() => {
    setShowRestTimer(false);
    setNextExercisePreview(null);
  }, []);

  const handleRepRangeAlert = useCallback(
    (alert: RepRangeAlert, weight: number) => {
      setRepRangeAlert(alert);
    },
    [],
  );

  const handleAlertConfirm = useCallback(
    async (newWeight: number) => {
      const alert = repRangeAlert ?? endOfSessionAlerts[0];
      if (!alert) return;

      const exercise = exercises.find((ex) => ex.name === alert.exerciseName);
      if (exercise) {
        const workingSeries = exercise.series.filter((s) => s.type === "working");
        await trainingSheetService.bulkUpdateSuggestedWeight(
          dayOfWeek,
          exercise._id,
          workingSeries.map((_, idx) => ({ seriesOrder: idx + 1, suggestedWeight: newWeight })),
        );
      }

      if (repRangeAlert) {
        setRepRangeAlert(null);
      } else {
        setEndOfSessionAlerts((prev) => prev.slice(1));
      }
    },
    [repRangeAlert, endOfSessionAlerts, exercises, dayOfWeek],
  );

  const handleAlertDismiss = useCallback(() => {
    if (repRangeAlert) {
      setRepRangeAlert(null);
    } else {
      setEndOfSessionAlerts((prev) => prev.slice(1));
    }
  }, [repRangeAlert]);

  const advanceAfterSeries = useCallback(
    (restTime: number) => {
      const exercise = exercises[currentExerciseIndex];
      if (!exercise) return;

      const hasMoreSeries = currentSeriesIndex < exercise.series.length - 1;

      if (hasMoreSeries) {
        const nextSeriesIdx = currentSeriesIndex + 1;
        const nextSeries = exercise.series[nextSeriesIdx];
        setCurrentSeriesIndex((prev) => prev + 1);
        if (restTime > 0) {
          const logged = sessionData?.records?.find(
            (r) => r.exerciseName === exercise.name && r.seriesOrder === nextSeriesIdx + 1,
          );
          setNextExercisePreview({
            name: exercise.name,
            muscleGroup: exercise.muscleGroup,
            isNewExercise: false,
            seriesTypeLabel: SERIES_TYPE_LABEL[nextSeries.type],
            lastWeight: logged?.weight ?? nextSeries.suggestedWeight ?? null,
          });
          setRestDuration(restTime);
          setShowRestTimer(true);
        }
        return;
      }

      if (currentExerciseIndex < exercises.length - 1) {
        const nextEx = exercises[currentExerciseIndex + 1];
        const nextSeries = nextEx.series[0];
        setCurrentExerciseIndex((prev) => prev + 1);
        setCurrentSeriesIndex(0);
        if (restTime > 0) {
          const logged = sessionData?.records?.find(
            (r) => r.exerciseName === nextEx.name && r.seriesOrder === 1,
          );
          setNextExercisePreview({
            name: nextEx.name,
            muscleGroup: nextEx.muscleGroup,
            isNewExercise: true,
            seriesTypeLabel: SERIES_TYPE_LABEL[nextSeries.type],
            lastWeight: logged?.weight ?? nextSeries?.suggestedWeight ?? null,
          });
          setRestDuration(restTime);
          setShowRestTimer(true);
        }
        return;
      }

      handleConclude();
    },
    [currentExerciseIndex, currentSeriesIndex, exercises, sessionData, handleConclude],
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
            onRepRangeAlert={handleRepRangeAlert}
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
              nextExercise={nextExercisePreview}
            />
          )}

          {(repRangeAlert ?? endOfSessionAlerts[0]) && (
            <RepRangeAlertSheet
              alert={(repRangeAlert ?? endOfSessionAlerts[0])!}
              currentWeight={seriesInputRef.current?.getWeight() ?? 0}
              onConfirm={(w) => { void handleAlertConfirm(w); }}
              onDismiss={handleAlertDismiss}
            />
          )}
        </>
      )}
    </StyledSessionPage>
  );
}
