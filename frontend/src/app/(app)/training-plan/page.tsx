"use client";

import { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  DndContext,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
  closestCenter,
  PointerSensor,
  TouchSensor,
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
import {
  useCreateTrainingSheet,
  useSwapDays,
  useTrainingSheet,
  useUpdateDay,
} from "@/hooks/useTrainingSheet";
import { DayOfWeek, MuscleGroup, TrainingDay } from "@/types";

import DayCard from "./components/DayCard";
import PlanHeader from "./components/PlanHeader";
import {
  StyledBody,
  StyledErrorText,
  StyledPage,
  StyledSection,
  StyledSectionTitle,
  StyledSkeletonCard,
} from "./styles";
import { DAYS, JS_TO_DOW } from "./utils";

function SortableDayCard({
  day,
  isToday,
  onNavigate,
  onToggle,
  isUpdating,
}: {
  day: TrainingDay;
  isToday: boolean;
  onNavigate: (d: DayOfWeek) => void;
  onToggle: (d: DayOfWeek, s: "training" | "rest") => void;
  isUpdating: boolean;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: day.dayOfWeek });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <DayCard
        day={day}
        isToday={isToday}
        onNavigate={onNavigate}
        onToggle={onToggle}
        isUpdating={isUpdating}
        isDragging={isDragging}
        dragHandleProps={{ ...attributes, ...listeners }}
      />
    </div>
  );
}

export default function TrainingPlanPage() {
  const router = useRouter();
  const sheet = useTrainingSheet();
  const createSheet = useCreateTrainingSheet();
  const updateDay = useUpdateDay();
  const swapDays = useSwapDays();
  const [activeToggleDay, setActiveToggleDay] = useState<DayOfWeek | null>(
    null,
  );
  const [activeDragId, setActiveDragId] = useState<DayOfWeek | null>(null);
  const todayDow = JS_TO_DOW[new Date().getDay()];

  const handleToggleDay = (
    day: DayOfWeek,
    currentStatus: "training" | "rest",
  ) => {
    const nextStatus = currentStatus === "training" ? "rest" : "training";
    setActiveToggleDay(day);
    updateDay.mutate(
      { day, status: nextStatus },
      { onSettled: () => setActiveToggleDay(null) },
    );
  };

  const days = useMemo(
    () =>
      DAYS.map(
        (d) =>
          sheet.data?.days.find((sd) => sd.dayOfWeek === d) ?? {
            dayOfWeek: d,
            status: "rest" as const,
            exercises: [],
          },
      ),
    [sheet.data],
  );

  const [localOrder, setLocalOrder] = useState<DayOfWeek[]>([]);

  useEffect(() => {
    setLocalOrder(days.map((d) => d.dayOfWeek));
  }, [days]);

  const orderedDays = localOrder.length
    ? localOrder.map((dow) => days.find((d) => d.dayOfWeek === dow)!)
    : days;

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 200, tolerance: 8 },
    }),
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveDragId(event.active.id as DayOfWeek);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveDragId(null);

    if (!over || active.id === over.id) return;

    const dayA = active.id as DayOfWeek;
    const dayB = over.id as DayOfWeek;

    // Optimistic update
    setLocalOrder((prev) => {
      const newOrder = [...prev];
      const aIdx = newOrder.indexOf(dayA);
      const bIdx = newOrder.indexOf(dayB);
      [newOrder[aIdx], newOrder[bIdx]] = [newOrder[bIdx], newOrder[aIdx]];
      return newOrder;
    });

    swapDays.mutate({ dayA, dayB });
  };

  const trainingCount = days.filter((d) => d.status === "training").length;
  const restCount = days.length - trainingCount;

  if (sheet.isLoading) {
    return (
      <PageTransition>
        <StyledPage>
          <PlanHeader trainingCount={0} restCount={0} />
          <StyledBody>
            {Array.from({ length: 7 }).map((_, i) => (
              <StyledSkeletonCard key={i} />
            ))}
          </StyledBody>
        </StyledPage>
      </PageTransition>
    );
  }

  if (sheet.error || !sheet.data) {
    return (
      <PageTransition>
        <StyledPage>
          <PlanHeader trainingCount={0} restCount={0} />
          <StyledBody>
            <EmptyState
              title={strings.trainingPlan.noSheetTitle}
              description={strings.trainingPlan.noSheetSubtitle}
              ctaLabel={
                createSheet.isPending
                  ? strings.common.loading
                  : strings.trainingPlan.createSheet
              }
              onCta={() => createSheet.mutate()}
            />
            {createSheet.isError && (
              <StyledErrorText>{strings.common.error}</StyledErrorText>
            )}
          </StyledBody>
        </StyledPage>
      </PageTransition>
    );
  }

  const activeDragDay = activeDragId
    ? days.find((d) => d.dayOfWeek === activeDragId)
    : null;

  return (
    <PageTransition>
      <StyledPage>
        <PlanHeader trainingCount={trainingCount} restCount={restCount} />
        <StyledBody>
          <StyledSection>
            <StyledSectionTitle>
              {strings.trainingPlan.sectionDays}
            </StyledSectionTitle>
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={localOrder}
                strategy={verticalListSortingStrategy}
              >
                {orderedDays.map((day) => (
                  <SortableDayCard
                    key={day.dayOfWeek}
                    day={day}
                    isToday={day.dayOfWeek === todayDow}
                    onNavigate={(d) => router.push(`/training-plan/${d}`)}
                    onToggle={handleToggleDay}
                    isUpdating={
                      activeToggleDay === day.dayOfWeek && updateDay.isPending
                    }
                  />
                ))}
              </SortableContext>

              <DragOverlay>
                {activeDragDay && (
                  <DayCard
                    day={activeDragDay}
                    isToday={activeDragDay.dayOfWeek === todayDow}
                    onNavigate={() => {}}
                    onToggle={() => {}}
                    isUpdating={false}
                    isDragging
                  />
                )}
              </DragOverlay>
            </DndContext>
          </StyledSection>
        </StyledBody>
      </StyledPage>
    </PageTransition>
  );
}
