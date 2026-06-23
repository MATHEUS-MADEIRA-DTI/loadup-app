import styled from "styled-components";

export const CsvContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.md};
`;

export const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

export const DownloadButton = styled.button`
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md}`};
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.onPrimary};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.card};
  font-size: ${({ theme }) => theme.typography.labelLarge.fontSize};
  font-weight: ${({ theme }) => theme.typography.labelLarge.fontWeight};
  cursor: pointer;
  transition: background-color 200ms ease;

  &:hover:not(:disabled) {
    background-color: ${({ theme }) => theme.colors.primaryStrong};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const FileInput = styled.input`
  display: none;

  &:not([type="hidden"]) {
    &::-webkit-file-upload-button {
      padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md}`};
      background-color: ${({ theme }) => theme.colors.primary};
      color: ${({ theme }) => theme.colors.onPrimary};
      border: none;
      border-radius: ${({ theme }) => theme.borderRadius.card};
      font-weight: ${({ theme }) => theme.typography.labelLarge.fontWeight};
      cursor: pointer;
    }
  }
`;

export const UploadButton = styled.button`
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md}`};
  background-color: ${({ theme }) => theme.colors.success};
  color: ${({ theme }) => theme.colors.onPrimary};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.card};
  font-size: ${({ theme }) => theme.typography.labelLarge.fontSize};
  font-weight: ${({ theme }) => theme.typography.labelLarge.fontWeight};
  cursor: pointer;
  transition: background-color 200ms ease;

  &:hover:not(:disabled) {
    background-color: ${({ theme }) => theme.colors.successContainer};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const ResultsArea = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
  min-height: 60px;
`;

export const SuccessMessage = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.colors.successContainer};
  color: ${({ theme }) => theme.colors.onSurface};
  border-radius: ${({ theme }) => theme.borderRadius.card};
  font-size: ${({ theme }) => theme.typography.bodyMedium.fontSize};
  font-weight: 500;
`;

export const ErrorList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
  max-height: 300px;
  overflow-y: auto;
`;

export const ErrorItem = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.colors.errorContainer};
  border-radius: ${({ theme }) => theme.borderRadius.card};
  font-size: ${({ theme }) => theme.typography.labelSmall.fontSize};
`;

export const ErrorRow = styled.div`
  color: ${({ theme }) => theme.colors.onSurface};
  margin-bottom: 4px;
`;

export const ErrorField = styled.div`
  color: ${({ theme }) => theme.colors.error};
  font-weight: 500;
  margin-bottom: 2px;
`;

export const ErrorMessage = styled.div`
  color: ${({ theme }) => theme.colors.onSurfaceMuted};
  font-size: 11px;
`;

export const InstructionText = styled.p`
  margin: 0;
  font-size: ${({ theme }) => theme.typography.labelSmall.fontSize};
  color: ${({ theme }) => theme.colors.onSurfaceMuted};
  text-align: center;
`;

export const LoadingIndicator = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 40px;

  &::after {
    content: "";
    width: 20px;
    height: 20px;
    border: 2px solid ${({ theme }) => theme.colors.primary};
    border-top-color: transparent;
    border-radius: 50%;
    animation: spin 0.6s linear infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;
