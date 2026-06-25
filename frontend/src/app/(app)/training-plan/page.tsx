"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import EmptyState from "@/components/EmptyState";
import MuscleChip from "@/components/MuscleChip";
import PageTransition from "@/components/PageTransition";
import { strings } from "@/constants/strings";
import {
  useCreateTrainingSheet,
  useTrainingSheet,
  useUpdateDay,
} from "@/hooks/useTrainingSheet";
import { DayOfWeek, MuscleGroup } from "@/types";

import DayCard from "./components/DayCard";
import PlanHeader from "./components/PlanHeader";
import {
  StyledBody,
  StyledErrorText,
  StyledMuscleRow,
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
  const [activeToggleDay, setActiveToggleDay] = useState<DayOfWeek | null>(
    null,
  );
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
            status: "rest",
            exercises: [],
          },
      ),
    [sheet.data],
  );
  const trainingCount = days.filter((d) => d.status === "training").length;
  const restCount = days.length - trainingCount;
  const allMuscles = useMemo(
    () =>
      Array.from(
        new Set(
          days
            .filter((d) => d.status === "training")
            .flatMap((d) => d.exercises.map((ex) => ex.muscleGroup)),
        ),
      ) as MuscleGroup[],
    [days],
  );

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

  return (
    <PageTransition>
      <StyledPage>
        <PlanHeader trainingCount={trainingCount} restCount={restCount} />
        <StyledBody>
          <StyledSection>
            <StyledSectionTitle>
              {strings.trainingPlan.sectionDays}
            </StyledSectionTitle>
            {days.map((day) => (
              <DayCard
                key={day.dayOfWeek}
                day={day}
                isToday={day.dayOfWeek === todayDow}
                onNavigate={(d) => router.push(`/training-plan/${d}`)}
                onToggle={handleToggleDay}
                isUpdating={
                  activeToggleDay === day.dayOfWeek && updateDay.isLoading
                }
              />
            ))}
          </StyledSection>
        </StyledBody>
      </StyledPage>
    </PageTransition>
  );
}
