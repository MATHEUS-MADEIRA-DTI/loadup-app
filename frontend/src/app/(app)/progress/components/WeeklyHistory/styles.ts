import styled, { keyframes } from "styled-components";

const shimmer = keyframes`
  0% { background-position: -400px 0; }
  100% { background-position: 400px 0; }
`;

export const StyledList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

export const StyledEmptyChip = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: 10px 12px;
  border-radius: ${({ theme }) => theme.borderRadius.inner};
  border: 1px dashed ${({ theme }) => theme.colors.outlineVariant};
  opacity: 0.6;
`;

export const StyledEmptyDot = styled.span`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.outlineVariant};
  flex-shrink: 0;
`;

export const StyledEmptyLabel = styled.span`
  font-size: ${({ theme }) => theme.typography.labelLarge.fontSize};
  color: ${({ theme }) => theme.colors.onSurfaceMuted};
`;

export const StyledDayCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 12px;
  border-radius: ${({ theme }) => theme.borderRadius.inner};
  background: ${({ theme }) => theme.colors.surface};
`;

export const StyledDayHeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.sm};
`;

export const StyledDayLabel = styled.span`
  font-size: ${({ theme }) => theme.typography.labelLarge.fontSize};
  font-weight: 700;
  color: ${({ theme }) => theme.colors.onSurface};
  text-transform: uppercase;
  letter-spacing: 0.04em;
`;

export const StyledStatusBadge = styled.span<{ $good: boolean }>`
  flex-shrink: 0;
  padding: 3px 10px;
  border-radius: ${({ theme }) => theme.borderRadius.pill};
  font-size: 11px;
  font-weight: 700;
  background: ${({ theme, $good }) =>
    $good ? theme.colors.successContainer : theme.colors.outlineVariant};
  color: ${({ theme, $good }) =>
    $good ? theme.colors.success : theme.colors.onSurfaceMuted};
`;

export const StyledExerciseNames = styled.p`
  font-size: ${({ theme }) => theme.typography.bodyMedium.fontSize};
  color: ${({ theme }) => theme.colors.onSurface};
  line-height: 1.4;
`;

export const StyledStatsRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

export const StyledStatItem = styled.span`
  font-size: ${({ theme }) => theme.typography.labelLarge.fontSize};
  color: ${({ theme }) => theme.colors.onSurfaceMuted};

  &:not(:last-child)::after {
    content: "·";
    margin-left: ${({ theme }) => theme.spacing.sm};
    color: ${({ theme }) => theme.colors.outlineVariant};
  }
`;

export const StyledSkeletonCard = styled.div`
  height: 64px;
  border-radius: ${({ theme }) => theme.borderRadius.inner};
  background: linear-gradient(
    90deg,
    ${({ theme }) => theme.colors.surface} 25%,
    ${({ theme }) => theme.colors.outlineVariant} 50%,
    ${({ theme }) => theme.colors.surface} 75%
  );
  background-size: 800px 100%;
  animation: ${shimmer} 1.4s infinite;
  @media (prefers-reduced-motion: reduce) {
    animation: none;
    background: ${({ theme }) => theme.colors.surface};
  }
`;
