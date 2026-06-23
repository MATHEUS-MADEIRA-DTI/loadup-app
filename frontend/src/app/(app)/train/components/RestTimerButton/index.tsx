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

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const start = () => {
    setRemaining(restTime);
    setIsFinished(false);
    setIsRunning(true);

    intervalRef.current = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!);
          setIsRunning(false);
          setIsFinished(true);
          playAlertSound();
          vibrateAlert();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const cancel = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
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
