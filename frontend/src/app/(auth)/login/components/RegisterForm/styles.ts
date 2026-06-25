import styled from "styled-components";

export const StyledError = styled.div`
  font-family: var(--font-inter), sans-serif;
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
  gap: 12px;
`;

export const StyledFieldWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const StyledFloatingLabel = styled.label`
  font-family: var(--font-inter), sans-serif;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #64748b;
  padding-left: 4px;
`;

export const StyledInputRow = styled.div`
  height: 52px;
  border-radius: 12px;
  background: #1e293b;
  border: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  align-items: center;
  padding: 0 14px;
  gap: 10px;
  transition: border-color 200ms ease;

  &:focus-within {
    border-color: #3b82f6;
  }
`;

export const StyledInputIcon = styled.span`
  color: ${({ theme }) => theme.colors.onSurfaceMuted};
  display: flex;
  align-items: center;
  flex-shrink: 0;
`;

export const StyledInput = styled.input`
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  font-family: var(--font-inter), sans-serif;
  font-size: 15px;
  color: #f8fafc;

  &::placeholder {
    color: #64748b;
  }
`;

export const StyledEyeButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.onSurfaceMuted};
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 0;
  flex-shrink: 0;
  transition: color 150ms ease;

  &:hover {
    color: ${({ theme }) => theme.colors.onSurface};
  }
`;

export const StyledSubmitButton = styled.button`
  margin-top: 8px;
  width: 100%;
  height: 56px;
  border-radius: ${({ theme }) => theme.borderRadius.pill};
  border: none;
  background: #3b82f6;
  color: #ffffff;
  box-shadow: 0 0 24px rgba(59, 130, 246, 0.4);
  font-family: var(--font-barlow), sans-serif;
  font-weight: 900;
  font-size: 17px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  cursor: pointer;
  transition:
    transform 180ms ease,
    opacity 180ms ease;

  &:hover {
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;
