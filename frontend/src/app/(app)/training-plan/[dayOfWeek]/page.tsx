"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Check } from "lucide-react";
import { flushSync } from "react-dom";

import EmptyState from "@/components/EmptyState";
import PageTransition from "@/components/PageTransition";
import { strings } from "@/constants/strings";
import { useExercises, useReorderExercises } from "@/hooks/useExercises";
import { useTodaySession } from "@/hooks/useSession";
import WrongDayModal from "./components/WrongDayModal";
import { DayOfWeek, Exercise, MuscleGroup } from "@/types";

import AddExerciseModal from "./components/AddExerciseModal";
import DayHeader from "./components/DayHeader";
import DeleteConfirmModal from "./components/DeleteConfirmModal";
import EditExerciseModal from "./components/EditExerciseModal";
import ExerciseCard from "./components/ExerciseCard";
import {
  StyledBody,
  StyledConcluirBtn,
  StyledEditBar,
  StyledEditHint,
  StyledFab,
  StyledPage,
  StyledSectionHeading,
  StyledSkeletonCard,
  StyledStartBtn,
  StyledStatCard,
  StyledStatNum,
  StyledStatRing,
  StyledStatRingInner,
  StyledStatsRow,
  StyledStatTitle,
} from "./styles";
import { DAY_LABEL, isValidDay } from "./utils";

export default function DayExercisesPage() {
  const router = useRouter();
  const params = useParams();
  const dayOfWeek = params.dayOfWeek as string;
  const exercises = useExercises(dayOfWeek as DayOfWeek);
  const reorderExercises = useReorderExercises(dayOfWeek as DayOfWeek);
  const [showWrongDayModal, setShowWrongDayModal] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [editExercise, setEditExercise] = useState<Exercise | null>(null);
  const [deleteExercise, setDeleteExercise] = useState<Exercise | null>(null);
  const [dragEnabled, setDragEnabled] = useState(false);
  const [localOrder, setLocalOrder] = useState<string[]>([]);
  const cardRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const session = useTodaySession();

  useEffect(() => {
    if (exercises.data) {
      setLocalOrder(exercises.data.map((ex) => ex._id));
    }
  }, [exercises.data]);

  const todayDayOfWeek = (() => {
    const days = [
      "sunday",
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
    ];
    return days[new Date().getDay()];
  })();

  const isToday = dayOfWeek === todayDayOfWeek;
  const isSessionDone =
    session.data?.status === "completed" || session.data?.status === "skipped";

  const handleStartWorkout = () => {
    if (isToday && isSessionDone) {
      router.push("/session/completed");
    } else if (!isToday) {
      setShowWrongDayModal(true);
    } else {
      router.push("/train");
    }
  };

  if (!isValidDay(dayOfWeek)) {
    router.replace("/training-plan");
    return null;
  }

  const dayLabel = DAY_LABEL[dayOfWeek];
  const raw = exercises.data ?? [];
  const list =
    localOrder.length === raw.length
      ? localOrder.map((id) => raw.find((ex) => ex._id === id)!).filter(Boolean)
      : raw;
  const totalSeries = list.reduce((acc, ex) => acc + ex.series.length, 0);
  const uniqueMuscles = Array.from(
    new Set(list.map((ex) => ex.muscleGroup)),
  ) as MuscleGroup[];

  const move = (index: number, dir: -1 | 1) => {
    const target = index + dir;
    if (target < 0 || target >= list.length) return;

    // FLIP — First: capture positions keyed by exercise identity
    const first = new Map<string, number>();
    cardRefs.current.forEach((el, key) => {
      first.set(key, el.getBoundingClientRect().top);
    });

    // FLIP — Last: force sync DOM update
    let nextOrder: string[] = [];
    flushSync(() => {
      setLocalOrder((prev) => {
        const next = [...prev];
        [next[index], next[target]] = [next[target], next[index]];
        nextOrder = next;
        return next;
      });
    });

    // FLIP — Invert + Play with forced reflow so browser sees the initial position
    cardRefs.current.forEach((el, key) => {
      const oldTop = first.get(key) ?? 0;
      const newTop = el.getBoundingClientRect().top;
      const delta = oldTop - newTop;
      if (Math.abs(delta) < 1) return;
      el.style.transition = "none";
      el.style.transform = `translateY(${delta}px)`;
      el.getBoundingClientRect(); // force reflow — commits the transform before transition starts
      el.style.transition = "transform 320ms cubic-bezier(0.34, 1.56, 0.64, 1)";
      el.style.transform = "";
    });

    reorderExercises.mutate(nextOrder);
  };

  if (exercises.isLoading) {
    return (
      <>
        <PageTransition>
          <StyledPage>
            <DayHeader
              dayLabel={dayLabel}
              uniqueMuscles={[]}
              onBack={() => router.back()}
            />
            <StyledBody>
              {Array.from({ length: 3 }).map((_, i) => (
                <StyledSkeletonCard key={i} />
              ))}
            </StyledBody>
          </StyledPage>
        </PageTransition>
      </>
    );
  }

  if (exercises.error) {
    return (
      <>
        <PageTransition>
          <StyledPage>
            <DayHeader
              dayLabel={dayLabel}
              uniqueMuscles={[]}
              onBack={() => router.back()}
            />
            <StyledBody>
              <EmptyState
                title={strings.common.error}
                ctaLabel={strings.common.retry}
                onCta={() => exercises.refetch()}
              />
            </StyledBody>
          </StyledPage>
        </PageTransition>
      </>
    );
  }

  return (
    <>
      <PageTransition>
        <StyledPage>
          <DayHeader
            dayLabel={dayLabel}
            uniqueMuscles={uniqueMuscles}
            onBack={() => router.back()}
            dragEnabled={dragEnabled}
            onToggleDrag={
              list.length > 1 ? () => setDragEnabled((v) => !v) : undefined
            }
          />

          {list.length > 0 && (
            <>
              <StyledSectionHeading>
                {strings.exercises.title}
              </StyledSectionHeading>
              <StyledStatsRow>
                <StyledStatCard>
                  <StyledStatRing>
                    <StyledStatRingInner>
                      <StyledStatNum>{list.length}</StyledStatNum>
                    </StyledStatRingInner>
                  </StyledStatRing>
                  <StyledStatTitle>
                    {strings.trainingPlan.statExercises}
                  </StyledStatTitle>
                </StyledStatCard>
                <StyledStatCard>
                  <StyledStatRing>
                    <StyledStatRingInner>
                      <StyledStatNum>{totalSeries}</StyledStatNum>
                    </StyledStatRingInner>
                  </StyledStatRing>
                  <StyledStatTitle>
                    {strings.trainingPlan.statSeries}
                  </StyledStatTitle>
                </StyledStatCard>
              </StyledStatsRow>
            </>
          )}

          <StyledBody>
            {list.length === 0 ? (
              <EmptyState
                title={strings.exercises.emptyTitle}
                description={strings.exercises.emptySubtitle}
                ctaLabel={strings.exercises.addButton}
                onCta={() => setAddOpen(true)}
              />
            ) : (
              list.map((exercise, i) => (
                <div
                  key={exercise._id}
                  ref={(el) => {
                    if (el) cardRefs.current.set(exercise._id, el);
                    else cardRefs.current.delete(exercise._id);
                  }}
                >
                  <ExerciseCard
                    exercise={exercise}
                    index={i}
                    onEdit={() => setEditExercise(exercise)}
                    onDelete={() => setDeleteExercise(exercise)}
                    editing={dragEnabled}
                    onMoveUp={() => move(i, -1)}
                    onMoveDown={() => move(i, 1)}
                    isFirst={i === 0}
                    isLast={i === list.length - 1}
                  />
                </div>
              ))
            )}
          </StyledBody>

          {list.length > 0 && !dragEnabled && (
            <>
              <StyledFab
                onClick={() => setAddOpen(true)}
                aria-label={strings.exercises.addButton}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                </svg>
              </StyledFab>
              <StyledStartBtn onClick={handleStartWorkout}>
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
                {strings.trainingPlan.startWorkout}
              </StyledStartBtn>
            </>
          )}

          <StyledEditBar $visible={dragEnabled}>
            <StyledEditHint>
              Use as setas para reordenar os exercícios.
            </StyledEditHint>
            <StyledConcluirBtn
              type="button"
              onClick={() => setDragEnabled(false)}
            >
              <Check size={15} strokeWidth={3} />
              Concluir
            </StyledConcluirBtn>
          </StyledEditBar>
        </StyledPage>
      </PageTransition>
      <AddExerciseModal
        isOpen={addOpen}
        onClose={() => setAddOpen(false)}
        dayOfWeek={dayOfWeek}
      />
      {editExercise && (
        <EditExerciseModal
          isOpen
          onClose={() => setEditExercise(null)}
          dayOfWeek={dayOfWeek}
          exercise={editExercise}
        />
      )}
      {deleteExercise && (
        <DeleteConfirmModal
          isOpen
          onClose={() => setDeleteExercise(null)}
          dayOfWeek={dayOfWeek}
          exercise={deleteExercise}
        />
      )}
      <WrongDayModal
        isOpen={showWrongDayModal}
        onClose={() => setShowWrongDayModal(false)}
        todayLabel={DAY_LABEL[todayDayOfWeek as DayOfWeek] ?? "hoje"}
        onNavigate={() => router.back()}
      />
    </>
  );
}
