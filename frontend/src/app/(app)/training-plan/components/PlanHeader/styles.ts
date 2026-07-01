import styled from "styled-components";

export const StyledHeader = styled.header`
  background: ${({ theme }) => theme.colors.background};
  padding: 24px 20px 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const StyledHeaderSub = styled.span`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.onSurfaceMuted};
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
`;

export const StyledTitle = styled.h1`
  font-size: 22px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.onSurface};
  line-height: 1.2;
`;

export const StyledSummaryRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.xs};
  margin-top: ${({ theme }) => theme.spacing.sm};
`;

export const StyledSummaryBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
  font-weight: 600;
  padding: 4px 12px;
  border-radius: ${({ theme }) => theme.borderRadius.pill};
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.onSurface};
  border: 1px solid ${({ theme }) => theme.colors.outlineVariant};
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

