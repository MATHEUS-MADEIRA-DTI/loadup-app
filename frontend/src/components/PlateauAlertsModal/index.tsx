"use client";

import { useState, useEffect } from "react";
import { PlateauAlertWithMuscleGroup } from "@/types";
import { strings } from "@/constants/strings";
import { PlateauAlertCard } from "@/components/PlateauAlertCard";
import {
  StyledOverlay,
  StyledModal,
  Header,
  Title,
  CloseButton,
  Subtitle,
  DismissAllLink,
  AlertList,
  AlertListItem,
} from "./styles";

interface PlateauAlertsModalProps {
  isOpen: boolean;
  alerts: PlateauAlertWithMuscleGroup[];
  onClose: () => void;
  onDismiss: (id: string) => void;
  onDismissAll: () => void;
}

const ANIMATION_DURATION = 300;

/**
 * Modal dialog for displaying plateau alerts.
 * Handles alert dismissal with fade-out animations.
 */
export function PlateauAlertsModal({
  isOpen,
  alerts,
  onClose,
  onDismiss,
  onDismissAll,
}: PlateauAlertsModalProps) {
  const [animatingIds, setAnimatingIds] = useState<Set<string>>(new Set());
  const [dismissingAll, setDismissingAll] = useState(false);

  if (!isOpen) return null;

  const handleDismissSingle = (id: string) => {
    setAnimatingIds((prev) => new Set(Array.from(prev).concat(id)));
    setTimeout(() => {
      onDismiss(id);
      setAnimatingIds((prev) => {
        const next = new Set(Array.from(prev));
        next.delete(id);
        return next;
      });
    }, ANIMATION_DURATION);
  };

  const handleDismissAll = () => {
    setDismissingAll(true);
    setAnimatingIds(new Set(alerts.map((a) => a._id)));
    setTimeout(() => {
      onDismissAll();
      setAnimatingIds(new Set());
      setDismissingAll(false);
    }, ANIMATION_DURATION);
  };

  const handleOverlayClick = () => {
    if (!dismissingAll) onClose();
  };

  return (
    <StyledOverlay onClick={handleOverlayClick}>
      <StyledModal onClick={(e) => e.stopPropagation()}>
        <Header>
          <Title>
            {strings.plateau.title} ({alerts.length})
          </Title>
          <CloseButton onClick={onClose} aria-label="Close">
            ×
          </CloseButton>
        </Header>

        <Subtitle>{strings.plateau.subtitle}</Subtitle>

        {alerts.length > 0 && !dismissingAll && (
          <DismissAllLink onClick={handleDismissAll}>
            {strings.plateau.markAllRead}
          </DismissAllLink>
        )}

        <AlertList>
          {alerts.map((alert, index) => (
            <AlertListItem
              key={alert._id}
              style={{ "--index": index } as React.CSSProperties}
            >
              <PlateauAlertCard
                alert={alert}
                onDismiss={handleDismissSingle}
                isAnimating={animatingIds.has(alert._id)}
              />
            </AlertListItem>
          ))}
        </AlertList>
      </StyledModal>
    </StyledOverlay>
  );
}
