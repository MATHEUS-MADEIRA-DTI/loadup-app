import { keyframes } from "styled-components";

/**
 * Page-level enter: fade-in + slide up from 12px below.
 * Used by PageTransition wrapper on all (app)/* pages.
 */
export const pageEnter = keyframes`
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

/**
 * Auth tab enter: fade-in + slide in from 8px to the right.
 * Used by (auth)/layout.tsx keyed by pathname.
 */
export const tabEnter = keyframes`
  from {
    opacity: 0;
    transform: translateX(8px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

/**
 * Modal content enter: fade-in + scale from 0.95 to 1.
 * Used by the Modal base component content card.
 */
export const modalEnter = keyframes`
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`;

/**
 * Modal overlay enter: fade-in backdrop.
 * Used by the Modal base component fixed overlay.
 */
export const modalOverlay = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

/** Transition config for page-level transitions. */
export const PAGE_TRANSITION = {
  duration: "300ms",
  easing: "ease",
} as const;

/** Transition config for auth tab switches. */
export const TAB_TRANSITION = {
  duration: "200ms",
  easing: "ease-out",
} as const;

/** Transition config for modal enter/exit. */
export const MODAL_TRANSITION = {
  duration: "200ms",
  easing: "ease-out",
  overlayDuration: "150ms",
  overlayEasing: "linear",
} as const;
