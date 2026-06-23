import styled from "styled-components";

export const StyledPreviewWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

export const StyledPreviewDayRow = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  color: ${({ theme }) => theme.colors.onSurfaceMuted};
`;

export const StyledPreviewDayLabel = styled.span`
  font-size: 12px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.onSurfaceMuted};
`;

export const StyledPreviewTitle = styled.h3`
  font-size: 18px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.onSurface};
  line-height: 1.2;
`;

export const StyledPreviewList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const StyledPreviewItem = styled.li`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

export const StyledPreviewBullet = styled.span`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.primary};
  flex-shrink: 0;
`;

export const StyledPreviewExName = styled.span`
  flex: 1;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.onSurface};
`;

export const StyledPreviewExSeries = styled.span`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.onSurfaceMuted};
  white-space: nowrap;
`;

export const StyledPreviewOverflow = styled.span`
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
  padding-left: 18px;
`;

export const StyledPreviewFooter = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-top: ${({ theme }) => theme.spacing.xs};
  padding-top: ${({ theme }) => theme.spacing.sm};
  border-top: 1px solid ${({ theme }) => theme.colors.outlineVariant};
`;

export const StyledPreviewStat = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 36px;
`;

export const StyledPreviewStatNum = styled.span`
  font-size: 18px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.onSurface};
  line-height: 1;
`;

export const StyledPreviewStatLabel = styled.span`
  font-size: 10px;
  color: ${({ theme }) => theme.colors.onSurfaceMuted};
  margin-top: 2px;
`;

export const StyledPreviewStatDivider = styled.div`
  width: 1px;
  height: 28px;
  background: ${({ theme }) => theme.colors.outlineVariant};
  margin: 0 4px;
`;

export const StyledPreviewStartBtn = styled.button`
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 6px;
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.onPrimary};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.pill};
  padding: 10px 18px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  font-family: inherit;
  box-shadow: ${({ theme }) => theme.shadows.primary};
  &:active {
    opacity: 0.85;
  }
`;
