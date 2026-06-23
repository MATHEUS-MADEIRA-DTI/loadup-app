import styled from "styled-components";

export const StyledHeader = styled.header`
  background: ${({ theme }) => theme.colors.primaryGradient};
  border-radius: 0 0 32px 32px;
  padding: 48px 20px 24px;
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const StyledBreadcrumb = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: rgba(255, 255, 255, 0.75);
  font-size: 13px;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 0;
  font-family: inherit;
`;

export const StyledTitle = styled.h1`
  font-size: 22px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.onPrimary};
`;

export const StyledMuscleRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
`;
