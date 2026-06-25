"use client";

import styled from "styled-components";
import { CalendarX } from "lucide-react";

interface WrongDayModalProps {
  isOpen: boolean;
  onClose: () => void;
  todayLabel: string;
  onNavigate?: () => void;
}

export default function WrongDayModal({
  isOpen,
  onClose,
  todayLabel,
  onNavigate,
}: WrongDayModalProps) {
  if (!isOpen) return null;
  const handleConfirm = () => {
    onClose();
    onNavigate?.();
  };
  return (
    <Backdrop onClick={onClose}>
      <Sheet onClick={(e) => e.stopPropagation()}>
        <IconWrapper>
          <CalendarX size={28} strokeWidth={2} />
        </IconWrapper>
        <Title>Treino indisponível</Title>
        <Description>
          Você só pode iniciar o treino do dia de hoje.{" "}
          <Strong>Vá para {todayLabel}</Strong> para começar seu treino.
        </Description>
        <CloseBtn onClick={handleConfirm}>Entendido</CloseBtn>
      </Sheet>
    </Backdrop>
  );
}

const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
  z-index: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  animation: fadeIn 150ms ease;

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

const Sheet = styled.div`
  width: 100%;
  max-width: 480px;
  background: ${({ theme }) => theme.colors.surfaceElevated};
  border-radius: 24px;
  padding: 32px 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  animation: slideUp 250ms cubic-bezier(0.16, 1, 0.3, 1);

  @keyframes slideUp {
    from {
      transform: translateY(20px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
`;

const IconWrapper = styled.div`
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.errorContainer};
  color: ${({ theme }) => theme.colors.error};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 4px;
`;

const Title = styled.h2`
  font-family: var(--font-barlow), sans-serif;
  font-weight: 900;
  font-size: 22px;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.onSurface};
  text-align: center;
`;

const Description = styled.p`
  font-family: var(--font-inter), sans-serif;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.onSurfaceMuted};
  text-align: center;
  line-height: 1.6;
`;

const Strong = styled.span`
  color: ${({ theme }) => theme.colors.onSurface};
  font-weight: 600;
`;

const CloseBtn = styled.button`
  margin-top: 8px;
  width: 100%;
  height: 52px;
  border-radius: ${({ theme }) => theme.borderRadius.pill};
  border: none;
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.onPrimary};
  font-family: var(--font-barlow), sans-serif;
  font-weight: 700;
  font-size: 16px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  cursor: pointer;
`;
