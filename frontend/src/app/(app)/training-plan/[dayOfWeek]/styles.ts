import styled, { keyframes } from "styled-components";

const shimmer = keyframes`
  0% { background-position: -400px 0; }
  100% { background-position: 400px 0; }
`;

export const StyledPage = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100%;
  background-color: ${({ theme }) => theme.colors.background};
  padding-bottom: 140px;
`;

export const StyledStatsRow = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.md};
  padding-bottom: 0;
`;

export const StyledStatBox = styled.div`
  flex: 1;
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.inner};
  padding: ${({ theme }) => theme.spacing.md};
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  box-shadow: ${({ theme }) => theme.shadows.card};
`;

export const StyledStatNum = styled.span`
  font-size: 28px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
  line-height: 1;
`;

export const StyledStatLabel = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.onSurfaceMuted};
`;

export const StyledBody = styled.main`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.md};
`;

export const StyledSkeletonCard = styled.div`
  height: 120px;
  border-radius: ${({ theme }) => theme.borderRadius.inner};
  background: linear-gradient(90deg, #e8e0f0 25%, #ddd5ec 50%, #e8e0f0 75%);
  background-size: 800px 100%;
  animation: ${shimmer} 1.4s infinite;
`;

export const StyledFab = styled.button`
  position: fixed;
  bottom: 5px;
  right: 20px;
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.primary};
  color: #ffffff;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: ${({ theme }) => theme.shadows.primary};
  z-index: 10;
`;

export const StyledStartBtn = styled.button`
  position: fixed;
  bottom: 80px;
  left: 16px;
  right: 16px;
  height: 52px;
  border-radius: ${({ theme }) => theme.borderRadius.pill};
  background: ${({ theme }) => theme.colors.primary};
  color: #ffffff;
  border: none;
  cursor: pointer;
  font-size: 16px;
  font-weight: 700;
  font-family: inherit;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.sm};
  box-shadow: ${({ theme }) => theme.shadows.primary};
  z-index: 10;
`;
