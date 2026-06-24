"use client";

import { useEffect, useRef, useState } from "react";
import { CheckCircle2 } from "lucide-react";

import { strings } from "@/constants/strings";
import { formatMMSS } from "@/lib/formatMMSS";
import { playAlertSound, vibrateAlert } from "@/lib/restTimerNotification";

import {
  StyledCancelBtn,
  StyledFinishedMsg,
  StyledFinishedWrap,
  StyledRestBtn,
  StyledTimerDisplay,
  StyledTimerWrap,
} from "./styles";

interface RestTimerButtonProps {
  restTime: number;
  exerciseName: string;
}

export default function RestTimerButton({
  restTime,
  exerciseName,
}: RestTimerButtonProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [remaining, setRemaining] = useState(restTime);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const deadlineRef = useRef<number | null>(null);
  const wakeLockRef = useRef<WakeLockSentinel | null>(null);

  const acquireWakeLock = async () => {
    if (!("wakeLock" in navigator)) return;
    try {
      wakeLockRef.current = await navigator.wakeLock.request("screen");
    } catch {
      // Wake Lock não suportado ou negado — sem efeito
    }
  };

  const releaseWakeLock = () => {
    wakeLockRef.current?.release().catch(() => {});
    wakeLockRef.current = null;
  };

  const clearTick = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const finish = () => {
    clearTick();
    releaseWakeLock();
    deadlineRef.current = null;
    setIsRunning(false);
    setIsFinished(true);
    setRemaining(0);
    playAlertSound();
    vibrateAlert();
  };

  const startTick = (deadline: number) => {
    clearTick();
    intervalRef.current = setInterval(() => {
      const left = Math.round((deadline - Date.now()) / 1000);
      if (left <= 0) {
        finish();
      } else {
        setRemaining(left);
      }
    }, 500);
  };

  // Re-sync timer when page becomes visible again (background → foreground)
  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === "visible" && deadlineRef.current) {
        const left = Math.round((deadlineRef.current - Date.now()) / 1000);
        if (left <= 0) {
          finish();
        } else {
          setRemaining(left);
          startTick(deadlineRef.current);
        }
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearTick();
      releaseWakeLock();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const start = async () => {
    const deadline = Date.now() + restTime * 1000;
    deadlineRef.current = deadline;
    setRemaining(restTime);
    setIsFinished(false);
    setIsRunning(true);
    await acquireWakeLock();
    startTick(deadline);
  };

  const cancel = () => {
    clearTick();
    releaseWakeLock();
    deadlineRef.current = null;
    setIsRunning(false);
    setIsFinished(false);
    setRemaining(restTime);
  };

  if (isFinished) {
    return (
      <StyledFinishedWrap
        onClick={start}
        role="button"
        aria-label={`${strings.restTimer.finishedMessage} — ${exerciseName}`}
      >
        <CheckCircle2 size={18} />
        <StyledFinishedMsg>
          {strings.restTimer.finishedMessage}
        </StyledFinishedMsg>
      </StyledFinishedWrap>
    );
  }

  if (isRunning) {
    return (
      <StyledTimerWrap>
        <StyledTimerDisplay
          aria-live="polite"
          aria-label={`Descanso: ${remaining} segundos restantes`}
        >
          {formatMMSS(remaining)}
        </StyledTimerDisplay>
        <StyledCancelBtn
          onClick={cancel}
          aria-label={strings.restTimer.buttonCancel}
        >
          ✕
        </StyledCancelBtn>
      </StyledTimerWrap>
    );
  }

  return (
    <StyledRestBtn
      onClick={start}
      aria-label={`${strings.restTimer.buttonIdle} — ${formatMMSS(restTime)} — ${exerciseName}`}
    >
      {strings.restTimer.buttonIdle} · {formatMMSS(restTime)}
    </StyledRestBtn>
  );
}
