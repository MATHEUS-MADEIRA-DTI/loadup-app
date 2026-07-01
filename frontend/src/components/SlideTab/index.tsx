"use client";

import { useEffect, useRef, useState } from "react";
import styled, { keyframes, css } from "styled-components";

interface SlideTabProps {
  activeIndex: number;
  children: React.ReactNode;
}

export default function SlideTab({ activeIndex, children }: SlideTabProps) {
  const [direction, setDirection] = useState<"left" | "right">("right");
  const prevIndex = useRef(activeIndex);

  useEffect(() => {
    if (activeIndex > prevIndex.current) {
      setDirection("right");
    } else {
      setDirection("left");
    }
    prevIndex.current = activeIndex;
  }, [activeIndex]);

  return (
    <Wrapper key={activeIndex} $direction={direction}>
      {children}
    </Wrapper>
  );
}

const slideInFromRight = keyframes`
  from { opacity: 0; transform: translateX(32px); }
  to   { opacity: 1; transform: translateX(0); }
`;

const slideInFromLeft = keyframes`
  from { opacity: 0; transform: translateX(-32px); }
  to   { opacity: 1; transform: translateX(0); }
`;

const Wrapper = styled.div<{ $direction: "left" | "right" }>`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  gap: ${({ theme }) => theme.spacing.md};
  animation: ${({ $direction }) =>
    $direction === "right"
      ? css`
          ${slideInFromRight} 220ms ease
        `
      : css`
          ${slideInFromLeft} 220ms ease
        `};
`;
