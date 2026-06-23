import styled from "styled-components";

export const StyledBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  margin-top: ${({ theme }) => theme.spacing.sm};
`;

export const StyledMessage = styled.p`
  font-size: ${({ theme }) => theme.typography.bodyMedium.fontSize};
  color: ${({ theme }) => theme.colors.onSurfaceMuted};
  line-height: 1.5;
`;

export const StyledActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  justify-content: flex-end;
`;

export const StyledCancelBtn = styled.button`
  padding: 10px 20px;
  border-radius: ${({ theme }) => theme.borderRadius.pill};
  border: 1px solid ${({ theme }) => theme.colors.outlineVariant};
  background: transparent;
  color: ${({ theme }) => theme.colors.onSurface};
  font-size: ${({ theme }) => theme.typography.labelLarge.fontSize};
  font-weight: 500;
  cursor: pointer;
  font-family: inherit;
`;

export const StyledDeleteBtn = styled.button`
  padding: 10px 20px;
  border-radius: ${({ theme }) => theme.borderRadius.pill};
  border: none;
  background: ${({ theme }) => theme.colors.error};
  color: #fff;
  font-size: ${({ theme }) => theme.typography.labelLarge.fontSize};
  font-weight: 600;
  cursor: pointer;
  font-family: inherit;
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;
