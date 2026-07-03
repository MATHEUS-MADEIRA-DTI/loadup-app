"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import styled from "styled-components";

import BottomNavBar from "@/components/BottomNavBar";
import RestTimerWidget from "@/components/RestTimerWidget";
import ThemeToggle from "@/components/ThemeToggle";
import { RestAlertsProvider } from "@/app/(app)/train/context/RestAlertsContext";
import { RestTimerProvider } from "@/context/RestTimerContext";
import { tokenStorage } from "@/lib/tokenStorage";
import { Toaster } from "sonner";

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
    <RestAlertsProvider>
      <RestTimerProvider>
        <StyledWrapper>
          <StyledContent>{children}</StyledContent>
          <RestTimerWidget />
          <StyledThemeToggleWrap></StyledThemeToggleWrap>
          <BottomNavBar />
          <Toaster
            position="top-center"
            toastOptions={{
              style: {
                background: "#1E293B",
                color: "#F8FAFC",
                border: "1px solid rgba(255,255,255,0.08)",
                fontFamily: "var(--font-inter)",
                fontSize: "14px",
              },
            }}
          />
        </StyledWrapper>
      </RestTimerProvider>
    </RestAlertsProvider>
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
