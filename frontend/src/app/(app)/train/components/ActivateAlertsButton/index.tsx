"use client";

import { useState } from "react";
import { Bell, BellRing } from "lucide-react";
import { toast } from "sonner";

import { useRestAlerts } from "../../context/RestAlertsContext";
import { StyledActivateAlertsBtn } from "./styles";

export default function ActivateAlertsButton() {
  const { alertsReady, unlockAlerts } = useRestAlerts();
  const [isUnlocking, setIsUnlocking] = useState(false);

  const handleClick = async () => {
    setIsUnlocking(true);
    try {
      const permission = await unlockAlerts();
      if (permission !== "denied") {
        toast.success("Alertas de treino ativados!");
      } else {
        toast.warning(
          "Som ativado, mas as notificações estão bloqueadas nas configurações do dispositivo.",
        );
      }
    } finally {
      setIsUnlocking(false);
    }
  };

  return (
    <StyledActivateAlertsBtn
      type="button"
      $active={alertsReady}
      disabled={isUnlocking || alertsReady}
      onClick={() => {
        void handleClick();
      }}
    >
      {alertsReady ? <BellRing size={16} /> : <Bell size={16} />}
      {alertsReady ? "Alertas ativados" : "Ativar alertas de treino"}
    </StyledActivateAlertsBtn>
  );
}
