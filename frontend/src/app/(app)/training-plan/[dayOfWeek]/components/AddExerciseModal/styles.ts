import styled from "styled-components";

export const TabContainer = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  border-bottom: 2px solid ${({ theme }) => theme.colors.outline};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

export const TabButton = styled.button<{ $isActive: boolean }>`
  padding: ${({ theme }) => theme.spacing.md};
  background: none;
  border: none;
  cursor: pointer;
  font-size: ${({ theme }) => theme.typography.bodyMedium.fontSize};
  font-weight: ${({ $isActive }) => ($isActive ? 600 : 400)};
  color: ${({ theme, $isActive }) =>
    $isActive ? theme.colors.primary : theme.colors.onSurfaceMuted};
  border-bottom: 3px solid
    ${({ theme, $isActive }) =>
      $isActive ? theme.colors.primary : "transparent"};
  margin-bottom: -2px;
  transition: all 200ms ease;
  font-family: inherit;

  &:hover {
    color: ${({ theme }) => theme.colors.onSurface};
  }
`;

export const TabContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  min-height: auto;
`;

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

  &::placeholder {
    font-family: inherit;
    font-size: inherit;
    color: ${({ theme }) => theme.colors.onSurfaceMuted};
  }

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
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
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.outlineVariant};
  border-radius: ${({ theme }) => theme.borderRadius.inner};
  background: ${({ theme }) => theme.colors.surfaceElevated};
`;

export const StyledSeriesTopRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
`;

export const StyledSeriesBottomRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding-left: 4px;
`;

export const StyledSeriesInputGroup = styled.div<{ $primary?: boolean }>`
  display: flex;
  align-items: center;
  gap: 5px;
  color: ${({ theme, $primary }) =>
    $primary ? theme.colors.primary : theme.colors.onSurfaceMuted};
`;

export const StyledSeriesInputLabel = styled.span`
  font-family: var(--font-barlow), sans-serif;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: ${({ theme }) => theme.colors.onSurfaceMuted};
  white-space: nowrap;
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
  width: 60px;
  height: 40px;
  text-align: center;
  border: 1px solid ${({ theme }) => theme.colors.outlineVariant};
  border-radius: ${({ theme }) => theme.borderRadius.chip};
  font-family: var(--font-bebas), sans-serif;
  font-size: 20px;
  color: ${({ theme }) => theme.colors.onSurface};
  background: ${({ theme }) => theme.colors.background};
  flex-shrink: 0;
  appearance: textfield;

  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

export const StyledSeriesRestInput = styled.input`
  width: 60px;
  height: 40px;
  text-align: center;
  border: 1px solid ${({ theme }) => theme.colors.primary};
  border-radius: ${({ theme }) => theme.borderRadius.chip};
  font-family: var(--font-bebas), sans-serif;
  font-size: 20px;
  color: ${({ theme }) => theme.colors.primary};
  background: ${({ theme }) => theme.colors.primaryContainer};
  flex-shrink: 0;
  appearance: textfield;

  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primary}40;
  }

  &::placeholder {
    font-family: var(--font-inter), sans-serif;
    font-size: 14px;
    color: ${({ theme }) => theme.colors.primary};
    opacity: 0.4;
  }
`;

export const StyledRemoveBtn = styled.button`
  width: 32px;
  height: 32px;
  border: 1px solid ${({ theme }) => theme.colors.outlineVariant};
  background: transparent;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.onSurfaceMuted};
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  flex-shrink: 0;
  transition: all 150ms ease;

  &:hover:not(:disabled) {
    border-color: ${({ theme }) => theme.colors.error};
    color: ${({ theme }) => theme.colors.error};
    background: ${({ theme }) => theme.colors.errorContainer};
  }

  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
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
  margin-top: ${({ theme }) => theme.spacing.sm};
`;

export const StyledCancelBtn = styled.button`
  height: 52px;
  padding: 0 20px;
  border: 1.5px solid ${({ theme }) => theme.colors.outlineVariant};
  border-radius: ${({ theme }) => theme.borderRadius.pill};
  background: transparent;
  color: ${({ theme }) => theme.colors.onSurfaceMuted};
  font-family: var(--font-barlow), sans-serif;
  font-size: 14px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  cursor: pointer;
  white-space: nowrap;
`;

export const StyledSubmitBtn = styled.button`
  flex: 1;
  height: 52px;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.pill};
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.onPrimary};
  font-family: var(--font-barlow), sans-serif;
  font-size: 17px;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  cursor: pointer;
  box-shadow: ${({ theme }) => theme.shadows.primary};
  transition:
    transform 150ms ease,
    opacity 150ms ease;

  &:hover {
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    box-shadow: none;
    transform: none;
  }
`;

export const StyledRestTimeRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

export const StyledRestTimeInput = styled.input`
  width: 88px;
  height: 44px;
  padding: 0 ${({ theme }) => theme.spacing.sm};
  border: 1px solid ${({ theme }) => theme.colors.outlineVariant};
  border-radius: ${({ theme }) => theme.borderRadius.chip};
  font-size: ${({ theme }) => theme.typography.bodyMedium.fontSize};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.onSurface};
  background: ${({ theme }) => theme.colors.background};
  font-family: inherit;
  text-align: center;
  box-sizing: border-box;
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button {
    opacity: 1;
  }
`;

export const StyledRestTimeHint = styled.span`
  font-size: ${({ theme }) => theme.typography.labelSmall.fontSize};
  color: ${({ theme }) => theme.colors.onSurfaceMuted};
  flex: 1;
`;
