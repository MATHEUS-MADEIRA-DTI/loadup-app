"use client";

import styled from "styled-components";

import { strings } from "@/constants/strings";

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export default function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <StyledWrapper>
      <StyledMessage>{message ?? strings.common.error}</StyledMessage>
      {onRetry && (
        <StyledButton onClick={onRetry}>{strings.common.retry}</StyledButton>
      )}
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.xxl};
  text-align: center;
`;

const StyledMessage = styled.p`
  font-size: ${({ theme }) => theme.typography.bodyMedium.fontSize};
  color: ${({ theme }) => theme.colors.error};
`;

const StyledButton = styled.button`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.lg};
  background-color: ${({ theme }) => theme.colors.primaryContainer};
  color: ${({ theme }) => theme.colors.primary};
  border-radius: ${({ theme }) => theme.borderRadius.pill};
  font-size: ${({ theme }) => theme.typography.labelLarge.fontSize};
  font-weight: ${({ theme }) => theme.typography.labelLarge.fontWeight};
  cursor: pointer;
  border: none;
`;
