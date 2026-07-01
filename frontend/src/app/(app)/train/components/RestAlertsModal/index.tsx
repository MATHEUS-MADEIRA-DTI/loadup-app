"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { BellRing, X } from "lucide-react";
import { toast } from "sonner";

import { useRestAlerts } from "../../context/RestAlertsContext";
import {
  StyledActionsRow,
  StyledBackdrop,
  StyledCloseBtn,
  StyledConfirmBtn,
  StyledDismissBtn,
  StyledHandle,
  StyledIconWrapper,
  StyledMessage,
  StyledSheet,
  StyledTitle,
} from "./styles";

export default function RestAlertsModal() {
  const { shouldPromptForAlerts, unlockAlerts, dismissAlertsPrompt } =
    useRestAlerts();
  const [mounted, setMounted] = useState(false);
  const [isActivating, setIsActivating] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !shouldPromptForAlerts) return null;

  const handleActivate = async () => {
    setIsActivating(true);
    try {
      const permission = await unlockAlerts();
      if (permission === "denied") {
        toast.warning(
          "Som ativado, mas as notificações estão bloqueadas nas configurações do dispositivo.",
        );
      } else {
        toast.success("Alertas de treino ativados!");
      }
    } finally {
      setIsActivating(false);
    }
  };

  return createPortal(
    <>
      <StyledBackdrop onClick={dismissAlertsPrompt} />
      <StyledSheet role="dialog" aria-label="Ativar alertas de treino">
        <StyledHandle />
        <StyledCloseBtn onClick={dismissAlertsPrompt} aria-label="Fechar">
          <X size={16} />
        </StyledCloseBtn>
        <StyledIconWrapper>
          <BellRing size={24} />
        </StyledIconWrapper>
        <StyledTitle>Ativar notificações?</StyledTitle>
        <StyledMessage>
          Elas vão te lembrar quando seu descanso já tiver finalizado.
        </StyledMessage>
        <StyledActionsRow>
          <StyledDismissBtn
            type="button"
            onClick={dismissAlertsPrompt}
            disabled={isActivating}
          >
            Agora não
          </StyledDismissBtn>
          <StyledConfirmBtn
            type="button"
            disabled={isActivating}
            onClick={() => {
              void handleActivate();
            }}
          >
            Ativar
          </StyledConfirmBtn>
        </StyledActionsRow>
      </StyledSheet>
    </>,
    document.body,
  );
}
