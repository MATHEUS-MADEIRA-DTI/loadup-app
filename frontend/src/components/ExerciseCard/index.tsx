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
  background: ${({ theme }) => theme.colors.glassOverlay};
  border: 1px solid ${({ theme }) => theme.colors.outlineVariant};
  border-radius: ${({ theme }) => theme.borderRadius.inner};
  padding: ${({ theme }) => theme.spacing.md};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
  box-shadow: ${({ theme }) => theme.shadows.card};
  backdrop-filter: blur(14px);
`;

const StyledHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const StyledName = styled.h3`
  font-family: "Barlow Condensed", Inter, sans-serif;
  font-size: ${({ theme }) => theme.typography.titleMedium.fontSize};
  font-weight: 700;
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
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.outlineVariant};
  border-radius: ${({ theme }) => theme.borderRadius.pill};
  cursor: pointer;
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  transition:
    transform 0.2s ease,
    background 0.2s ease;

  &:hover {
    transform: translateY(-1px);
    background: ${({ theme }) => theme.colors.surfaceElevated};
  }
`;

const StyledDeleteButton = styled(StyledActionButton)`
  color: ${({ theme }) => theme.colors.error};
  border-color: ${({ theme }) => theme.colors.errorContainer};
`;
