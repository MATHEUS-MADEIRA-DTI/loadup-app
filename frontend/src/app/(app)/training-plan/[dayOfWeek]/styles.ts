import styled, { keyframes } from "styled-components";

const shimmer = keyframes`
  0% { background-position: -400px 0; }
  100% { background-position: 400px 0; }
`;

export const StyledPage = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100%;
  background: ${({ theme }) => theme.colors.background};
  padding-bottom: 180px;
`;

export const StyledStatsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: ${({ theme }) => theme.spacing.sm};
  padding: 0 ${({ theme }) => theme.spacing.md}
    ${({ theme }) => theme.spacing.md}
`;

export const StyledSectionHeading = styled.h2`
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.onSurfaceMuted};
  padding: ${({ theme }) => theme.spacing.md};
  margin: 0;
`;

export const StyledStatCard = styled.div`
  flex: 1;
  background: ${({ theme }) => theme.colors.surfaceElevated};
  border-radius: ${({ theme }) => theme.borderRadius.inner};
  padding: ${({ theme }) => theme.spacing.lg};
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  box-shadow: ${({ theme }) => theme.shadows.card};
`;

export const StyledStatRing = styled.div`
  width: 84px;
  height: 84px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background:
    radial-gradient(
      circle at top left,
      ${({ theme }) => theme.colors.primaryContainer} 0%,
      transparent 40%
    ),
    conic-gradient(
      ${({ theme }) => theme.colors.primary},
      ${({ theme }) => theme.colors.primaryContainer} 55%,
      ${({ theme }) => theme.colors.primaryContainer} 100%
    );
`;

export const StyledStatRingInner = styled.div`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.surfaceElevated};
  display: grid;
  place-items: center;
`;

export const StyledStatNum = styled.span`
  font-size: 26px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.onSurface};
  line-height: 1;
`;

export const StyledStatTitle = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.onSurfaceMuted};
  text-transform: uppercase;
  letter-spacing: 0.12em;
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
  background: linear-gradient(
    90deg,
    ${({ theme }) => theme.colors.surfaceElevated} 25%,
    ${({ theme }) => theme.colors.outlineVariant} 50%,
    ${({ theme }) => theme.colors.surfaceElevated} 75%
  );
  background-size: 800px 100%;
  animation: ${shimmer} 1.4s infinite;
`;

export const StyledFab = styled.button`
  position: fixed;
  bottom: 88px;
  right: 20px;
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.surfaceElevated};
  border: 1px solid ${({ theme }) => theme.colors.outlineVariant};
  color: ${({ theme }) => theme.colors.primary};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: ${({ theme }) => theme.shadows.card};
  z-index: 10;
  transition: transform 200ms ease;

  &:hover {
    transform: translateY(-2px);
  }
`;

export const StyledStartBtn = styled.button`
  position: fixed;
  bottom: 80px;
  left: 16px;
  right: 80px;
  height: 52px;
  border-radius: ${({ theme }) => theme.borderRadius.pill};
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.onPrimary};
  border: none;
  cursor: pointer;
  font-family: var(--font-barlow), sans-serif;
  font-size: 16px;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.sm};
  box-shadow: ${({ theme }) => theme.shadows.primary};
  z-index: 10;
  transition: transform 200ms ease;

  &:hover {
    transform: translateY(-1px);
  }
`;
