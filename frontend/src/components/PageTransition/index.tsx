"use client";

import styled from "styled-components";

import { pageEnter } from "@/lib/animations";

const StyledTransition = styled.div`
  animation: ${pageEnter} 300ms ease both;
`;

export default function PageTransition({
  children,
}: {
  children: React.ReactNode;
}) {
  return <StyledTransition>{children}</StyledTransition>;
}
