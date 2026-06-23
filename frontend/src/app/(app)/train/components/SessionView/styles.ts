import styled, { keyframes } from "styled-components";

const shimmer = keyframes`
  0% { background-position: -400px 0; }
  100% { background-position: 400px 0; }
`;

export const StyledSessionPage = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100%;
  background: ${({ theme }) => theme.colors.background};
  padding-bottom: 90px;
`;

export const StyledSessionHeader = styled.header`
  background: ${({ theme }) => theme.colors.primaryGradient};
  padding: 48px 20px 0;
  border-radius: 0 0 32px 32px;
`;

export const StyledSessionTopRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
`;

export const StyledBackBtn = styled.button`
  background: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.onPrimary};
  cursor: pointer;
  flex-shrink: 0;
`;

export const StyledSessionStatusText = styled.p`
  font-size: 13px;
  color: rgba(255, 255, 255, 0.8);
  flex: 1;
`;

export const StyledProgressCounter = styled.p`
  font-size: 15px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.onPrimary};
  background: rgba(255, 255, 255, 0.2);
  padding: 4px 10px;
  border-radius: ${({ theme }) => theme.borderRadius.pill};
`;

export const StyledSessionDayName = styled.h1`
  font-size: 26px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.onPrimary};
  padding-bottom: 20px;
`;

export const StyledProgressBarTrack = styled.div`
  height: 4px;
  background: rgba(255, 255, 255, 0.25);
  border-radius: 2px;
  margin: 0 -20px;
  overflow: hidden;
`;

export const StyledProgressBarFill = styled.div<{ $pct: number }>`
  height: 100%;
  width: ${({ $pct }) => $pct}%;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 2px;
  transition: width 400ms ease;
`;

export const StyledSessionBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.md};
`;

export const StyledExerciseSkeleton = styled.div`
  height: 200px;
  border-radius: ${({ theme }) => theme.borderRadius.inner};
  background: linear-gradient(90deg, ${({ theme }) => theme.colors.surface} 25%, ${({ theme }) => theme.colors.outlineVariant} 50%, ${({ theme }) => theme.colors.surface} 75%);
  background-size: 800px 100%;
  animation: ${shimmer} 1.4s ease-in-out infinite;
`;

export const StyledExerciseSection = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.inner};
  padding: ${({ theme }) => theme.spacing.md};
  box-shadow: ${({ theme }) => theme.shadows.card};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

export const StyledExerciseHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

export const StyledExerciseNum = styled.div`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.primaryContainer};
  color: ${({ theme }) => theme.colors.primary};
  font-size: 13px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

export const StyledExerciseInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

export const StyledExerciseName = styled.p`
  font-size: ${({ theme }) => theme.typography.titleMedium.fontSize};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.onSurface};
`;

export const StyledSeriesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

export const StyledDoneBanner = styled.div<{ $skipped: boolean }>`
  margin: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.inner};
  background: ${({ $skipped, theme }) => $skipped ? "#FDECEA" : theme.colors.successContainer};
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
`;

export const StyledDoneBannerIcon = styled.span`
  font-size: 28px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.success};
`;

export const StyledDoneBannerText = styled.p`
  font-size: ${({ theme }) => theme.typography.titleMedium.fontSize};
  font-weight: 700;
  color: ${({ theme }) => theme.colors.onSurface};
`;

export const StyledDoneBannerSub = styled.p`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.onSurfaceMuted};
`;

export const StyledEmptyText = styled.p`
  font-size: ${({ theme }) => theme.typography.bodyMedium.fontSize};
  color: ${({ theme }) => theme.colors.onSurfaceMuted};
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xl} 0;
`;

export const StyledReadOnlyNotice = styled.p`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.onSurfaceMuted};
  text-align: center;
  font-style: italic;
  padding: ${({ theme }) => theme.spacing.md};
`;

export const StyledSessionBottomBar = styled.div`
  position: fixed;
  bottom: 80px;
  left: 0;
  right: 0;
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: 12px ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.surface};
  border-top: 1px solid ${({ theme }) => theme.colors.outlineVariant};
  max-width: 430px;
  margin: 0 auto;
`;

export const StyledSkipBtn = styled.button`
  flex: 0 0 auto;
  padding: 14px 20px;
  border-radius: ${({ theme }) => theme.borderRadius.pill};
  border: 1.5px solid ${({ theme }) => theme.colors.error};
  background: transparent;
  color: ${({ theme }) => theme.colors.error};
  font-size: ${({ theme }) => theme.typography.labelLarge.fontSize};
  font-weight: 600;
  cursor: pointer;
  font-family: inherit;
  &:disabled { opacity: 0.5; }
`;

export const StyledConcludeBtn = styled.button`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 14px;
  border-radius: ${({ theme }) => theme.borderRadius.pill};
  border: none;
  background: ${({ theme }) => theme.colors.success};
  color: #fff;
  font-size: ${({ theme }) => theme.typography.labelLarge.fontSize};
  font-weight: 700;
  cursor: pointer;
  font-family: inherit;
  &:disabled { opacity: 0.5; }
`;
