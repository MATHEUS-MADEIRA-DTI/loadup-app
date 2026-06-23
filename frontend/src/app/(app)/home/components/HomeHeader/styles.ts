import styled, { keyframes } from "styled-components";

const shimmer = keyframes`
  0% { background-position: -400px 0; }
  100% { background-position: 400px 0; }
`;

export const StyledHeader = styled.header`
  background: ${({ theme }) => theme.colors.primaryGradient};
  border-radius: 0 0 28px 28px;
  padding: 48px 20px 24px;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

export const StyledHeaderTopRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const StyledAvatarRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

export const StyledAvatar = styled.div`
  width: 42px;
  height: 42px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.18);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.onPrimary};
  flex-shrink: 0;
`;

export const StyledGreetingCol = styled.div`
  display: flex;
  flex-direction: column;
`;

export const StyledGreetingSmall = styled.span`
  font-size: 14px;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.75);
  line-height: 1.2;
`;

export const StyledGreetingName = styled.span`
  font-size: ${({ theme }) => theme.typography.titleLarge.fontSize};
  font-weight: 700;
  color: ${({ theme }) => theme.colors.onPrimary};
  line-height: 1.2;
`;

export const StyledHeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
`;

export const StyledIconButton = styled.button`
  background: rgba(255, 255, 255, 0.15);
  border: none;
  border-radius: 50%;
  width: 38px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.9);
  cursor: pointer;
  font-family: inherit;
  &:active {
    background: rgba(255, 255, 255, 0.25);
  }
`;

export const StyledStatRow = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
`;

export const StyledHeaderSkeleton = styled.div`
  height: 200px;
  border-radius: 0 0 28px 28px;
  background: linear-gradient(90deg, #c4b8e8 25%, #b8ace0 50%, #c4b8e8 75%);
  background-size: 800px 100%;
  animation: ${shimmer} 1.4s infinite;
`;
