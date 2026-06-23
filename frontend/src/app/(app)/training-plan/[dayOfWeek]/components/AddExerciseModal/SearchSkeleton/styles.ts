import styled, { keyframes } from "styled-components";

const shimmer = keyframes`
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
`;

export const SkeletonContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

export const SkeletonItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.card};
  background: linear-gradient(
    90deg,
    ${({ theme }) => theme.colors.outline} 25%,
    ${({ theme }) => theme.colors.surface} 50%,
    ${({ theme }) => theme.colors.outline} 75%
  );
  background-size: 1000px 100%;
  animation: ${shimmer} 2s infinite;

  &::before {
    content: "";
    width: 40px;
    height: 40px;
    border-radius: ${({ theme }) => theme.borderRadius.pill};
    background-color: ${({ theme }) => theme.colors.outline};
    flex-shrink: 0;
  }

  &::after {
    content: "";
    flex: 1;
    height: 16px;
    border-radius: ${({ theme }) => theme.borderRadius.inner};
    background-color: ${({ theme }) => theme.colors.outline};
  }
`;
