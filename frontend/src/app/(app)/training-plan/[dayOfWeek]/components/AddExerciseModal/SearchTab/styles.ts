import styled from "styled-components";

export const SearchContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  min-height: auto;
`;

export const SearchBarWrapper = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
`;

export const SearchInput = styled.input`
  flex: 1;
  height: 48px;
  padding: 0 ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.surfaceElevated};
  border: 1px solid ${({ theme }) => theme.colors.outlineVariant};
  border-radius: ${({ theme }) => theme.borderRadius.chip};
  font-family: var(--font-inter), sans-serif;
  font-size: 15px;
  color: ${({ theme }) => theme.colors.onSurface};
  transition: border-color 200ms ease;

  &::placeholder {
    color: ${({ theme }) => theme.colors.onSurfaceMuted};
  }

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

export const ChipsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.sm};
`;

export const FilterChip = styled.button<{ $isActive: boolean }>`
  padding: 6px 14px;
  background: ${({ theme, $isActive }) =>
    $isActive ? theme.colors.primary : theme.colors.surfaceElevated};
  color: ${({ theme, $isActive }) =>
    $isActive ? theme.colors.onPrimary : theme.colors.onSurfaceMuted};
  border: 1px solid
    ${({ theme, $isActive }) =>
      $isActive ? theme.colors.primary : theme.colors.outlineVariant};
  border-radius: ${({ theme }) => theme.borderRadius.pill};
  font-family: var(--font-barlow), sans-serif;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  cursor: pointer;
  transition: all 200ms ease;

  &:active {
    transform: scale(0.95);
  }
`;

export const ResultsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
  max-height: 500px;
  overflow-y: auto;
  padding-right: ${({ theme }) => theme.spacing.sm};

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.outline};
    border-radius: ${({ theme }) => theme.borderRadius.pill};

    &:hover {
      background: ${({ theme }) => theme.colors.onSurfaceMuted};
    }
  }
`;

export const StateMessage = styled.p`
  font-family: var(--font-inter), sans-serif;
  margin: 0;
  text-align: center;
  padding: ${({ theme }) => theme.spacing.md};
  font-size: 14px;
  color: ${({ theme }) => theme.colors.onSurfaceMuted};
`;

export const ErrorSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.lg};
`;

export const ErrorMessage = styled.p`
  margin: 0;
  text-align: center;
  font-size: ${({ theme }) => theme.typography.bodyMedium.fontSize};
  color: ${({ theme }) => theme.colors.onSurface};
`;

export const RetryButton = styled.button`
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md}`};
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.onPrimary};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.card};
  font-size: ${({ theme }) => theme.typography.bodyMedium.fontSize};
  font-weight: 500;
  cursor: pointer;
  transition: all 200ms ease;

  &:hover {
    background-color: ${({ theme }) =>
      theme.colors.primaryStrong || theme.colors.primary};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }

  &:active {
    transform: scale(0.98);
  }
`;
