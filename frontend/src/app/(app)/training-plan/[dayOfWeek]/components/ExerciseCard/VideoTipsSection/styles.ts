import styled from "styled-components";

export const StyledSection = styled.div`
  margin-top: ${({ theme }) => theme.spacing.md};
  border-top: 1px solid ${({ theme }) => theme.colors.outlineVariant};
  padding-top: ${({ theme }) => theme.spacing.md};
`;

export const StyledHeader = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  min-height: 44px;
  padding: ${({ theme }) => theme.spacing.sm} 0;
  background: transparent;
  border: none;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.onSurfaceMuted};
  transition: color 0.2s ease;

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }
`;

export const StyledHeaderIcons = styled.span`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  font-size: 13px;
  font-weight: 500;
`;

export const StyledTabContainer = styled.div`
  display: flex;
  gap: 0;
  margin-top: ${({ theme }) => theme.spacing.md};
  border-bottom: 2px solid ${({ theme }) => theme.colors.outlineVariant};
`;

export const StyledTabButton = styled.button<{ $isActive: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md}`};
  margin-bottom: -2px;
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 13px;
  font-weight: ${({ $isActive }) => ($isActive ? 600 : 400)};
  color: ${({ theme, $isActive }) =>
    $isActive ? theme.colors.primary : theme.colors.onSurfaceMuted};
  border-bottom: 2px solid
    ${({ theme, $isActive }) =>
      $isActive ? theme.colors.primary : "transparent"};
  transition: all 0.2s ease;

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: -2px;
  }
`;

export const StyledTabContent = styled.div`
  padding: ${({ theme }) => theme.spacing.md} 0;
`;

export const StyledVideoContainer = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  background: #1a1a1a;
  border-radius: ${({ theme }) => theme.borderRadius.card};
  overflow: hidden;
  cursor: pointer;
  transition: opacity 0.2s ease;
  text-decoration: none;

  &:hover {
    opacity: 0.9;

    & > div {
      transform: scale(1.1);
    }
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }
`;

export const StyledVideoThumbnail = styled.img`
  position: absolute;
  width: 100%;
  height: 100%;
  object-fit: cover;
  top: 0;
  left: 0;
`;

export const StyledPlayButton = styled.div`
  position: relative;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s ease;

  ${StyledVideoContainer}:hover & {
    transform: scale(1.08);
  }

  svg {
    width: 68px;
    height: 48px;
    filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.5));
  }
`;

export const StyledExerciseName = styled.p`
  margin: ${({ theme }) => theme.spacing.md} 0 0 0;
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.onSurface};
  text-align: center;
`;

export const StyledWatchLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  margin-top: ${({ theme }) => theme.spacing.sm};
  font-size: 12px;
  color: ${({ theme }) => theme.colors.primary};
  text-decoration: underline;
  cursor: pointer;
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 0.8;
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }
`;

export const StyledNoVideo = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.lg};
  background: ${({ theme }) => theme.colors.outlineVariant};
  border-radius: ${({ theme }) => theme.borderRadius.card};
  font-size: 13px;
  color: ${({ theme }) => theme.colors.onSurfaceMuted};
  text-align: center;
  margin: 0;
  min-height: 150px;
`;

export const StyledTipsList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

export const StyledTipItem = styled.li`
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.md};
  min-height: 44px;
  background: ${({ theme }) => theme.colors.outlineVariant};
  border-radius: ${({ theme }) => theme.borderRadius.inner};

  svg {
    flex-shrink: 0;
    margin-top: 1px;
    color: ${({ theme }) => theme.colors.primary};
  }
`;

export const StyledTipText = styled.span`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.onSurface};
  line-height: 1.5;
`;

export const StyledNoTips = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.lg};
  background: ${({ theme }) => theme.colors.outlineVariant};
  border-radius: ${({ theme }) => theme.borderRadius.card};
  font-size: 13px;
  color: ${({ theme }) => theme.colors.onSurfaceMuted};
  text-align: center;
  margin: 0;
  min-height: 100px;
`;
