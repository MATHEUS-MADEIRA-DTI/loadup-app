"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Dumbbell } from "lucide-react";

import { useRestTimer } from "@/context/RestTimerContext";
import { useTodaySessionCache } from "@/hooks/useSession";

import {
  StyledWidget,
  StyledWidgetIconWrap,
  StyledWidgetLabel,
  StyledWidgetTime,
} from "./styles";

function formatElapsed(totalSeconds: number): string {
  const s = Math.max(0, Math.floor(totalSeconds));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  if (h > 0) {
    return `${h}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  }
  return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
}

export default function WorkoutTimerWidget() {
  const session = useTodaySessionCache();
  const { isActive: isRestActive } = useRestTimer();
  const pathname = usePathname();
  const router = useRouter();
  const [now, setNow] = useState<number | null>(null);

  const isOnTrainPage = pathname === "/train" || pathname.startsWith("/train/");
  const status = session.data?.status;

  useEffect(() => {
    if (status !== "active") return;
    setNow(Date.now());
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, [status]);

  const elapsedSeconds = useMemo(() => {
    if (!session.data) return 0;
    const base = session.data.activeSeconds ?? 0;
    if (session.data.status === "active" && session.data.lastResumedAt && now != null) {
      const extra = Math.floor(
        (now - new Date(session.data.lastResumedAt).getTime()) / 1000,
      );
      return base + Math.max(0, extra);
    }
    return base;
  }, [session.data, now]);

  // Mostra só quando o treino está rodando e o usuário saiu da tela de
  // treino — some se um rest timer estiver ativo (esse widget tem prioridade
  // visual, mesma posição na tela).
  if (status !== "active" || isOnTrainPage || isRestActive) return null;

  return (
    <StyledWidget
      onClick={() => router.push("/train")}
      role="button"
      aria-label="Voltar ao treino"
    >
      <StyledWidgetIconWrap>
        <Dumbbell size={20} />
      </StyledWidgetIconWrap>
      <StyledWidgetTime>{formatElapsed(elapsedSeconds)}</StyledWidgetTime>
      <StyledWidgetLabel>TREINO</StyledWidgetLabel>
    </StyledWidget>
  );
}
