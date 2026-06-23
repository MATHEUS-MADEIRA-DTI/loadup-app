"use client";

import styled from "styled-components";

interface EmptyStateProps {
  title: string;
  description?: string;
  ctaLabel?: string;
  onCta?: () => void;
}

export default function EmptyState({
  title,
  description,
  ctaLabel,
  onCta,
}: EmptyStateProps) {
  return (
    <StyledWrapper>
      <StyledTitle>{title}</StyledTitle>
      {description && <StyledDescription>{description}</StyledDescription>}
      {ctaLabel && onCta && (
        <StyledButton onClick={onCta}>{ctaLabel}</StyledButton>
      )}
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.xxl}
    ${({ theme }) => theme.spacing.lg};
  text-align: center;
`;

const StyledTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.titleMedium.fontSize};
  font-weight: ${({ theme }) => theme.typography.titleMedium.fontWeight};
  color: ${({ theme }) => theme.colors.onBackground};
`;

const StyledDescription = styled.p`
  font-size: ${({ theme }) => theme.typography.bodyMedium.fontSize};
  color: ${({ theme }) => theme.colors.onBackgroundMuted};
`;

const StyledButton = styled.button`
  margin-top: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.lg};
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.onPrimary};
  border-radius: ${({ theme }) => theme.borderRadius.pill};
  font-size: ${({ theme }) => theme.typography.labelLarge.fontSize};
  font-weight: ${({ theme }) => theme.typography.labelLarge.fontWeight};
  border: none;
  cursor: pointer;
`;
