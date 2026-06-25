"use client";

import { ArrowLeft, Clock3, Dumbbell, ListChecks } from "lucide-react";
import MuscleChip from "@/components/MuscleChip";
import { strings } from "@/constants/strings";
import { DayOfWeek, TrainingDay } from "@/types";
import { DAY_FULL } from "../../utils";
import {
  StyledBackButton,
  StyledBackLink,
  StyledStatIcon,
  StyledBottomBar,
  StyledDayName,
  StyledExerciseList,
  StyledExerciseName,
  StyledExerciseRow,
  StyledExerciseSection,
  StyledExerciseSeries,
  StyledExerciseNumber,
  StyledHero,
  StyledHeroChips,
  StyledSectionLabel,
  StyledStartBtn,
  StyledStatCard,
  StyledStatLabel,
  StyledStatRow,
  StyledStatValue,
  StyledTopBar,
  StyledScrollContent,
  StyledWorkoutIntro,
} from "./styles";

interface WorkoutIntroProps {
  dayOfWeek: DayOfWeek;
  sheetDay: TrainingDay;
  onBack: () => void;
  onStart: () => void;
}

export default function WorkoutIntro({
  dayOfWeek,
  sheetDay,
  onBack,
  onStart,
}: WorkoutIntroProps) {
  const exercises = sheetDay.exercises;
  const totalExercises = exercises.length;
  const totalSeries = exercises.reduce(
    (acc, exercise) => acc + exercise.series.length,
    0,
  );
  const uniqueMuscles = Array.from(
    new Set(exercises.map((exercise) => exercise.muscleGroup)),
  ).slice(0, 4);
  const estimatedMinutes = Math.max(5, Math.ceil(totalSeries * 1.5));

  return (
    <StyledWorkoutIntro>
      <StyledTopBar>
        <StyledBackButton onClick={onBack} aria-label={strings.common.back}>
          <ArrowLeft size={20} />
        </StyledBackButton>
      </StyledTopBar>

      <StyledHero>
        <StyledDayName>{DAY_FULL[dayOfWeek]}</StyledDayName>
        <StyledHeroChips>
          {uniqueMuscles.map((muscle) => (
            <MuscleChip key={muscle} muscleGroup={muscle} />
          ))}
        </StyledHeroChips>
      </StyledHero>

      <StyledStatRow>
        <StyledStatCard>
          <StyledStatIcon>
            <Dumbbell size={18} />
          </StyledStatIcon>

          <StyledStatValue>{totalExercises}</StyledStatValue>
          <StyledStatLabel>
            {strings.trainingPlan.statExercises}
          </StyledStatLabel>
        </StyledStatCard>
        <StyledStatCard>
          <StyledStatIcon>
            <ListChecks size={18} />
          </StyledStatIcon>
          <StyledStatValue>{totalSeries}</StyledStatValue>
          <StyledStatLabel>{strings.trainingPlan.statSeries}</StyledStatLabel>
        </StyledStatCard>
        <StyledStatCard>
          <StyledStatIcon>
            <Clock3 size={18} />{" "}
          </StyledStatIcon>
          <StyledStatValue>{estimatedMinutes}</StyledStatValue>
          <StyledStatLabel>Minutos</StyledStatLabel>
        </StyledStatCard>
      </StyledStatRow>

      <StyledExerciseSection>
        <StyledSectionLabel>EXERCÍCIOS</StyledSectionLabel>
        <StyledExerciseList>
          {exercises.map((exercise, index) => (
            <StyledExerciseRow key={exercise._id}>
              <StyledExerciseNumber>
                {String(index + 1).padStart(2, "0")}
              </StyledExerciseNumber>
              <StyledExerciseName>{exercise.name}</StyledExerciseName>
              <StyledExerciseSeries>
                {exercise.series.length}x
              </StyledExerciseSeries>
            </StyledExerciseRow>
          ))}
        </StyledExerciseList>
      </StyledExerciseSection>

      <StyledBottomBar>
        <StyledStartBtn onClick={onStart}>
          {strings.home.startWorkoutShort.toUpperCase()}
        </StyledStartBtn>
      </StyledBottomBar>
    </StyledWorkoutIntro>
  );
}
