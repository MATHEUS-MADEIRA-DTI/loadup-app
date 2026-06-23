"use client";

import styled from "styled-components";

import { strings } from "@/constants/strings";
import { Exercise } from "@/types";

import MuscleChip from "../MuscleChip";
import SeriesRow from "../SeriesRow";

interface ExerciseCardProps {
  exercise: Exercise;
  onEdit?: () => void;
  onDelete?: () => void;
}

export default function ExerciseCard({
  exercise,
  onEdit,
  onDelete,
}: ExerciseCardProps) {
  return (
    <StyledCard>
      <StyledHeader>
        <StyledName>{exercise.name}</StyledName>
        <MuscleChip muscleGroup={exercise.muscleGroup} />
      </StyledHeader>
      <StyledSeriesList>
        {exercise.series.map((series, index) => (
          <SeriesRow key={index} series={series} index={index} />
        ))}
      </StyledSeriesList>
      {(onEdit || onDelete) && (
        <StyledActions>
          {onEdit && (
            <StyledActionButton onClick={onEdit}>
              {strings.exercises.editButton}
            </StyledActionButton>
          )}
          {onDelete && (
            <StyledDeleteButton onClick={onDelete}>
              {strings.exercises.deleteButton}
            </StyledDeleteButton>
          )}
        </StyledActions>
      )}
    </StyledCard>
  );
}

const StyledCard = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.inner};
  padding: ${({ theme }) => theme.spacing.md};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
  box-shadow: ${({ theme }) => theme.shadows.card};
`;

const StyledHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const StyledName = styled.h3`
  font-size: ${({ theme }) => theme.typography.titleMedium.fontSize};
  font-weight: ${({ theme }) => theme.typography.titleMedium.fontWeight};
  color: ${({ theme }) => theme.colors.onSurface};
  flex: 1;
`;

const StyledSeriesList = styled.ul`
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const StyledActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  justify-content: flex-end;
  margin-top: ${({ theme }) => theme.spacing.xs};
`;

const StyledActionButton = styled.button`
  font-size: ${({ theme }) => theme.typography.labelLarge.fontSize};
  font-weight: ${({ theme }) => theme.typography.labelLarge.fontWeight};
  color: ${({ theme }) => theme.colors.primary};
  background: none;
  border: none;
  cursor: pointer;
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
`;

const StyledDeleteButton = styled(StyledActionButton)`
  color: ${({ theme }) => theme.colors.error};
`;
