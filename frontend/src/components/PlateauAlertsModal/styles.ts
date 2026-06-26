import styled from "styled-components";

export const StyledOverlay = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  padding: ${({ theme }) => theme.spacing.md};
`;

export const StyledModal = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.inner};
  padding: ${({ theme }) => theme.spacing.xl};
  width: 100%;
  max-width: 500px;
  max-height: min(85vh, calc(100vh - 32px));
  display: flex;
  flex-direction: column;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
  overflow: hidden;

  @media (max-width: 768px) {
    padding: ${({ theme }) => theme.spacing.lg};
    max-height: min(85vh, calc(100vh - 16px));
  }

  @media (max-width: 480px) {
    padding: ${({ theme }) => theme.spacing.md};
    max-height: min(90vh, calc(100vh - 12px));
  }
`;
export const Toast = styled.div`
  position: sticky;
  bottom: 0;
  left: 0;
  right: 0;
  margin-top: ${({ theme }) => theme.spacing.md};
  padding: 12px 16px;
  border-radius: ${({ theme }) => theme.borderRadius.chip};
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.onPrimary};
  font-family: var(--font-inter), sans-serif;
  font-size: 13px;
  font-weight: 500;
  text-align: center;
  animation: slideUp 200ms ease;

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(8px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
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
export const TabBar = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  position: relative;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  border-bottom: 2px solid ${({ theme }) => theme.colors.outlineVariant};
`;

export const TabBtn = styled.button<{ $active: boolean }>`
  background: transparent;
  color: ${({ theme, $active }) =>
    $active ? theme.colors.primary : theme.colors.onSurfaceMuted};
  border: none;
  padding: 12px;
  font-family: var(--font-barlow), sans-serif;
  font-weight: 600;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  transition: color 200ms ease;
  position: relative;
  z-index: 1;

  span {
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: ${({ theme }) => theme.colors.primary};
    color: white;
    font-size: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

export const TabIndicator = styled.div<{ $index: number }>`
  position: absolute;
  bottom: -2px;
  left: 0;
  height: 2px;
  width: 50%;
  background: ${({ theme }) => theme.colors.primary};
  border-radius: 999px;
  transform: translateX(${({ $index }) => $index * 100}%);
  transition: transform 250ms cubic-bezier(0.34, 1.56, 0.64, 1);
  box-shadow: 0 0 8px ${({ theme }) => theme.colors.primary}80;
`;

export const NotifList = styled.div`
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;

  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.outlineVariant};
    border-radius: 3px;
  }
`;

export const NotifCard = styled.div<{ $unread: boolean }>`
  position: relative;
  display: flex;
  gap: 12px;
  padding: 12px;
  border-radius: 12px;
  cursor: ${({ $unread }) => ($unread ? "pointer" : "default")};
  background: ${({ theme, $unread }) =>
    $unread ? theme.colors.surfaceElevated : "transparent"};
  border-left: ${({ theme, $unread }) =>
    $unread ? `3px solid ${theme.colors.primary}` : "3px solid transparent"};
  transition: background 150ms ease;
`;

export const NotifAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.onPrimary};
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-barlow), sans-serif;
  font-weight: 900;
  font-size: 14px;
  flex-shrink: 0;
`;

export const NotifContent = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 3px;
`;

export const NotifText = styled.p`
  font-family: var(--font-inter), sans-serif;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.onSurface};
  margin: 0;
  line-height: 1.4;
`;

export const NotifName = styled.span`
  font-weight: 600;
`;

export const NotifTime = styled.span`
  font-family: var(--font-inter), sans-serif;
  font-size: 11px;
  color: ${({ theme }) => theme.colors.onSurfaceMuted};
`;

export const NotifActions = styled.div`
  display: flex;
  gap: 6px;
  margin-top: 6px;
`;

export const AcceptBtn = styled.button`
  height: 26px;
  padding: 0 10px;
  border-radius: ${({ theme }) => theme.borderRadius.pill};
  border: none;
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.onPrimary};
  font-family: var(--font-barlow), sans-serif;
  font-weight: 600;
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  cursor: pointer;

  &:disabled {
    opacity: 0.5;
  }
`;

export const RejectBtn = styled.button`
  height: 26px;
  padding: 0 10px;
  border-radius: ${({ theme }) => theme.borderRadius.pill};
  border: 1px solid ${({ theme }) => theme.colors.outlineVariant};
  background: transparent;
  color: ${({ theme }) => theme.colors.onSurfaceMuted};
  font-family: var(--font-barlow), sans-serif;
  font-weight: 600;
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  cursor: pointer;

  &:disabled {
    opacity: 0.5;
  }
`;

export const ViewBtn = styled.button`
  height: 26px;
  padding: 0 10px;
  border-radius: ${({ theme }) => theme.borderRadius.pill};
  border: 1px solid ${({ theme }) => theme.colors.primary};
  background: transparent;
  color: ${({ theme }) => theme.colors.primary};
  font-family: var(--font-barlow), sans-serif;
  font-weight: 600;
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  cursor: pointer;
`;

export const UnreadDot = styled.span`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.primary};
  position: absolute;
  top: 12px;
  right: 12px;
  flex-shrink: 0;
`;

export const NotifDivider = styled.div`
  height: 1px;
  background: ${({ theme }) => theme.colors.outlineVariant};
  opacity: 0.3;
  margin: 2px 0;
`;

export const EmptyNotif = styled.p`
  font-family: var(--font-inter), sans-serif;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.onSurfaceMuted};
  text-align: center;
  padding: 32px 0;
  margin: 0;
`;
