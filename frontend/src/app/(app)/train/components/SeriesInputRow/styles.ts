import styled from "styled-components";

export const StyledSeriesRow = styled.div<{ $logged: boolean }>`
  background: ${({ $logged, theme }) =>
    $logged ? theme.colors.successContainer : theme.colors.background};
  border-radius: ${({ theme }) => theme.borderRadius.chip};
  padding: ${({ theme }) => theme.spacing.sm};
  display: flex;
  flex-direction: column;
  gap: 8px;
  transition: background 200ms ease;
`;

export const StyledSeriesTopRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const StyledSeriesTypeBadge = styled.span<{
  $bg: string;
  $text: string;
}>`
  font-size: 11px;
  font-weight: 600;
  padding: 3px 8px;
  border-radius: ${({ theme }) => theme.borderRadius.pill};
  background: ${({ $bg }) => $bg};
  color: ${({ $text }) => $text};
  flex-shrink: 0;
`;

export const StyledSeriesName = styled.span`
  font-size: 13px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.onSurface};
  flex: 1;
`;

export const StyledSeriesGoal = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.onSurfaceMuted};
`;

export const StyledSeriesInputsRow = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 6px;
`;

export const StyledInputField = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

export const StyledLoggedField = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
  align-items: center;
`;

export const StyledFieldLabel = styled.label`
  font-size: 10px;
  color: ${({ theme }) => theme.colors.onSurfaceMuted};
  text-align: center;
`;

export const StyledInput = styled.input`
  width: 100%;
  height: 44px;
  text-align: center;
  border: 1px solid ${({ theme }) => theme.colors.outlineVariant};
  border-radius: ${({ theme }) => theme.borderRadius.chip};
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.onSurface};
  background: ${({ theme }) => theme.colors.surface};
  font-family: inherit;
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
  &:disabled {
    opacity: 0.5;
  }
`;

export const StyledLoggedValue = styled.p`
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.success};
`;

export const StyledCheckBtn = styled.button<{ $logged: boolean }>`
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: none;
  background: ${({ $logged, theme }) =>
    $logged ? theme.colors.success : theme.colors.outlineVariant};
  color: ${({ $logged, theme }) =>
    $logged ? theme.colors.onPrimary : theme.colors.onSurfaceMuted};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: ${({ $logged }) => ($logged ? "default" : "pointer")};
  flex-shrink: 0;
  &:disabled {
    opacity: 0.7;
  }
`;

export const StyledEditPencilBtn = styled.button`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 1.5px solid ${({ theme }) => theme.colors.outlineVariant};
  background: transparent;
  color: ${({ theme }) => theme.colors.onSurfaceMuted};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex-shrink: 0;
  align-self: center;
  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.primary};
  }
`;

export const StyledSeriesError = styled.p`
  font-size: 11px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.error};
  text-align: center;
  padding: 2px 0;
`;
