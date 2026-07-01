import styled, { keyframes } from "styled-components";

const slideUp = keyframes`
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
`;

export const StyledBackdrop = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  z-index: 999;
`;

export const StyledSheet = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  max-width: 480px;
  margin: 0 auto;
  background: ${({ theme }) => theme.colors.surfaceElevated};
  border-radius: 24px 24px 0 0;
  border-top: 1px solid ${({ theme }) => theme.colors.outlineVariant};
  padding: 12px 24px 40px;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  text-align: center;
  animation: ${slideUp} 320ms cubic-bezier(0.16, 1, 0.3, 1);
  box-shadow: 0 -8px 40px rgba(0, 0, 0, 0.4);
`;

export const StyledHandle = styled.div`
  width: 40px;
  height: 4px;
  border-radius: 999px;
  background: transparent;
  margin: 0 auto 8px;
  @media (max-width: 768px) {
    background: ${({ theme }) => theme.colors.outlineVariant};
  }
`;

export const StyledCloseBtn = styled.button`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 1px solid ${({ theme }) => theme.colors.outlineVariant};
  background: transparent;
  color: ${({ theme }) => theme.colors.onSurfaceMuted};
  display: grid;
  place-items: center;
  cursor: pointer;
  align-self: flex-end;
  @media (max-width: 768px) {
    display: none;
  }
`;

export const StyledIconWrapper = styled.div`
  width: 56px;
  height: 56px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: ${({ theme }) => theme.colors.primaryContainer};
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 4px;
`;

export const StyledTitle = styled.h2`
  font-family: "Barlow Condensed", Inter, sans-serif;
  font-weight: 900;
  font-size: 22px;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: ${({ theme }) => theme.colors.onSurface};
  margin: 0;
`;

export const StyledMessage = styled.p`
  font-family: Inter, sans-serif;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.onSurfaceMuted};
  line-height: 1.5;
  margin: 0 0 8px;
`;

export const StyledActionsRow = styled.div`
  display: flex;
  gap: 10px;
  width: 100%;
`;

export const StyledDismissBtn = styled.button`
  height: 52px;
  padding: 0 20px;
  border-radius: ${({ theme }) => theme.borderRadius.pill};
  border: 1.5px solid ${({ theme }) => theme.colors.outlineVariant};
  background: transparent;
  color: ${({ theme }) => theme.colors.onSurfaceMuted};
  font-family: "Barlow Condensed", Inter, sans-serif;
  font-weight: 700;
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  cursor: pointer;
  white-space: nowrap;

  &:disabled {
    opacity: 0.6;
    cursor: default;
  }
`;

export const StyledConfirmBtn = styled.button`
  flex: 1;
  height: 52px;
  border-radius: ${({ theme }) => theme.borderRadius.pill};
  border: none;
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.onPrimary};
  font-family: "Barlow Condensed", Inter, sans-serif;
  font-weight: 900;
  font-size: 16px;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  cursor: pointer;
  box-shadow: ${({ theme }) => theme.shadows.primary};

  &:disabled {
    opacity: 0.7;
    cursor: default;
  }
`;
