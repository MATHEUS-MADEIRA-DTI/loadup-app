import styled from "styled-components";

export const StyledHeader = styled.header`
  background: ${({ theme }) => theme.colors.background};
  padding: 24px 20px 16px;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

export const StyledTopRow = styled.div`
  display: flex;
  justify-content: flex-start;
`;

export const StyledBreadcrumb = styled.button`
  background: transparent;
  border: none;
  color: ${({ theme }) => theme.colors.primary};
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: ${({ theme }) => theme.borderRadius.avatar};
  transition:
    background 200ms ease,
    color 200ms ease,
    transform 200ms ease;

  &:hover {
    background: ${({ theme }) => theme.colors.primaryContainer};
    transform: translateY(-1px);
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }
`;

export const StyledTitle = styled.h1`
  font-family: "Barlow Condensed", Inter, sans-serif;
  font-size: 2.6rem;
  font-weight: 900;
  line-height: 1.03;
  color: ${({ theme }) => theme.colors.onSurface};
  margin: 0;
`;

export const StyledMuscleRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 4px;
`;

export const StyledReorderBtn = styled.button<{ $active: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 10px 14px;
  border-radius: ${({ theme }) => theme.borderRadius.inner};
  border: 1px solid
    ${({ theme, $active }) =>
      $active ? theme.colors.primary : theme.colors.outlineVariant};
  background: ${({ theme, $active }) =>
    $active ? theme.colors.primaryContainer : theme.colors.surface};
  color: ${({ theme, $active }) =>
    $active ? theme.colors.primary : theme.colors.onSurfaceMuted};
  cursor: pointer;
  font-family: inherit;
  transition:
    background 150ms ease,
    color 150ms ease,
    border-color 150ms ease;
`;

export const StyledReorderLeft = styled.span`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 600;
`;

export const StyledReorderStatus = styled.span<{ $active: boolean }>`
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  opacity: ${({ $active }) => ($active ? 1 : 0.5)};
`;
