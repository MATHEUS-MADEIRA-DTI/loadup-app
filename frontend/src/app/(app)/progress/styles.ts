import styled, { keyframes } from "styled-components";

const shimmer = keyframes`
  0% { background-position: -400px 0; }
  100% { background-position: 400px 0; }
`;

export const StyledPage = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100%;
  background: ${({ theme }) => theme.colors.background};
  padding-bottom: 100px;
`;

export const StyledHeader = styled.header`
  background: ${({ theme }) => theme.colors.surface};
  border-bottom: 1px solid ${({ theme }) => theme.colors.outlineVariant};
  padding: 52px 20px 24px;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

export const StyledHeaderSkeleton = styled.div`
  height: 160px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.outlineVariant};
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

export const StyledSubtitle = styled.p`
  font-size: 13px;
  font-weight: 400;
  color: ${({ theme }) => theme.colors.onSurfaceMuted};
`;

export const StyledTitle = styled.h1`
  font-size: 26px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.onSurface};
  line-height: 1.1;
`;

export const StyledStatRow = styled.div`
  display: flex;
  gap: 0;
  margin-top: ${({ theme }) => theme.spacing.md};
  padding-top: ${({ theme }) => theme.spacing.md};
  border-top: 1px solid ${({ theme }) => theme.colors.outlineVariant};
`;

export const StyledStatPill = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: 0 ${({ theme }) => theme.spacing.xs};
  &:not(:last-child) {
    border-right: 1px solid ${({ theme }) => theme.colors.outlineVariant};
  }
`;

export const StyledPillValue = styled.span`
  font-size: 28px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.onSurface};
  font-variant-numeric: tabular-nums;
  letter-spacing: -0.03em;
  line-height: 1.1;
`;

export const StyledPillLabel = styled.span`
  font-size: 11px;
  font-weight: 400;
  color: ${({ theme }) => theme.colors.onSurfaceMuted};
  text-align: center;
  line-height: 1.4;
  margin-top: 2px;
`;

export const StyledBody = styled.main`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.md};
`;

export const StyledSkeletonCard = styled.div`
  height: 120px;
  border-radius: ${({ theme }) => theme.borderRadius.card};
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
    background: ${({ theme }) => theme.colors.outlineVariant};
  }
`;

export const StyledCard = styled.section`
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.card};
  padding: ${({ theme }) => theme.spacing.lg};
  box-shadow: ${({ theme }) => theme.shadows.card};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

export const StyledSectionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  margin-bottom: 4px;
`;

export const StyledSectionIcon = styled.span`
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.colors.primary};
`;

export const StyledSectionTitle = styled.h2`
  font-size: ${({ theme }) => theme.typography.headlineMedium.fontSize};
  font-weight: ${({ theme }) => theme.typography.headlineMedium.fontWeight};
  color: ${({ theme }) => theme.colors.onSurface};
`;

export const StyledChipScroll = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.xs};
  overflow-x: auto;
  padding-bottom: 4px;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

export const StyledExerciseChip = styled.button<{ $selected: boolean }>`
  flex-shrink: 0;
  padding: 6px 14px;
  border-radius: ${({ theme }) => theme.borderRadius.pill};
  border: 1.5px solid
    ${({ $selected, theme }) =>
      $selected ? theme.colors.primary : theme.colors.outlineVariant};
  background: ${({ $selected, theme }) =>
    $selected ? theme.colors.primary : theme.colors.surface};
  color: ${({ $selected, theme }) =>
    $selected ? theme.colors.onPrimary : theme.colors.onSurface};
  font-size: ${({ theme }) => theme.typography.labelLarge.fontSize};
  font-weight: 500;
  font-family: inherit;
  cursor: pointer;
  transition:
    background 200ms ease,
    border-color 200ms ease,
    color 200ms ease;
  white-space: nowrap;
  &:active {
    opacity: 0.8;
  }
`;

export const StyledPrBanner = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.sm};
  background: ${({ theme }) => theme.colors.primaryContainer};
  border-radius: ${({ theme }) => theme.borderRadius.inner};
  padding: 10px 14px;
`;

export const StyledPrText = styled.span`
  font-size: ${({ theme }) => theme.typography.labelLarge.fontSize};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
  flex: 1;
  display: flex;
  align-items: center;
  gap: 6px;
`;

export const StyledImprovementBadge = styled.span`
  font-size: ${({ theme }) => theme.typography.labelLarge.fontSize};
  font-weight: 700;
  color: ${({ theme }) => theme.colors.success};
  background: ${({ theme }) => theme.colors.successContainer};
  border-radius: ${({ theme }) => theme.borderRadius.pill};
  padding: 3px 10px;
  white-space: nowrap;
`;

export const StyledHint = styled.p`
  font-size: ${({ theme }) => theme.typography.bodyMedium.fontSize};
  color: ${({ theme }) => theme.colors.onSurfaceMuted};
  text-align: center;
  padding: ${({ theme }) => theme.spacing.lg} 0
    ${({ theme }) => theme.spacing.sm};
`;

export const StyledMuscleList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

export const StyledMuscleRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

export const StyledMuscleName = styled.span`
  font-size: ${({ theme }) => theme.typography.bodyMedium.fontSize};
  font-weight: 500;
  color: ${({ theme }) => theme.colors.onSurface};
  width: 80px;
  flex-shrink: 0;
`;

export const StyledMuscleBarWrap = styled.div`
  flex: 1;
  height: 8px;
  border-radius: 4px;
  background: ${({ theme }) => theme.colors.outlineVariant};
  overflow: hidden;
`;

export const StyledMuscleBar = styled.div<{ $pct: number; $bg: string }>`
  height: 100%;
  width: ${({ $pct }) => $pct}%;
  background: ${({ $bg }) => $bg};
  border-radius: 4px;
  transition: width 600ms ease;
`;

export const StyledMuscleCount = styled.span`
  font-size: ${({ theme }) => theme.typography.labelLarge.fontSize};
  color: ${({ theme }) => theme.colors.onSurfaceMuted};
  width: 64px;
  text-align: right;
  flex-shrink: 0;
`;
