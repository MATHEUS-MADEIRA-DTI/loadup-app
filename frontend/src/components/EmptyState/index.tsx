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
  background: ${({ theme }) => theme.colors.glassOverlay};
  border: 1px solid ${({ theme }) => theme.colors.outlineVariant};
  border-radius: ${({ theme }) => theme.borderRadius.card};
  box-shadow: ${({ theme }) => theme.shadows.card};
  backdrop-filter: blur(16px);
`;

const StyledTitle = styled.h3`
  font-family: "Barlow Condensed", Inter, sans-serif;
  font-size: 24px;
  font-weight: 900;
  letter-spacing: -0.02em;
  color: ${({ theme }) => theme.colors.onBackground};
`;

const StyledDescription = styled.p`
  font-family: Inter, system-ui, sans-serif;
  font-size: ${({ theme }) => theme.typography.bodyMedium.fontSize};
  color: ${({ theme }) => theme.colors.onBackgroundMuted};
  max-width: 36rem;
`;

const StyledButton = styled.button`
  margin-top: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.lg};
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.onPrimary};
  border-radius: ${({ theme }) => theme.borderRadius.pill};
  font-family: "Barlow Condensed", Inter, sans-serif;
  font-size: ${({ theme }) => theme.typography.labelLarge.fontSize};
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  border: none;
  cursor: pointer;
  transition:
    transform 0.2s ease,
    filter 0.2s ease;

  &:hover {
    transform: translateY(-1px);
    filter: brightness(1.05);
  }
`;
