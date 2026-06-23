import styled from "styled-components";

export const StyledCard = styled.div<{ isAnimating: boolean }>`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.lg};
  background-color: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.outline};
  border-radius: ${({ theme }) => theme.borderRadius.card};
  opacity: ${({ isAnimating }) => (isAnimating ? 0 : 1)};
  transition: opacity 300ms ease-out;
`;

export const ExerciseName = styled.p`
  margin: 0;
  font-size: ${({ theme }) => theme.typography.bodyMedium.fontSize};
  font-weight: ${({ theme }) => theme.typography.bodyMedium.fontWeight};
  color: ${({ theme }) => theme.colors.onSurface};
`;

export const MuscleChipWrapper = styled.div`
  margin-top: ${({ theme }) => theme.spacing.xs};
  display: inline-block;
`;

export const DetectedDate = styled.p`
  margin: ${({ theme }) => `${theme.spacing.sm} 0 0 0`};
  font-size: ${({ theme }) => theme.typography.labelSmall.fontSize};
  color: ${({ theme }) => theme.colors.onSurfaceMuted};
`;

export const StagnationLabel = styled.p`
  margin: ${({ theme }) => `${theme.spacing.sm} 0 0 0`};
  font-size: ${({ theme }) => theme.typography.labelSmall.fontSize};
  font-weight: 500;
  color: ${({ theme }) => theme.colors.onSurfaceMuted};
`;

export const SessionCount = styled.p`
  margin: ${({ theme }) => `${theme.spacing.xs} 0 0 0`};
  font-size: ${({ theme }) => theme.typography.bodyMedium.fontSize};
  color: ${({ theme }) => theme.colors.onSurface};
`;

export const Suggestion = styled.p`
  margin: ${({ theme }) => `${theme.spacing.md} 0 0 0`};
  font-size: ${({ theme }) => theme.typography.bodyMedium.fontSize};
  color: ${({ theme }) => theme.colors.onSurface};
  line-height: 1.5;
`;

export const DismissLink = styled.button`
  align-self: flex-start;
  background: none;
  border: none;
  padding: 0;
  font-size: ${({ theme }) => theme.typography.bodyMedium.fontSize};
  color: ${({ theme }) => theme.colors.primary};
  cursor: pointer;
  text-decoration: underline;
  transition: color 200ms ease-out;

  &:hover {
    color: ${({ theme }) => theme.colors.primaryStrong};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
    border-radius: 2px;
  }
`;
