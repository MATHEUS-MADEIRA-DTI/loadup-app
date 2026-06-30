import styled from "styled-components";

export const StyledSeriesRow = styled.div<{
  $logged: boolean;
  $inputsOnly?: boolean;
}>`
  background: ${({ theme, $inputsOnly }) =>
    $inputsOnly ? "transparent" : theme.colors.surfaceElevated};
  border: ${({ theme, $inputsOnly }) =>
    $inputsOnly ? "none" : `1px solid ${theme.colors.outlineVariant}`};
  border-radius: ${({ theme, $inputsOnly }) =>
    $inputsOnly ? "0" : theme.borderRadius.inner};
  padding: ${({ theme, $inputsOnly }) =>
    $inputsOnly ? "0" : theme.spacing.md};
  display: flex;
  flex-direction: column;
  gap: ${({ $inputsOnly }) => ($inputsOnly ? "0" : "18px")};
  transition: ${({ $inputsOnly }) =>
    $inputsOnly ? "none" : "transform 180ms ease"};

  &:hover {
    transform: ${({ $inputsOnly }) =>
      $inputsOnly ? "none" : "translateY(-1px)"};
  }
`;

export const StyledSeriesTopRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
`;

export const StyledSeriesTypeBadge = styled.span<{
  $bg: string;
  $text: string;
}>`
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.16em;
  padding: 6px 12px;
  border-radius: ${({ theme }) => theme.borderRadius.pill};
  background: ${({ $bg }) => $bg};
  color: ${({ $text }) => $text};
  flex-shrink: 0;
`;

export const StyledSeriesName = styled.h3`
  font-family: "Barlow Condensed", Inter, sans-serif;
  font-size: 1rem;
  font-weight: 900;
  margin: 0;
  color: ${({ theme }) => theme.colors.onSurface};
  flex: 1;
`;

export const StyledSeriesGoal = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.onSurfaceMuted};
  text-transform: uppercase;
  letter-spacing: 0.12em;
`;

export const StyledSeriesInputsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;

  @media (max-width: 520px) {
    grid-template-columns: 1fr;
  }
`;

export const StyledCounterCard = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.inner};
  padding: 18px 14px;
  min-height: 170px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 14px;
`;

export const StyledCardLabel = styled.span`
  font-family: "Barlow Condensed", Inter, sans-serif;
  font-size: 11px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.onSurfaceMuted};
  text-transform: uppercase;
  letter-spacing: 0.12em;
`;

export const StyledCardValue = styled.span`
  font-family: "Bebas Neue", Inter, sans-serif;
  font-size: 3rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.onSurface};
  line-height: 1;
  display: block;
  text-align: center;
`;

export const StyledCardControls = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
`;

export const StyledControlBtn = styled.button<{ $filled?: boolean }>`
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 1px solid
    ${({ theme, $filled }) =>
      $filled ? theme.colors.primary : theme.colors.outlineVariant};
  background: ${({ theme, $filled }) =>
    $filled ? theme.colors.primary : theme.colors.surface};
  color: ${({ theme, $filled }) =>
    $filled ? theme.colors.onPrimary : theme.colors.onSurface};
  font-size: 1.3rem;
  display: grid;
  place-items: center;
  cursor: pointer;
  transition:
    background 150ms ease,
    transform 150ms ease;

  &:hover {
    transform: translateY(-1px);
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const StyledActionRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
`;

export const StyledSeriesDots = styled.div`
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 4px;
`;

export const StyledSeriesDot = styled.span<{ $active: boolean }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${({ theme, $active }) =>
    $active ? theme.colors.primary : theme.colors.outlineVariant};
  transition: background 150ms ease;
`;

export const StyledSeriesError = styled.p`
  font-size: 11px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.error};
  text-align: center;
  padding: 2px 0;
  margin: 0;
`;

export const StyledLoggedSummary = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
`;

export const StyledLoggedLabel = styled.span`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.onSurfaceMuted};
  text-transform: uppercase;
  letter-spacing: 0.12em;
`;

export const StyledLoggedValue = styled.span`
  display: block;
  font-size: 1.6rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.onSurface};
  text-align: center;
`;

export const StyledEditPencilBtn = styled.button`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 1.5px solid ${({ theme }) => theme.colors.outlineVariant};
  background: transparent;
  color: ${({ theme }) => theme.colors.onSurfaceMuted};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex-shrink: 0;
  transition:
    border-color 150ms ease,
    color 150ms ease,
    transform 150ms ease;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.primary};
    transform: translateY(-1px);
  }
`;
export const StyledCheckBtn = styled.button<{ $logged: boolean }>`
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: none;
  background: ${({ theme, $logged }) =>
    $logged ? theme.colors.primary : theme.colors.surfaceElevated};
  color: ${({ theme, $logged }) =>
    $logged ? theme.colors.onPrimary : theme.colors.onSurfaceMuted};
  display: grid;
  place-items: center;
  cursor: pointer;
  flex-shrink: 0;
  transition:
    background 150ms ease,
    transform 150ms ease;

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    background: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.onPrimary};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const StyledCardTopRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const StyledNumPadTrigger = styled.button`
  width: 44px;
  height: 44px;
  border-radius: ${({ theme }) => theme.borderRadius.pill};
  border: 1px solid ${({ theme }) => theme.colors.outlineVariant};
  background: transparent;
  color: ${({ theme }) => theme.colors.onSurfaceMuted};
  display: grid;
  place-items: center;
  cursor: pointer;
  flex-shrink: 0;
  transition:
    border-color 150ms ease,
    color 150ms ease;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.primary};
  }
`;

export const StyledFieldLabel = styled.label`
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: ${({ theme }) => theme.colors.onSurfaceMuted};
  font-family: "Barlow Condensed", sans-serif;
`;

export const StyledInput = styled.input`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.outlineVariant};
  border-radius: ${({ theme }) => theme.borderRadius.inner};
  color: ${({ theme }) => theme.colors.onSurface};
  font-family: "Bebas Neue", sans-serif;
  font-size: 1.5rem;
  padding: 8px 12px;
  width: 100%;
  text-align: center;
  outline: none;

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

export const StyledInputField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1;
`;
