import styled from "styled-components";

import { CalendarSessionStatus } from "@/types";

export const StyledSessionList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

export const StyledSessionItem = styled.li`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  cursor: pointer;
  border-radius: ${({ theme }) => theme.borderRadius.chip};
  padding: 4px;
  margin: -4px;
  &:active {
    background: ${({ theme }) => theme.colors.background};
  }
`;

export const StyledSessionIcon = styled.div<{ $status: CalendarSessionStatus }>`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.colors.primaryContainer};
  color: ${({ theme }) => theme.colors.primary};
`;

export const StyledSessionContent = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

export const StyledSessionNameRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
`;

export const StyledSessionName = styled.span`
  font-size: ${({ theme }) => theme.typography.titleMedium.fontSize};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.onSurface};
`;

export const StyledSessionBadge = styled.span<{
  $status: CalendarSessionStatus;
}>`
  font-size: 10px;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: ${({ theme }) => theme.borderRadius.chip};
  background-color: ${({ theme }) => theme.colors.primaryContainer};
  color: ${({ theme }) => theme.colors.primary};
`;

export const StyledSessionMeta = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.onSurfaceMuted};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const StyledSessionDate = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.onSurfaceMuted};
  flex-shrink: 0;
  white-space: nowrap;
`;

export const StyledRecentHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const StyledSectionTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.titleMedium.fontSize};
  font-weight: ${({ theme }) => theme.typography.titleMedium.fontWeight};
  color: ${({ theme }) => theme.colors.onSurface};
`;

export const StyledViewAllBtn = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: ${({ theme }) => theme.typography.labelLarge.fontSize};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
  padding: 0;
  font-family: inherit;
`;
