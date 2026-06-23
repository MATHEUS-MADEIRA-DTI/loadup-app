"use client";

import styled, { keyframes } from "styled-components";

import { strings } from "@/constants/strings";

export default function LoadingSpinner() {
  return (
    <StyledWrapper>
      <StyledSpinner />
      <StyledText>{strings.common.loading}</StyledText>
    </StyledWrapper>
  );
}

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

const StyledWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.xxl};
`;

const StyledSpinner = styled.div`
  width: 40px;
  height: 40px;
  border: 3px solid ${({ theme }) => theme.colors.outlineVariant};
  border-top-color: ${({ theme }) => theme.colors.primary};
  border-radius: 50%;
  animation: ${spin} 0.8s linear infinite;
`;

const StyledText = styled.p`
  font-size: ${({ theme }) => theme.typography.bodyMedium.fontSize};
  color: ${({ theme }) => theme.colors.onBackgroundMuted};
`;
