"use client";

import { useEffect, useState } from "react";

import { formatMMSS } from "@/lib/formatMMSS";
import { useAppTheme } from "@/styles/ThemeProvider";

import {
  StyledClockSvg,
  StyledClockWrapper,
  StyledDigitalTime,
  StyledRestLabel,
  StyledRestOverlay,
  StyledSkipRestBtn,
} from "./styles";

interface RestTimerOverlayProps {
  visible: boolean;
  restDuration: number;
  onDismiss: () => void;
}

export default function RestTimerOverlay({
  visible,
  restDuration,
  onDismiss,
}: RestTimerOverlayProps) {
  const { theme } = useAppTheme();
  const [timeLeft, setTimeLeft] = useState(restDuration);

  useEffect(() => {
    if (!visible) return;
    let remaining = restDuration;
    setTimeLeft(remaining);
    const interval = setInterval(() => {
      remaining -= 1;
      setTimeLeft(remaining);
      if (remaining <= 0) {
        clearInterval(interval);
        onDismiss();
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [visible, restDuration, onDismiss]);

  if (!visible) return null;

  const radius = 110;
  const circumference = 2 * Math.PI * radius;
  const progress = restDuration > 0 ? Math.max(0, timeLeft / restDuration) : 0;
  const dashOffset = circumference * (1 - progress);
  const handAngle = 360 * progress;

  return (
    <StyledRestOverlay role="dialog" aria-label="Tempo de descanso">
      <StyledRestLabel>DESCANSO</StyledRestLabel>

      <StyledClockWrapper>
        <StyledClockSvg viewBox="0 0 240 240" aria-hidden="true">
          <circle
            cx="120"
            cy="120"
            r={radius}
            fill="none"
            stroke={theme.colors.surface}
            strokeWidth="3"
          />
          <circle
            cx="120"
            cy="120"
            r={radius}
            fill="none"
            stroke={theme.colors.primary}
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            transform="rotate(-90 120 120)"
            style={{
              transition: "stroke-dashoffset 1s linear",
            }}
          />
          <line
            x1="120"
            y1="120"
            x2="120"
            y2="18"
            stroke={theme.colors.primary}
            strokeWidth="2"
            strokeLinecap="round"
            transform={`rotate(${handAngle} 120 120)`}
            style={{
              transition: "transform 1s linear",
            }}
          />
          <circle cx="120" cy="120" r="4" fill={theme.colors.primary} />
        </StyledClockSvg>
      </StyledClockWrapper>

      <StyledDigitalTime aria-live="polite">
        {formatMMSS(Math.max(0, timeLeft))}
      </StyledDigitalTime>

      <StyledSkipRestBtn type="button" onClick={onDismiss}>
        Pular descanso
      </StyledSkipRestBtn>
    </StyledRestOverlay>
  );
}
