"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";

import EmptyState from "@/components/EmptyState";
import PageTransition from "@/components/PageTransition";
import { strings } from "@/constants/strings";
import { useExercises } from "@/hooks/useExercises";
import { DayOfWeek, Exercise, MuscleGroup } from "@/types";

import AddExerciseModal from "./components/AddExerciseModal";
import DayHeader from "./components/DayHeader";
import DeleteConfirmModal from "./components/DeleteConfirmModal";
import EditExerciseModal from "./components/EditExerciseModal";
import ExerciseCard from "./components/ExerciseCard";
import {
  StyledBody,
  StyledFab,
  StyledPage,
  StyledSkeletonCard,
  StyledStartBtn,
  StyledStatBox,
  StyledStatLabel,
  StyledStatNum,
  StyledStatsRow,
} from "./styles";
import { DAY_LABEL, isValidDay } from "./utils";

export default function DayExercisesPage() {
  const router = useRouter();
  const params = useParams();
  const dayOfWeek = params.dayOfWeek as string;
  const exercises = useExercises(dayOfWeek as DayOfWeek);

  const [addOpen, setAddOpen] = useState(false);
  const [editExercise, setEditExercise] = useState<Exercise | null>(null);
  const [deleteExercise, setDeleteExercise] = useState<Exercise | null>(null);

  if (!isValidDay(dayOfWeek)) {
    router.replace("/training-plan");
    return null;
  }

  const dayLabel = DAY_LABEL[dayOfWeek];
  const list = exercises.data ?? [];
  const totalSeries = list.reduce((acc, ex) => acc + ex.series.length, 0);
  const uniqueMuscles = Array.from(
    new Set(list.map((ex) => ex.muscleGroup)),
  ) as MuscleGroup[];

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
          />

          {list.length > 0 && (
            <StyledStatsRow>
              <StyledStatBox>
                <StyledStatNum>{list.length}</StyledStatNum>
                <StyledStatLabel>
                  {strings.trainingPlan.statExercises}
                </StyledStatLabel>
              </StyledStatBox>
              <StyledStatBox>
                <StyledStatNum>{totalSeries}</StyledStatNum>
                <StyledStatLabel>
                  {strings.trainingPlan.statSeries}
                </StyledStatLabel>
              </StyledStatBox>
            </StyledStatsRow>
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
                <ExerciseCard
                  key={exercise._id}
                  exercise={exercise}
                  index={i}
                  onEdit={() => setEditExercise(exercise)}
                  onDelete={() => setDeleteExercise(exercise)}
                />
              ))
            )}
          </StyledBody>

          {list.length > 0 && (
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
              <StyledStartBtn
                onClick={() => router.push(`/workout/${dayOfWeek}`)}
              >
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
        </StyledPage>
      </PageTransition>

      {/* Modals moved outside PageTransition to avoid transform stacking context */}
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
    </>
  );
}
