import styled from "styled-components";

export const ResultCard = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md}`};
  background-color: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.outline};
  border-radius: ${({ theme }) => theme.borderRadius.card};
  cursor: pointer;
  transition:
    background-color 200ms ease,
    border-color 200ms ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.background};
    border-color: ${({ theme }) => theme.colors.primary};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }

  &:active {
    background-color: ${({ theme }) => theme.colors.background};
  }
`;

export const TextContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
  min-width: 0;
`;

export const ExerciseTitle = styled.p`
  margin: 0;
  font-size: ${({ theme }) => theme.typography.labelLarge.fontSize};
  font-weight: ${({ theme }) => theme.typography.bodyMedium.fontWeight};
  color: ${({ theme }) => theme.colors.onSurface};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const VideoLink = styled.a`
  margin: 0;
  font-size: 12px;
  color: ${({ theme }) => theme.colors.primary};
  text-decoration: underline;
  cursor: pointer;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  &[as="span"] {
    color: ${({ theme }) => theme.colors.onSurfaceMuted};
    text-decoration: none;
    cursor: default;
  }
`;

export const TipText = styled.p`
  margin: 0;
  font-size: 11px;
  color: ${({ theme }) => theme.colors.onSurfaceMuted};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const ChipWrapper = styled.div`
  display: flex;
  align-items: center;
  flex-shrink: 0;
`;
