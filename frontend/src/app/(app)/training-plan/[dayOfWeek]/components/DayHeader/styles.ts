import styled from "styled-components";

export const StyledHeader = styled.header`
  background: ${({ theme }) => theme.colors.background};
  padding: 24px 20px 16px;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

export const StyledTopRow = styled.div`
  display: flex;
  justify-content: flex-start;
`;

export const StyledBreadcrumb = styled.button`
  background: transparent;
  border: none;
  color: ${({ theme }) => theme.colors.primary};
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: ${({ theme }) => theme.borderRadius.circle};
  transition:
    background 200ms ease,
    color 200ms ease,
    transform 200ms ease;

  &:hover {
    background: ${({ theme }) => theme.colors.primaryContainer};
    transform: translateY(-1px);
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }
`;

export const StyledTitle = styled.h1`
  font-family: "Barlow Condensed", Inter, sans-serif;
  font-size: 2.6rem;
  font-weight: 900;
  line-height: 1.03;
  color: ${({ theme }) => theme.colors.onSurface};
  margin: 0;
`;

export const StyledMuscleRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 4px;
`;
