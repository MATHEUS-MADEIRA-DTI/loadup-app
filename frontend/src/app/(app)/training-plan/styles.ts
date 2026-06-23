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
`;

export const StyledBody = styled.main`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.md};
  padding-bottom: 96px;
`;

export const StyledSection = styled.section`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

export const StyledSectionTitle = styled.h2`
  font-size: 11px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.onSurfaceMuted};
  text-transform: uppercase;
  letter-spacing: 0.08em;
`;

export const StyledMuscleRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.xs};
`;

export const StyledSkeletonCard = styled.div`
  height: 80px;
  border-radius: ${({ theme }) => theme.borderRadius.inner};
  background: linear-gradient(
    90deg,
    ${({ theme }) => theme.colors.primaryContainer} 25%,
    ${({ theme }) => theme.colors.outlineVariant} 50%,
    ${({ theme }) => theme.colors.primaryContainer} 75%
  );
  background-size: 800px 100%;
  animation: ${shimmer} 1.4s infinite;
`;

export const StyledErrorText = styled.p`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.error};
  text-align: center;
`;
