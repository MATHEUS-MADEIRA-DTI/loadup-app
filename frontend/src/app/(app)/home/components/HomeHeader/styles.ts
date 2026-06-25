import styled, { keyframes } from "styled-components";

const shimmer = keyframes`
  0% { background-position: -400px 0; }
  100% { background-position: 400px 0; }
`;

export const StyledHeader = styled.header`
  background: ${({ theme }) => theme.colors.background};
  padding: ${({ theme }) => theme.spacing.lg};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

export const StyledHeaderTopRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.sm};
`;

export const StyledAvatarRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

export const StyledAvatar = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.primaryContainer};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
  flex-shrink: 0;
  border: 1.5px solid ${({ theme }) => theme.colors.outlineVariant};
`;

export const StyledGreetingCol = styled.div`
  display: flex;
  flex-direction: column;
`;

export const StyledGreetingSmall = styled.span`
  font-size: 13px;
  font-weight: 400;
  color: ${({ theme }) => theme.colors.onSurfaceMuted};
  line-height: 1.2;
`;

export const StyledGreetingName = styled.span`
  font-family: "Barlow Condensed", Inter, sans-serif;
  font-size: 24px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.onSurface};
  line-height: 1.1;
`;

export const StyledHeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
`;

export const StyledIconButton = styled.button`
  background: transparent;
  border: 1.5px solid ${({ theme }) => theme.colors.outlineVariant};
  border-radius: 50%;
  width: 38px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.onSurface};
  cursor: pointer;
  font-family: inherit;
  transition: background 150ms ease;
  &:hover {
    background: ${({ theme }) => theme.colors.background};
  }
  &:active {
    opacity: 0.7;
  }
`;

export const StyledStatRow = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
`;

export const StyledHeaderSkeleton = styled.div`
  height: 180px;
  background: linear-gradient(
    90deg,
    ${({ theme }) => theme.colors.surface} 25%,
    ${({ theme }) => theme.colors.outlineVariant} 50%,
    ${({ theme }) => theme.colors.surface} 75%
  );
  background-size: 800px 100%;
  animation: ${shimmer} 1.4s infinite;
  @media (prefers-reduced-motion: reduce) {
    animation: none;
    background: ${({ theme }) => theme.colors.outlineVariant};
  }
`;
