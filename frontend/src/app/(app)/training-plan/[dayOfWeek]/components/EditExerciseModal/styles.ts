import styled from "styled-components";

export const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  margin-top: ${({ theme }) => theme.spacing.sm};
`;

export const StyledFieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

export const StyledLabel = styled.label`
  font-family: var(--font-barlow), sans-serif;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: ${({ theme }) => theme.colors.onSurfaceMuted};
`;

export const StyledInput = styled.input`
  height: 52px;
  padding: 0 ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.outlineVariant};
  border-radius: ${({ theme }) => theme.borderRadius.chip};
  font-family: var(--font-inter), sans-serif;
  font-size: 15px;
  color: ${({ theme }) => theme.colors.onSurface};
  background: ${({ theme }) => theme.colors.surfaceElevated};
  width: 100%;
  box-sizing: border-box;
  transition: border-color 150ms ease;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.onSurfaceMuted};
  }
`;

export const StyledMuscleGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.xs};
`;

export const StyledMuscleChip = styled.button<{ $selected: boolean }>`
  padding: 6px 14px;
  border-radius: ${({ theme }) => theme.borderRadius.pill};
  border: 1.5px solid
    ${({ theme, $selected }) =>
      $selected ? theme.colors.primary : theme.colors.outlineVariant};
  background: ${({ theme, $selected }) =>
    $selected ? theme.colors.primaryContainer : "transparent"};
  color: ${({ theme, $selected }) =>
    $selected ? theme.colors.primary : theme.colors.onSurfaceMuted};
  font-family: var(--font-barlow), sans-serif;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  cursor: pointer;
  transition: all 150ms ease;
`;

export const StyledSeriesRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  padding: ${({ theme }) => theme.spacing.xs} 0;
`;

export const StyledSeriesIndex = styled.span`
  font-size: 12px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.onSurfaceMuted};
  width: 16px;
  flex-shrink: 0;
`;

export const StyledSegmented = styled.div`
  display: flex;
  border: 1px solid ${({ theme }) => theme.colors.outlineVariant};
  border-radius: ${({ theme }) => theme.borderRadius.chip};
  overflow: hidden;
  flex: 1;
`;

export const StyledSegmentBtn = styled.button<{ $active: boolean }>`
  flex: 1;
  padding: 8px 4px;
  border: none;
  background: ${({ theme, $active }) =>
    $active ? theme.colors.primary : "transparent"};
  color: ${({ theme, $active }) =>
    $active ? theme.colors.onPrimary : theme.colors.onSurfaceMuted};
  font-family: var(--font-barlow), sans-serif;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  cursor: pointer;
  transition: all 150ms ease;
`;

export const StyledRepsInput = styled.input`
  width: 52px;
  height: 36px;
  text-align: center;
  border: 1px solid ${({ theme }) => theme.colors.outlineVariant};
  border-radius: ${({ theme }) => theme.borderRadius.chip};
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.onSurface};
  background: ${({ theme }) => theme.colors.background};
  font-family: inherit;
  flex-shrink: 0;
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

export const StyledRemoveBtn = styled.button`
  height: 52px;
  padding: 0 ${({ theme }) => theme.spacing.md};
  border: 1.5px solid ${({ theme }) => theme.colors.error};
  border-radius: ${({ theme }) => theme.borderRadius.pill};
  background: transparent;
  color: ${({ theme }) => theme.colors.error};
  font-family: var(--font-barlow), sans-serif;
  font-size: 15px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  cursor: pointer;
  transition: all 150ms ease;

  &:hover {
    background: ${({ theme }) => theme.colors.errorContainer};
  }
`;

export const StyledAddSeriesBtn = styled.button`
  background: none;
  border: 1.5px dashed ${({ theme }) => theme.colors.outlineVariant};
  border-radius: ${({ theme }) => theme.borderRadius.chip};
  color: ${({ theme }) => theme.colors.primary};
  font-family: var(--font-barlow), sans-serif;
  font-size: 13px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  padding: 10px;
  cursor: pointer;
  width: 100%;
  transition: border-color 150ms ease;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

export const StyledError = styled.p`
  font-size: ${({ theme }) => theme.typography.labelSmall.fontSize};
  color: ${({ theme }) => theme.colors.error};
`;

export const StyledActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-top: ${({ theme }) => theme.spacing.xs};
`;

export const StyledDeleteBtn = styled.button`
  height: 52px;
  padding: 0 ${({ theme }) => theme.spacing.md};
  border: 1.5px solid ${({ theme }) => theme.colors.error};
  border-radius: ${({ theme }) => theme.borderRadius.pill};
  background: transparent;
  color: ${({ theme }) => theme.colors.error};
  font-family: var(--font-barlow), sans-serif;
  font-size: 15px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  cursor: pointer;
  transition: all 150ms ease;

  &:hover {
    background: ${({ theme }) => theme.colors.errorContainer};
  }
`;

export const StyledSubmitBtn = styled.button`
  flex: 1;
  height: 48px;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.pill};
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.onPrimary};
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  font-family: inherit;
  box-shadow: ${({ theme }) => theme.shadows.primary};
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    box-shadow: none;
  }
`;

export const StyledCancelBtn = styled.button`
  flex: 1;
  height: 48px;
  border: 1.5px solid ${({ theme }) => theme.colors.outlineVariant};
  border-radius: ${({ theme }) => theme.borderRadius.pill};
  background: transparent;
  color: ${({ theme }) => theme.colors.onSurface};
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  font-family: inherit;
`;

export const StyledConfirm = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
  padding-top: ${({ theme }) => theme.spacing.sm};
`;

export const StyledConfirmText = styled.p`
  font-size: ${({ theme }) => theme.typography.bodyMedium.fontSize};
  color: ${({ theme }) => theme.colors.onSurface};
  text-align: center;
`;

export const StyledConfirmActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
`;

export const StyledDeleteConfirmBtn = styled.button`
  flex: 1;
  height: 48px;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.pill};
  background: ${({ theme }) => theme.colors.error};
  color: #ffffff;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  font-family: inherit;
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;
