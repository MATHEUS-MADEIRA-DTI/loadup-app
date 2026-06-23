"use client";

import styled from "styled-components";

import { strings } from "@/constants/strings";
import { Series } from "@/types";

interface SeriesRowProps {
  series: Series;
  index: number;
}

export default function SeriesRow({ series, index }: SeriesRowProps) {
  const typeLabel = strings.exercises.seriesType[series.type] ?? series.type;

  return (
    <StyledRow>
      <StyledIndex>{index + 1}</StyledIndex>
      <StyledTypeBadge $type={series.type}>{typeLabel}</StyledTypeBadge>
      <StyledReps>{series.reps} reps</StyledReps>
    </StyledRow>
  );
}

const StyledRow = styled.li`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const StyledIndex = styled.span`
  font-size: ${({ theme }) => theme.typography.labelSmall.fontSize};
  font-weight: ${({ theme }) => theme.typography.labelSmall.fontWeight};
  color: ${({ theme }) => theme.colors.onBackgroundMuted};
  min-width: 16px;
`;

const StyledTypeBadge = styled.span<{ $type: string }>`
  font-size: ${({ theme }) => theme.typography.labelSmall.fontSize};
  font-weight: ${({ theme }) => theme.typography.titleMedium.fontWeight};
  color: ${({ theme }) => theme.colors.onSurface};
  background-color: ${({ theme }) => theme.colors.primaryContainer};
  border-radius: ${({ theme }) => theme.borderRadius.chip};
  padding: 2px ${({ theme }) => theme.spacing.sm};
`;

const StyledReps = styled.span`
  font-size: ${({ theme }) => theme.typography.bodyMedium.fontSize};
  color: ${({ theme }) => theme.colors.onSurfaceMuted};
`;
