"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ClipboardList, Dumbbell, TrendingUp } from "lucide-react";
import styled from "styled-components";

import { strings } from "@/constants/strings";

const tabs = [
  { href: "/home", label: strings.nav.home, Icon: Home },
  {
    href: "/training-plan",
    label: strings.nav.trainingPlan,
    Icon: ClipboardList,
  },
  { href: "/train", label: strings.nav.workout, Icon: Dumbbell },
  { href: "/progress", label: strings.nav.progression, Icon: TrendingUp },
] as const;

export default function BottomNavBar() {
  const pathname = usePathname();

  return (
    <StyledNav>
      {tabs.map((tab) => {
        const isActive =
          pathname === tab.href || pathname.startsWith(tab.href + "/");
        return (
          <StyledTab key={tab.href} href={tab.href} $active={isActive}>
            <tab.Icon
              size={22}
              color="currentColor"
              strokeWidth={isActive ? 2.5 : 1.8}
            />
          </StyledTab>
        );
      })}
    </StyledNav>
  );
}

const StyledNav = styled.nav`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-around;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.surface};
  border-top: 1px solid ${({ theme }) => theme.colors.outlineVariant};
  height: 80px;
  padding: 0 ${({ theme }) => theme.spacing.sm};
  padding-bottom: env(safe-area-inset-bottom, 0px);
  z-index: 100;
`;

const StyledTab = styled(Link)<{ $active: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.chip};
  background-color: ${({ theme, $active }) =>
    $active ? theme.colors.primaryContainer : "transparent"};
  color: ${({ theme, $active }) =>
    $active ? theme.colors.primary : theme.colors.outline};
  transition:
    background-color 0.2s ease,
    color 0.2s ease;
  text-decoration: none;
  min-width: 64px;
  flex: 1;
  max-width: 88px;
`;

const StyledLabel = styled.span<{ $active: boolean }>`
  font-size: ${({ theme }) => theme.typography.labelSmall.fontSize};
  font-weight: ${({ theme }) => theme.typography.labelSmall.fontWeight};
  color: inherit;
`;
