"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

import { formatMMSS } from "@/lib/formatMMSS";
import { useRestAlerts } from "@/app/(app)/train/context/RestAlertsContext";
import { useRestTimer } from "@/context/RestTimerContext";

import {
  StyledWidget,
  StyledWidgetLabel,
  StyledWidgetTime,
  StyledWidgetRing,
} from "./styles";

export default function RestTimerWidget() {
  const { isActive, timeLeft, restDuration } = useRestTimer();
  const { playRestEndAlert } = useRestAlerts();
  const pathname = usePathname();
  const router = useRouter();

  const isOnTrainPage = pathname === "/train" || pathname.startsWith("/train/");

  // Toca o alerta quando timer acaba e o overlay não está visível
  useEffect(() => {
    const handleEnd = () => {
      if (!isOnTrainPage) {
        playRestEndAlert();
      }
    };
    window.addEventListener("rest-timer-end", handleEnd);
    return () => window.removeEventListener("rest-timer-end", handleEnd);
  }, [isOnTrainPage, playRestEndAlert]);

  if (!isActive || isOnTrainPage) return null;

  const progress = restDuration > 0 ? Math.max(0, timeLeft / restDuration) : 0;
  const circumference = 2 * Math.PI * 20;
  const dashOffset = circumference * (1 - progress);

  return (
    <StyledWidget
      onClick={() => router.push("/train")}
      role="button"
      aria-label="Voltar ao treino"
    >
      <StyledWidgetRing>
        <svg width="48" height="48" viewBox="0 0 48 48">
          <circle cx="24" cy="24" r="20" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="3" />
          <circle
            cx="24" cy="24" r="20"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            transform="rotate(-90 24 24)"
            style={{ transition: "stroke-dashoffset 0.5s linear" }}
          />
        </svg>
        <StyledWidgetTime>{formatMMSS(Math.max(0, timeLeft))}</StyledWidgetTime>
      </StyledWidgetRing>
      <StyledWidgetLabel>DESCANSO</StyledWidgetLabel>
    </StyledWidget>
  );
}
