"use client";

import { useMemo, useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";
import { toast } from "sonner";
import { flushSync } from "react-dom";

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
import { DayOfWeek, TrainingDay } from "@/types";

import DayCard from "./components/DayCard";
import PlanHeader from "./components/PlanHeader";
import {
  StyledBody,
  StyledConcluirBtn,
  StyledEditBar,
  StyledEditHint,
  StyledErrorText,
  StyledPage,
  StyledSection,
  StyledSectionTitle,
  StyledSkeletonCard,
} from "./styles";
import { DAYS, JS_TO_DOW } from "./utils";

export default function TrainingPlanPage() {
  const router = useRouter();
  const sheet = useTrainingSheet();
  const createSheet = useCreateTrainingSheet();
  const updateDay = useUpdateDay();
  const swapDays = useSwapDays();
  const todaySession = useTodaySession();
  const [activeToggleDay, setActiveToggleDay] = useState<DayOfWeek | null>(null);
  const [dragEnabled, setDragEnabled] = useState(false);
  const todayDow = JS_TO_DOW[new Date().getDay()];

  const activeDow =
    (todaySession.data?.status === "partial" ||
      todaySession.data?.status === "active") &&
    (todaySession.data.records?.length ?? 0) > 0
      ? (todaySession.data.dayOfWeek as DayOfWeek)
      : null;

  const handleToggleDay = (day: DayOfWeek, currentStatus: "training" | "rest") => {
    const nextStatus = currentStatus === "training" ? "rest" : "training";
    setActiveToggleDay(day);
    updateDay.mutate({ day, status: nextStatus }, { onSettled: () => setActiveToggleDay(null) });
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
  const cardRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  useEffect(() => {
    setLocalOrder(days.map((d) => d.dayOfWeek));
  }, [days]);

  const orderedDays = localOrder.length
    ? localOrder.map((dow) => days.find((d) => d.dayOfWeek === dow)!)
    : days;

  const move = (index: number, dir: -1 | 1) => {
    const target = index + dir;
    if (target < 0 || target >= orderedDays.length) return;

    const dayA = orderedDays[index].dayOfWeek;
    const dayB = orderedDays[target].dayOfWeek;

    if (dayA === activeDow || dayB === activeDow) {
      toast.error("Você já começou um treinamento nesse dia, conclua ou pule para poder alterar o dia");
      return;
    }

    // FLIP — First: capture positions keyed by day identity
    const first = new Map<string, number>();
    cardRefs.current.forEach((el, key) => {
      first.set(key, el.getBoundingClientRect().top);
    });

    // FLIP — Last: force sync DOM update
    flushSync(() => {
      setLocalOrder((prev) => {
        const next = [...prev];
        const aIdx = next.indexOf(dayA);
        const bIdx = next.indexOf(dayB);
        [next[aIdx], next[bIdx]] = [next[bIdx], next[aIdx]];
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
              ctaLabel={createSheet.isPending ? strings.common.loading : strings.trainingPlan.createSheet}
              onCta={() => createSheet.mutate()}
            />
            {createSheet.isError && <StyledErrorText>{strings.common.error}</StyledErrorText>}
          </StyledBody>
        </StyledPage>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <StyledPage>
        <PlanHeader trainingCount={trainingCount} restCount={restCount} dragEnabled={dragEnabled} onToggleDrag={() => setDragEnabled((v) => !v)} />
        <StyledBody>
          <StyledSection>
            <StyledSectionTitle>{strings.trainingPlan.sectionDays}</StyledSectionTitle>
            {orderedDays.map((day, index) => (
              <div key={day.dayOfWeek} ref={(el) => { if (el) cardRefs.current.set(day.dayOfWeek, el); else cardRefs.current.delete(day.dayOfWeek); }}>
                <DayCard
                  day={day}
                  isToday={day.dayOfWeek === todayDow}
                  onNavigate={(d) => router.push(`/training-plan/${d}`)}
                  onToggle={handleToggleDay}
                  isUpdating={activeToggleDay === day.dayOfWeek && updateDay.isPending}
                  editing={dragEnabled}
                  onMoveUp={() => move(index, -1)}
                  onMoveDown={() => move(index, 1)}
                  isFirst={index === 0}
                  isLast={index === orderedDays.length - 1}
                />
              </div>
            ))}
          </StyledSection>
        </StyledBody>

        <StyledEditBar $visible={dragEnabled}>
          <StyledEditHint>Use as setas para reordenar os dias da semana.</StyledEditHint>
          <StyledConcluirBtn type="button" onClick={() => setDragEnabled(false)}>
            <Check size={15} strokeWidth={3} />
            Concluir
          </StyledConcluirBtn>
        </StyledEditBar>
      </StyledPage>
    </PageTransition>
  );
}
