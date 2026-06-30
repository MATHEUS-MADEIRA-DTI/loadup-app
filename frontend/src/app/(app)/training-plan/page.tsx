"use client";

import { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
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
import { useTodaySession } from "@/hooks/useSession";
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
  hasActiveSession,
  dragEnabled,
}: {
  day: TrainingDay;
  isToday: boolean;
  onNavigate: (d: DayOfWeek) => void;
  onToggle: (d: DayOfWeek, s: "training" | "rest") => void;
  isUpdating: boolean;
  hasActiveSession?: boolean;
  dragEnabled: boolean;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: day.dayOfWeek,
    disabled: !!hasActiveSession || !dragEnabled,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const sharedCardProps = {
    day,
    isToday,
    onNavigate,
    onToggle,
    isUpdating,
    isDragging,
  };

  if (hasActiveSession) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        onPointerDown={() =>
          toast.error(
            "Você já começou um treinamento nesse dia, conclua ou pule para poder alterar o dia",
          )
        }
      >
        <DayCard {...sharedCardProps} />
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...(dragEnabled ? { ...attributes, ...listeners } : {})}
    >
      <DayCard {...sharedCardProps} />
    </div>
  );
}

export default function TrainingPlanPage() {
  const router = useRouter();
  const sheet = useTrainingSheet();
  const createSheet = useCreateTrainingSheet();
  const updateDay = useUpdateDay();
  const swapDays = useSwapDays();
  const todaySession = useTodaySession();
  const [activeToggleDay, setActiveToggleDay] = useState<DayOfWeek | null>(
    null,
  );
  const [activeDragId, setActiveDragId] = useState<DayOfWeek | null>(null);
  const [dragEnabled, setDragEnabled] = useState(false);
  const todayDow = JS_TO_DOW[new Date().getDay()];

  // Block reorder only when the user has actually started recording sets today
  const activeDow =
    todaySession.data?.status === "partial" &&
    (todaySession.data.records?.length ?? 0) > 0
      ? (todaySession.data.dayOfWeek as DayOfWeek)
      : null;

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

    // Block if the drop target has an active session (dragging TO a started day)
    if (dayB === activeDow) {
      toast.error(
        "Você já começou um treinamento nesse dia, conclua ou pule para poder alterar o dia",
      );
      return;
    }

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
          <PlanHeader trainingCount={0} restCount={0} dragEnabled={dragEnabled} onToggleDrag={() => setDragEnabled((v) => !v)} />
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
          <PlanHeader trainingCount={0} restCount={0} dragEnabled={dragEnabled} onToggleDrag={() => setDragEnabled((v) => !v)} />
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
        <PlanHeader trainingCount={trainingCount} restCount={restCount} dragEnabled={dragEnabled} onToggleDrag={() => setDragEnabled((v) => !v)} />
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
                    hasActiveSession={day.dayOfWeek === activeDow}
                    dragEnabled={dragEnabled}
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
