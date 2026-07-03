import styled, { keyframes } from "styled-components";

const slideUp = keyframes`
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
`;

export const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  z-index: 999;
`;

export const Sheet = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  max-width: 480px;
  margin: 0 auto;
  max-height: 85dvh;
  background: ${({ theme }) => theme.colors.surfaceElevated};
  border-radius: 24px 24px 0 0;
  border-top: 1px solid ${({ theme }) => theme.colors.outlineVariant};
  z-index: 1000;
  display: flex;
  flex-direction: column;
  animation: ${slideUp} 320ms cubic-bezier(0.16, 1, 0.3, 1);
  box-shadow: 0 -8px 40px rgba(0, 0, 0, 0.4);
  overflow: hidden;
`;

export const DragArea = styled.div`
  flex-shrink: 0;
  padding-top: 10px;
  touch-action: none;
`;

export const Handle = styled.div`
  width: 40px;
  height: 4px;
  border-radius: 999px;
  background: ${({ theme }) => theme.colors.outlineVariant};
  margin: 0 auto 4px;
`;

export const SheetHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 20px 14px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.outlineVariant};
`;

export const SheetTitle = styled.span`
  font-family: "Barlow Condensed", Inter, sans-serif;
  font-weight: 900;
  font-size: 20px;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: ${({ theme }) => theme.colors.onSurface};
`;

export const CloseBtn = styled.button`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 1px solid ${({ theme }) => theme.colors.outlineVariant};
  background: transparent;
  color: ${({ theme }) => theme.colors.onSurfaceMuted};
  display: grid;
  place-items: center;
  cursor: pointer;
  flex-shrink: 0;
`;

export const SheetBody = styled.div`
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  padding: 16px 20px 32px;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
`;

export const EmptyText = styled.p`
  font-size: ${({ theme }) => theme.typography.bodyMedium.fontSize};
  color: ${({ theme }) => theme.colors.onSurfaceMuted};
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xl} 0;
`;

export const ExerciseGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

export const ExerciseGroupHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const ExerciseGroupName = styled.h3`
  font-family: "Barlow Condensed", Inter, sans-serif;
  font-size: 18px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.onSurface};
  margin: 0;
`;

export const SeriesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const SeriesRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: ${({ theme }) => theme.borderRadius.inner};
  background: ${({ theme }) => theme.colors.surface};
`;

export const SeriesBadge = styled.span<{ $bg: string; $text: string }>`
  flex-shrink: 0;
  padding: 4px 8px;
  border-radius: ${({ theme }) => theme.borderRadius.pill};
  background: ${({ $bg }) => $bg};
  color: ${({ $text }) => $text};
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
`;

export const SeriesOrder = styled.span`
  flex-shrink: 0;
  font-size: 12px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.onSurfaceMuted};
  width: 20px;
`;

export const SeriesStats = styled.div`
  flex: 1;
  display: flex;
  flex-wrap: wrap;
  gap: 4px 10px;
  min-width: 0;
`;

export const SeriesStatItem = styled.span`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.onSurface};
  font-weight: 600;
  white-space: nowrap;
`;

export const RowActions = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
`;

export const IconBtn = styled.button<{ $variant?: "danger" | "primary" }>`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: none;
  background: transparent;
  display: grid;
  place-items: center;
  cursor: pointer;
  color: ${({ theme, $variant }) =>
    $variant === "danger"
      ? theme.colors.error
      : $variant === "primary"
        ? theme.colors.primary
        : theme.colors.onSurfaceMuted};
  transition: opacity 150ms ease;
  &:active {
    opacity: 0.7;
  }
  &:disabled {
    opacity: 0.4;
    cursor: default;
  }
`;

export const EditFieldsRow = styled.div`
  flex: 1;
  display: flex;
  gap: 8px;
  min-width: 0;
`;

export const EditField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
`;

export const EditFieldLabel = styled.span`
  font-size: 9px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: ${({ theme }) => theme.colors.onSurfaceMuted};
`;

export const EditInput = styled.input`
  width: 56px;
  height: 32px;
  border-radius: ${({ theme }) => theme.borderRadius.inner};
  border: 1.5px solid ${({ theme }) => theme.colors.outlineVariant};
  background: ${({ theme }) => theme.colors.surfaceElevated};
  color: ${({ theme }) => theme.colors.onSurface};
  font-size: 14px;
  font-weight: 600;
  text-align: center;
  font-family: inherit;
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;
