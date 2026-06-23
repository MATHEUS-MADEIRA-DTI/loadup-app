"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";

import EmptyState from "@/components/EmptyState";
import MuscleChip from "@/components/MuscleChip";
import PageTransition from "@/components/PageTransition";
import { strings } from "@/constants/strings";
import { useCreateTrainingSheet, useTrainingSheet, useUpdateDay } from "@/hooks/useTrainingSheet";
import { DayType, MuscleGroup } from "@/types";

import DayCard from "./components/DayCard";
import PlanHeader from "./components/PlanHeader";
import { StyledBody, StyledErrorText, StyledMuscleRow, StyledPage, StyledSection, StyledSectionTitle, StyledSkeletonCard } from "./styles";
import { DAYS, JS_TO_DOW } from "./utils";

export default function TrainingPlanPage() {
  const router = useRouter();
  const sheet = useTrainingSheet();
  const createSheet = useCreateTrainingSheet();
  const updateDay = useUpdateDay();
  const todayDow = JS_TO_DOW[new Date().getDay()];

  const days = useMemo(
    () => DAYS.map((d) => sheet.data?.days.find((sd) => sd.dayOfWeek === d) ?? { dayOfWeek: d, status: "rest" as DayType, exercises: [] }),
    [sheet.data],
  );
  const trainingCount = days.filter((d) => d.status === "training").length;
  const restCount = days.length - trainingCount;
  const allMuscles = useMemo(
    () => Array.from(new Set(days.filter((d) => d.status === "training").flatMap((d) => d.exercises.map((ex) => ex.muscleGroup)))) as MuscleGroup[],
    [days],
  );

  if (sheet.isLoading) {
    return (
      <PageTransition>
        <StyledPage>
          <PlanHeader trainingCount={0} restCount={0} />
          <StyledBody>{Array.from({ length: 7 }).map((_, i) => <StyledSkeletonCard key={i} />)}</StyledBody>
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
        <PlanHeader trainingCount={trainingCount} restCount={restCount} />
        <StyledBody>
          {allMuscles.length > 0 && (
            <StyledSection>
              <StyledSectionTitle>{strings.trainingPlan.sectionMuscles}</StyledSectionTitle>
              <StyledMuscleRow>{allMuscles.map((mg) => <MuscleChip key={mg} muscleGroup={mg} />)}</StyledMuscleRow>
            </StyledSection>
          )}
          <StyledSection>
            <StyledSectionTitle>{strings.trainingPlan.sectionDays}</StyledSectionTitle>
            {days.map((day) => (
              <DayCard
                key={day.dayOfWeek}
                day={day}
                isToday={day.dayOfWeek === todayDow}
                onToggle={(d, next) => updateDay.mutate({ day: d, status: next })}
                onNavigate={(d) => router.push(`/training-plan/${d}`)}
                onAdd={(d) => router.push(`/training-plan/${d}`)}
                isUpdating={updateDay.isPending}
              />
            ))}
          </StyledSection>
        </StyledBody>
      </StyledPage>
    </PageTransition>
  );
}