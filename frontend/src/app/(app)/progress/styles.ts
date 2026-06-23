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
  background: ${({ theme }) => theme.colors.primaryGradient};
  padding: 48px 20px 28px;
  border-radius: 0 0 32px 32px;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

export const StyledHeaderSkeleton = styled.div`
  height: 180px;
  border-radius: 0 0 32px 32px;
  background: linear-gradient(90deg, ${({ theme }) => theme.colors.primaryContainer} 25%, ${({ theme }) => theme.colors.outlineVariant} 50%, ${({ theme }) => theme.colors.primaryContainer} 75%);
  background-size: 800px 100%;
  animation: ${shimmer} 1.4s infinite;
`;

export const StyledSubtitle = styled.p`
  font-size: 13px;
  color: rgba(255, 255, 255, 0.7);
`;

export const StyledTitle = styled.h1`
  font-size: ${({ theme }) => theme.typography.displayLarge.fontSize};
  font-weight: ${({ theme }) => theme.typography.displayLarge.fontWeight};
  color: ${({ theme }) => theme.colors.onPrimary};
  line-height: 1.1;
`;

export const StyledStatRow = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-top: ${({ theme }) => theme.spacing.xs};
`;

export const StyledStatPill = styled.div`
  flex: 1;
  background: rgba(255, 255, 255, 0.18);
  backdrop-filter: blur(8px);
  border-radius: ${({ theme }) => theme.borderRadius.inner};
  padding: 10px 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
`;

export const StyledPillValue = styled.span`
  font-size: ${({ theme }) => theme.typography.headlineMedium.fontSize};
  font-weight: ${({ theme }) => theme.typography.headlineMedium.fontWeight};
  color: ${({ theme }) => theme.colors.onPrimary};
`;

export const StyledPillLabel = styled.span`
  font-size: ${({ theme }) => theme.typography.labelSmall.fontSize};
  font-weight: ${({ theme }) => theme.typography.labelSmall.fontWeight};
  color: rgba(255, 255, 255, 0.75);
  text-align: center;
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
  background: linear-gradient(90deg, ${({ theme }) => theme.colors.primaryContainer} 25%, ${({ theme }) => theme.colors.outlineVariant} 50%, ${({ theme }) => theme.colors.primaryContainer} 75%);
  background-size: 800px 100%;
  animation: ${shimmer} 1.4s infinite;
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
  &::-webkit-scrollbar { display: none; }
`;

export const StyledExerciseChip = styled.button<{ $selected: boolean }>`
  flex-shrink: 0;
  padding: 6px 14px;
  border-radius: ${({ theme }) => theme.borderRadius.pill};
  border: 1.5px solid ${({ $selected, theme }) => $selected ? theme.colors.primary : theme.colors.outlineVariant};
  background: ${({ $selected, theme }) => $selected ? theme.colors.primary : theme.colors.surface};
  color: ${({ $selected, theme }) => $selected ? theme.colors.onPrimary : theme.colors.onSurface};
  font-size: ${({ theme }) => theme.typography.labelLarge.fontSize};
  font-weight: 500;
  font-family: inherit;
  cursor: pointer;
  transition: background 200ms ease, border-color 200ms ease, color 200ms ease;
  white-space: nowrap;
  &:active { opacity: 0.8; }
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
  padding: ${({ theme }) => theme.spacing.lg} 0 ${({ theme }) => theme.spacing.sm};
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
