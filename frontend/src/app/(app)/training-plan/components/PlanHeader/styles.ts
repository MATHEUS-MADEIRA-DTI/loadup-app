import styled from "styled-components";

export const StyledHeader = styled.header`
  background: ${({ theme }) => theme.colors.primaryGradient};
  border-radius: 0 0 32px 32px;
  padding: 48px 20px 24px;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const StyledHeaderSub = styled.span`
  font-size: 13px;
  color: rgba(255, 255, 255, 0.75);
  font-weight: 400;
`;

export const StyledTitle = styled.h1`
  font-size: 22px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.onPrimary};
  line-height: 1.2;
`;

export const StyledSummaryRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.xs};
  margin-top: ${({ theme }) => theme.spacing.sm};
`;

export const StyledSummaryBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
  font-weight: 600;
  padding: 4px 12px;
  border-radius: ${({ theme }) => theme.borderRadius.pill};
  background: rgba(255, 255, 255, 0.18);
  color: ${({ theme }) => theme.colors.onPrimary};
`;
