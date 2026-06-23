import styled from "styled-components";

export const StyledOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  padding: ${({ theme }) => theme.spacing.sm};
`;

export const StyledModal = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.inner};
  padding: ${({ theme }) => theme.spacing.xl};
  max-width: 500px;
  width: 100%;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  max-height: min(80vh, calc(100vh - 32px));

  @media (max-width: 768px) {
    padding: ${({ theme }) => theme.spacing.lg};
    max-height: min(85vh, calc(100vh - 16px));
  }

  @media (max-width: 480px) {
    padding: ${({ theme }) => theme.spacing.md};
    max-height: min(90vh, calc(100vh - 12px));
  }
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

export const Title = styled.h2`
  margin: 0;
  font-size: ${({ theme }) => theme.typography.headlineMedium.fontSize};
  font-weight: ${({ theme }) => theme.typography.headlineMedium.fontWeight};
  color: ${({ theme }) => theme.colors.onSurface};
`;

export const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  color: ${({ theme }) => theme.colors.onSurfaceMuted};
  cursor: pointer;
  padding: ${({ theme }) => theme.spacing.sm};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 200ms ease-out;

  &:hover {
    color: ${({ theme }) => theme.colors.onSurface};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
    border-radius: 4px;
  }
`;

export const Subtitle = styled.p`
  margin: 0 0 ${({ theme }) => theme.spacing.md} 0;
  font-size: ${({ theme }) => theme.typography.bodyMedium.fontSize};
  color: ${({ theme }) => theme.colors.onSurfaceMuted};
`;

export const DismissAllLink = styled.button`
  align-self: flex-end;
  background: none;
  border: none;
  padding: 0;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  font-size: ${({ theme }) => theme.typography.bodyMedium.fontSize};
  color: ${({ theme }) => theme.colors.primary};
  cursor: pointer;
  text-decoration: underline;
  transition: color 200ms ease-out;

  &:hover {
    color: ${({ theme }) => theme.colors.primaryStrong};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
    border-radius: 2px;
  }
`;

export const AlertList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.outlineVariant};
    border-radius: 3px;

    &:hover {
      background: ${({ theme }) => theme.colors.outline};
    }
  }
`;

export const AlertListItem = styled.li<{ style?: React.CSSProperties }>`
  animation: slideIn 300ms ease-out;
  animation-delay: calc(var(--index, 0) * 50ms);

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;
