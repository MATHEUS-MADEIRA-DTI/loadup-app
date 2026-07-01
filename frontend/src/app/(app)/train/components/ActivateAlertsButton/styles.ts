import styled from "styled-components";

export const StyledActivateAlertsBtn = styled.button<{ $active: boolean }>`
  width: 100%;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border-radius: 999px;
  border: 1px solid
    ${({ theme, $active }) =>
      $active ? theme.colors.primary : theme.colors.outlineVariant};
  background: ${({ theme, $active }) =>
    $active ? theme.colors.surfaceElevated : "transparent"};
  color: ${({ theme, $active }) =>
    $active ? theme.colors.primary : theme.colors.onSurfaceMuted};
  font-family: "Barlow Condensed", Inter, sans-serif;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  cursor: pointer;
  transition:
    background 180ms ease,
    border-color 180ms ease,
    color 180ms ease;

  &:disabled {
    cursor: default;
    opacity: 0.8;
  }
`;
