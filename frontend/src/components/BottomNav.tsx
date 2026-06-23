"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styled from "styled-components";

import { strings } from "@/constants/strings";

const tabs = [
  { href: "/", label: strings.nav.home, icon: "🏠" },
  { href: "/training-plan", label: strings.nav.trainingPlan, icon: "📋" },
  { href: "/train", label: strings.nav.workout, icon: "💪" },
  { href: "/progress", label: strings.nav.progression, icon: "📈" },
] as const;

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <StyledNav>
      {tabs.map((tab) => {
        const isActive =
          tab.href === "/"
            ? pathname === "/"
            : pathname === tab.href || pathname.startsWith(tab.href + "/");
        return (
          <StyledTab key={tab.href} href={tab.href} $active={isActive}>
            <StyledIcon>{tab.icon}</StyledIcon>
            <StyledLabel>{tab.label}</StyledLabel>
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
  height: 64px;
  padding: 0 ${({ theme }) => theme.spacing.sm};
  z-index: 100;
`;

const StyledTab = styled(Link)<{ $active: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.chip};
  background-color: ${({ theme, $active }) =>
    $active ? theme.colors.primaryContainer : "transparent"};
  transition: background-color 0.2s ease;
  text-decoration: none;
  min-width: 64px;
`;

const StyledIcon = styled.span`
  font-size: 18px;
  line-height: 1;
`;

const StyledLabel = styled.span`
  font-size: ${({ theme }) => theme.typography.labelSmall.fontSize};
  font-weight: ${({ theme }) => theme.typography.labelSmall.fontWeight};
  color: ${({ theme }) => theme.colors.onSurfaceMuted};

  ${StyledTab}[data-active="true"] & {
    color: ${({ theme }) => theme.colors.primary};
  }
`;
