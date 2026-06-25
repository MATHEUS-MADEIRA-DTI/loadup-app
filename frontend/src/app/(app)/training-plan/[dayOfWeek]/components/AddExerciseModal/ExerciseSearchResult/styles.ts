import styled from "styled-components";

export const ResultCard = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: 12px ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.surfaceElevated};
  border: 1px solid ${({ theme }) => theme.colors.outlineVariant};
  border-radius: ${({ theme }) => theme.borderRadius.inner};
  cursor: pointer;
  transition: all 200ms ease;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    background: ${({ theme }) => theme.colors.primaryContainer};
  }

  &:active {
    transform: scale(0.98);
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
  font-family: var(--font-inter), sans-serif;
  font-size: 15px;
  font-weight: 600;
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
  font-family: var(--font-inter), sans-serif;
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
