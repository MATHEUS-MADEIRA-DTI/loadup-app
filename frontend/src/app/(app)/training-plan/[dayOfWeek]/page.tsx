"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

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

function SortableExerciseCard({
  exercise,
  index,
  onEdit,
  onDelete,
  dragEnabled,
}: {
  exercise: Exercise;
  index: number;
  onEdit: () => void;
  onDelete: () => void;
  dragEnabled: boolean;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: exercise._id, disabled: !dragEnabled });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...(dragEnabled ? { ...attributes, ...listeners } : {})}
    >
      <ExerciseCard
        exercise={exercise}
        index={index}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    </div>
  );
}

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
  const [activeDragId, setActiveDragId] = useState<string | null>(null);
  const session = useTodaySession();

  useEffect(() => {
    if (exercises.data) {
      setLocalOrder(exercises.data.map((ex) => ex._id));
    }
  }, [exercises.data]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 8 } }),
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveDragId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveDragId(null);
    if (!over || active.id === over.id) return;

    setLocalOrder((prev) => {
      const newOrder = [...prev];
      const aIdx = newOrder.indexOf(active.id as string);
      const bIdx = newOrder.indexOf(over.id as string);
      [newOrder[aIdx], newOrder[bIdx]] = [newOrder[bIdx], newOrder[aIdx]];
      reorderExercises.mutate(newOrder);
      return newOrder;
    });
  };

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
    console.log("dayOfWeek:", dayOfWeek);
    console.log("todayDayOfWeek:", todayDayOfWeek);
    console.log("isToday:", isToday);
    console.log("isSessionDone:", isSessionDone);

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
  const activeDragExercise = activeDragId
    ? list.find((ex) => ex._id === activeDragId)
    : null;

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
            onToggleDrag={list.length > 1 ? () => setDragEnabled((v) => !v) : undefined}
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
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={list.map((ex) => ex._id)}
                  strategy={verticalListSortingStrategy}
                >
                  {list.map((exercise, i) => (
                    <SortableExerciseCard
                      key={exercise._id}
                      exercise={exercise}
                      index={i}
                      onEdit={() => setEditExercise(exercise)}
                      onDelete={() => setDeleteExercise(exercise)}
                      dragEnabled={dragEnabled}
                    />
                  ))}
                </SortableContext>
                <DragOverlay>
                  {activeDragExercise && (
                    <ExerciseCard
                      exercise={activeDragExercise}
                      index={list.indexOf(activeDragExercise)}
                      onEdit={() => {}}
                      onDelete={() => {}}
                    />
                  )}
                </DragOverlay>
              </DndContext>
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
