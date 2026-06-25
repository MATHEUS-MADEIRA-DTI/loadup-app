"use client";

import styled from "styled-components";

import { MuscleGroup } from "@/types";

interface MuscleChipProps {
  muscleGroup: MuscleGroup;
}

export default function MuscleChip({ muscleGroup }: MuscleChipProps) {
  return <StyledChip>{muscleGroup}</StyledChip>;
}

const StyledChip = styled.span`
  display: inline-block;
  padding: 2px ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.chip};
  background-color: ${({ theme }) => theme.colors.primaryContainer};
  color: ${({ theme }) => theme.colors.primary};
  font-family: "Barlow Condensed", Inter, sans-serif;
  font-size: ${({ theme }) => theme.typography.labelSmall.fontSize};
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  white-space: nowrap;
`;
