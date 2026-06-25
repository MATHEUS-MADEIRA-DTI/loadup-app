import styled from "styled-components";

export const StyledRestOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 500;
  background: ${({ theme }) => theme.colors.background};
  opacity: 0.97;
  backdrop-filter: blur(8px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 32px;
`;

export const StyledClockWrapper = styled.div`
  width: 240px;
  height: 240px;
  position: relative;
  display: grid;
  place-items: center;
`;

export const StyledClockSvg = styled.svg`
  width: 240px;
  height: 240px;
`;

export const StyledDigitalTime = styled.p`
  font-family: "Bebas Neue", Inter, sans-serif;
  font-size: 4rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.onSurface};
  letter-spacing: 0.05em;
  margin: 0;
`;

export const StyledRestLabel = styled.p`
  font-family: "Barlow Condensed", Inter, sans-serif;
  font-size: 13px;
  font-weight: 600;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.onSurfaceMuted};
  letter-spacing: 0.15em;
  margin: 0;
`;

export const StyledSkipRestBtn = styled.button`
  padding: 12px 32px;
  border-radius: 999px;
  border: 1px solid ${({ theme }) => theme.colors.onSurfaceMuted};
  background: transparent;
  color: ${({ theme }) => theme.colors.onSurfaceMuted};
  font-family: Inter, sans-serif;
  font-size: 14px;
  font-weight: 400;
  cursor: pointer;
  transition:
    background 150ms ease,
    transform 150ms ease;

  &:hover {
    background: ${({ theme }) => theme.colors.surface};
    transform: translateY(-1px);
  }
`;
