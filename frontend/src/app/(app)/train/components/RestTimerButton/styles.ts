import styled from "styled-components";

export const StyledRestBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.xs};
  width: 100%;
  height: 40px;
  border: 1.5px solid ${({ theme }) => theme.colors.outlineVariant};
  border-radius: ${({ theme }) => theme.borderRadius.pill};
  background: transparent;
  color: ${({ theme }) => theme.colors.onSurfaceMuted};
  font-size: ${({ theme }) => theme.typography.labelLarge.fontSize};
  font-weight: 600;
  cursor: pointer;
  font-family: inherit;
  transition: all 150ms ease;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.primary};
  }
`;

export const StyledTimerWrap = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border: 1.5px solid ${({ theme }) => theme.colors.primary};
  border-radius: ${({ theme }) => theme.borderRadius.pill};
  background: ${({ theme }) => theme.colors.primaryContainer};
`;

export const StyledTimerDisplay = styled.span`
  flex: 1;
  text-align: center;
  font-size: 22px;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  letter-spacing: 2px;
  color: ${({ theme }) => theme.colors.primary};
`;

export const StyledCancelBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  background: none;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.onSurfaceMuted};
  font-size: 18px;
  border-radius: 50%;
  flex-shrink: 0;
  font-family: inherit;
  transition: color 150ms ease;

  &:hover {
    color: ${({ theme }) => theme.colors.error};
  }
`;

export const StyledFinishedWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.xs};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.pill};
  background: ${({ theme }) => theme.colors.successContainer};
  cursor: pointer;
`;

export const StyledFinishedMsg = styled.span`
  font-size: ${({ theme }) => theme.typography.labelLarge.fontSize};
  font-weight: 700;
  color: ${({ theme }) => theme.colors.success};
`;
