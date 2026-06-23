"use client";

import { useEffect, useRef } from "react";
import styled from "styled-components";

import { modalEnter, modalOverlay, MODAL_TRANSITION } from "@/lib/animations";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}

export default function Modal({
  isOpen,
  onClose,
  children,
  title,
}: ModalProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isOpen) {
      closeButtonRef.current?.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <StyledOverlay onClick={onClose} role="dialog" aria-modal="true">
      <StyledCard onClick={(e) => e.stopPropagation()}>
        <StyledCloseButton
          ref={closeButtonRef}
          onClick={onClose}
          aria-label="Fechar"
        >
          ×
        </StyledCloseButton>
        {title && <StyledTitle>{title}</StyledTitle>}
        {children}
      </StyledCard>
    </StyledOverlay>
  );
}

const StyledOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.md};
  animation: ${modalOverlay} ${MODAL_TRANSITION.overlayDuration}
    ${MODAL_TRANSITION.overlayEasing} both;
`;

const StyledCard = styled.div`
  position: relative;
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.inner};
  padding: ${({ theme }) => theme.spacing.lg};
  width: 90vw;
  max-width: 480px;
  max-height: 90dvh;
  overflow-y: auto;
  animation: ${modalEnter} ${MODAL_TRANSITION.duration}
    ${MODAL_TRANSITION.easing} both;
`;

const StyledCloseButton = styled.button`
  position: absolute;
  top: ${({ theme }) => theme.spacing.sm};
  right: ${({ theme }) => theme.spacing.sm};
  width: 36px;
  height: 36px;
  border: none;
  background: transparent;
  font-size: 22px;
  line-height: 1;
  color: ${({ theme }) => theme.colors.onSurface};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: ${({ theme }) => theme.borderRadius.pill};

  &:hover {
    background: ${({ theme }) => theme.colors.background};
  }
`;

const StyledTitle = styled.h2`
  font-size: ${({ theme }) => theme.typography.titleMedium.fontSize};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.onSurface};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  padding-right: ${({ theme }) => theme.spacing.lg};
`;
