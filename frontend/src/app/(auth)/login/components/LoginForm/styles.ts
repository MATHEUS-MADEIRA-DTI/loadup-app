import styled from "styled-components";

export const StyledError = styled.div`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.error};
  background-color: ${({ theme }) => theme.colors.errorContainer};
  border-radius: ${({ theme }) => theme.borderRadius.chip};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  text-align: center;
`;

export const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const StyledFieldWrapper = styled.div`
  position: relative;
  border: 1px solid ${({ theme }) => theme.colors.outline};
  border-radius: 4px;
  background-color: ${({ theme }) => theme.colors.surface};
`;

export const StyledFloatingLabel = styled.label`
  position: absolute;
  top: -9px;
  left: 14px;
  background-color: ${({ theme }) => theme.colors.surface};
  padding: 0 4px;
  font-size: 12px;
  color: ${({ theme }) => theme.colors.onSurfaceMuted};
  line-height: 1;
`;

export const StyledInputRow = styled.div`
  display: flex;
  align-items: center;
  padding: 0 14px;
`;

export const StyledInputIcon = styled.span`
  color: ${({ theme }) => theme.colors.onSurfaceMuted};
  display: flex;
  align-items: center;
  flex-shrink: 0;
  margin-right: 8px;
`;

export const StyledInput = styled.input`
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  padding: 16px 0;
  font-size: 16px;
  color: ${({ theme }) => theme.colors.onSurface};
  font-family: inherit;
  width: 100%;
  &::placeholder {
    color: ${({ theme }) => theme.colors.onBackgroundSubtle};
  }
`;

export const StyledEyeButton = styled.button`
  color: ${({ theme }) => theme.colors.onSurfaceMuted};
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  flex-shrink: 0;
`;

export const StyledSubmitButton = styled.button`
  width: 100%;
  padding: 14px 24px;
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.onPrimary};
  border-radius: 1200px;
  font-size: 16px;
  font-weight: 700;
  border: none;
  cursor: pointer;
  box-shadow: 0px 4px 12px 0px rgba(103, 80, 164, 0.35);
  opacity: ${({ disabled }) => (disabled ? 0.7 : 1)};
  transition: opacity 0.2s ease;
  font-family: inherit;
`;
