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
  background: ${({ theme }) => theme.colors.glassOverlay};
  border: 1px solid ${({ theme }) => theme.colors.errorContainer};
  border-radius: ${({ theme }) => theme.borderRadius.card};
  box-shadow: ${({ theme }) => theme.shadows.card};
  backdrop-filter: blur(16px);
`;

const StyledMessage = styled.p`
  font-family: "Barlow Condensed", Inter, sans-serif;
  font-size: ${({ theme }) => theme.typography.titleMedium.fontSize};
  font-weight: 700;
  color: ${({ theme }) => theme.colors.error};
  text-transform: uppercase;
  letter-spacing: 0.06em;
`;

const StyledButton = styled.button`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.lg};
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.onPrimary};
  border-radius: ${({ theme }) => theme.borderRadius.pill};
  font-family: "Barlow Condensed", Inter, sans-serif;
  font-size: ${({ theme }) => theme.typography.labelLarge.fontSize};
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  cursor: pointer;
  border: none;
  transition:
    transform 0.2s ease,
    filter 0.2s ease;

  &:hover {
    transform: translateY(-1px);
    filter: brightness(1.05);
  }
`;
