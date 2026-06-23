"use client";

import styled from "styled-components";

import { MuscleGroup } from "@/types";

interface MuscleChipProps {
  muscleGroup: MuscleGroup;
}

export default function MuscleChip({ muscleGroup }: MuscleChipProps) {
  return <StyledChip $muscleGroup={muscleGroup}>{muscleGroup}</StyledChip>;
}

const StyledChip = styled.span<{ $muscleGroup: MuscleGroup }>`
  display: inline-block;
  padding: 2px ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.chip};
  background-color: ${({ theme, $muscleGroup }) =>
    theme.colors.muscleGroups[$muscleGroup].bg};
  color: ${({ theme, $muscleGroup }) =>
    theme.colors.muscleGroups[$muscleGroup].text};
  font-size: ${({ theme }) => theme.typography.labelSmall.fontSize};
  font-weight: ${({ theme }) => theme.typography.labelSmall.fontWeight};
  white-space: nowrap;
`;
