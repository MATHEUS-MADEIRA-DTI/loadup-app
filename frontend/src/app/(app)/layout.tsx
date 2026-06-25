"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import styled from "styled-components";

import BottomNavBar from "@/components/BottomNavBar";
import ThemeToggle from "@/components/ThemeToggle";
import { tokenStorage } from "@/lib/tokenStorage";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!tokenStorage.get()) {
      router.replace("/login");
    }
  }, [router]);

  if (!mounted || !tokenStorage.get()) {
    return null;
  }

  return (
    <StyledWrapper>
      <StyledContent>{children}</StyledContent>
      <StyledThemeToggleWrap>
      </StyledThemeToggleWrap>
      <BottomNavBar />
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
`;

const StyledContent = styled.div`
  flex: 1;
  padding-bottom: 80px;
`;

const StyledThemeToggleWrap = styled.div`
  position: fixed;
  bottom: 96px;
  left: ${({ theme }) => theme.spacing.md};
  z-index: 200;
`;
