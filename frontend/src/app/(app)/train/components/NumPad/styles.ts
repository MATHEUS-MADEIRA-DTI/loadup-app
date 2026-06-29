import styled, { keyframes } from "styled-components";

const slideUp = keyframes`
  from { transform: translateY(100%); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
`;

export const StyledNumPadBackdrop = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
  z-index: 999;
  backdrop-filter: blur(2px);
`;

export const StyledNumPadSheet = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  max-width: 480px;
  margin: 0 auto;
  background: ${({ theme }) => theme.colors.surfaceElevated};
  border-radius: 20px 20px 0 0;
  padding: 20px 16px 32px;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 14px;
  animation: ${slideUp} 280ms cubic-bezier(0.34, 1.56, 0.64, 1);
  box-shadow: 0 -4px 32px rgba(0, 0, 0, 0.3);
`;

export const StyledNumPadHandle = styled.div`
  width: 40px;
  height: 4px;
  border-radius: 999px;
  background: ${({ theme }) => theme.colors.outlineVariant};
  margin: 0 auto 4px;
`;

export const StyledNumPadHeader = styled.span`
  font-family: "Barlow Condensed", Inter, sans-serif;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.16em;
  color: ${({ theme }) => theme.colors.onSurfaceMuted};
  text-align: center;
`;

export const StyledNumPadDisplay = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.outlineVariant};
  border-radius: ${({ theme }) => theme.borderRadius.inner};
  padding: 12px 20px;
  text-align: center;
  min-height: 72px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const StyledNumPadDisplayValue = styled.span`
  font-family: "Bebas Neue", Inter, sans-serif;
  font-size: 3.5rem;
  color: ${({ theme }) => theme.colors.onSurface};
  line-height: 1;
`;

export const StyledNumPadGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
`;

export const StyledNumPadKey = styled.button<{
  $isBackspace?: boolean;
  $isEmpty?: boolean;
}>`
  height: 58px;
  border-radius: ${({ theme }) => theme.borderRadius.inner};
  border: 1px solid ${({ theme }) => theme.colors.outlineVariant};
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme, $isBackspace }) =>
    $isBackspace ? theme.colors.onSurfaceMuted : theme.colors.onSurface};
  font-family: "Barlow Condensed", Inter, sans-serif;
  font-size: 1.6rem;
  font-weight: 700;
  display: grid;
  place-items: center;
  cursor: pointer;
  opacity: ${({ $isEmpty }) => ($isEmpty ? 0 : 1)};
  pointer-events: ${({ $isEmpty }) => ($isEmpty ? "none" : "auto")};
  transition:
    background 100ms ease,
    transform 100ms ease;

  &:active {
    background: ${({ theme }) => theme.colors.outlineVariant};
    transform: scale(0.95);
  }
`;

export const StyledNumPadConfirmBtn = styled.button`
  height: 56px;
  border-radius: ${({ theme }) => theme.borderRadius.pill};
  border: none;
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.onPrimary};
  font-family: "Barlow Condensed", Inter, sans-serif;
  font-size: 1rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  cursor: pointer;
  margin-top: 4px;
  transition:
    background 150ms ease,
    transform 150ms ease;

  &:hover {
    transform: translateY(-1px);
  }

  &:active {
    transform: scale(0.98);
  }
`;
