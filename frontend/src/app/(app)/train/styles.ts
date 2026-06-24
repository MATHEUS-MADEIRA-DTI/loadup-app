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
  padding: 48px 20px 24px;
  border-radius: ${({ theme }) => theme.borderRadius.header};
`;

export const StyledSubtitle = styled.p`
  font-size: 13px;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 4px;
`;

export const StyledTitle = styled.h1`
  font-size: 26px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.onPrimary};
`;

export const StyledTabBar = styled.div`
  display: flex;
  position: relative;
  background: ${({ theme }) => theme.colors.surface};
  border-bottom: 1px solid ${({ theme }) => theme.colors.outlineVariant};
`;

export const StyledTabBtn = styled.button<{ $active: boolean }>`
  flex: 1;
  padding: 14px 8px;
  background: none;
  border: none;
  font-size: ${({ theme }) => theme.typography.labelLarge.fontSize};
  font-weight: ${({ $active }) => ($active ? 600 : 400)};
  color: ${({ $active, theme }) =>
    $active ? theme.colors.primary : theme.colors.onSurfaceMuted};
  cursor: pointer;
  font-family: inherit;
  transition: color 200ms ease;
`;

export const StyledTabIndicator = styled.div<{ $right: boolean }>`
  position: absolute;
  bottom: 0;
  left: ${({ $right }) => ($right ? "50%" : "0")};
  width: 50%;
  height: 2px;
  background: ${({ theme }) => theme.colors.primary};
  transition: left 200ms ease;
  border-radius: 2px 2px 0 0;
`;

export const StyledTabContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.md};
`;

export const StyledSectionTitle = styled.p`
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.onSurfaceMuted};
  margin-bottom: 4px;
`;

export const StyledEmptyText = styled.p`
  font-size: ${({ theme }) => theme.typography.bodyMedium.fontSize};
  color: ${({ theme }) => theme.colors.onSurfaceMuted};
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xl} 0;
`;

export const StyledDayCardSkeleton = styled.div`
  height: 72px;
  border-radius: ${({ theme }) => theme.borderRadius.inner};
  background: linear-gradient(
    90deg,
    ${({ theme }) => theme.colors.surface} 25%,
    ${({ theme }) => theme.colors.outlineVariant} 50%,
    ${({ theme }) => theme.colors.surface} 75%
  );
  background-size: 800px 100%;
  animation: ${shimmer} 1.4s ease-in-out infinite;
  @media (prefers-reduced-motion: reduce) {
    animation: none;
    background: ${({ theme }) => theme.colors.outlineVariant};
  }
`;

export const StyledCtaArea = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  margin-top: ${({ theme }) => theme.spacing.md};
`;

export const StyledCtaBtn = styled.button<{ $disabled?: boolean }>`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 16px;
  border-radius: ${({ theme }) => theme.borderRadius.pill};
  border: none;
  background: ${({ $disabled, theme }) =>
    $disabled ? theme.colors.outlineVariant : theme.colors.primary};
  color: ${({ theme }) => theme.colors.onPrimary};
  font-size: ${({ theme }) => theme.typography.labelLarge.fontSize};
  font-weight: 700;
  cursor: ${({ $disabled }) => ($disabled ? "not-allowed" : "pointer")};
  font-family: inherit;
  opacity: ${({ $disabled }) => ($disabled ? 0.6 : 1)};
`;

export const StyledCtaTodayDone = styled.div<{ $skipped: boolean }>`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 16px;
  border-radius: ${({ theme }) => theme.borderRadius.pill};
  background: ${({ $skipped, theme }) =>
    $skipped ? theme.colors.errorContainer : theme.colors.successContainer};
  color: ${({ $skipped, theme }) =>
    $skipped ? theme.colors.error : theme.colors.success};
  font-size: ${({ theme }) => theme.typography.labelLarge.fontSize};
  font-weight: 700;
`;

export const StyledTodayStatusCard = styled.div<{ $status: string }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.inner};
  padding: ${({ theme }) => theme.spacing.md};
  box-shadow: ${({ theme }) => theme.shadows.card};
  border: 1.5px solid
    ${({ $status, theme }) =>
      $status === "completed"
        ? theme.colors.success
        : $status === "skipped"
          ? theme.colors.error
          : theme.colors.primary};
`;

export const StyledTodayStatusIcon = styled.div<{ $status: string }>`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ $status, theme }) =>
    $status === "completed"
      ? theme.colors.successContainer
      : $status === "skipped"
        ? theme.colors.errorContainer
        : theme.colors.primaryContainer};
  color: ${({ $status, theme }) =>
    $status === "completed"
      ? theme.colors.success
      : $status === "skipped"
        ? theme.colors.error
        : theme.colors.primary};
`;

export const StyledTodayStatusInfo = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

export const StyledTodayStatusTitle = styled.p`
  font-size: ${({ theme }) => theme.typography.titleMedium.fontSize};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.onSurface};
`;

export const StyledTodayStatusSub = styled.p`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.onSurfaceMuted};
`;

export const StyledTodayStatusMuscles = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-top: 4px;
`;

export const StyledTodayStatusBadge = styled.span<{ $status: string }>`
  font-size: 11px;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: ${({ theme }) => theme.borderRadius.pill};
  flex-shrink: 0;
  background: ${({ $status, theme }) =>
    $status === "completed"
      ? theme.colors.successContainer
      : $status === "skipped"
        ? theme.colors.errorContainer
        : theme.colors.primaryContainer};
  color: ${({ $status, theme }) =>
    $status === "completed"
      ? theme.colors.success
      : $status === "skipped"
        ? theme.colors.error
        : theme.colors.primary};
`;
