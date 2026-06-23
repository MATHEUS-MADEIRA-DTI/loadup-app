import styled from "styled-components";

import { tabEnter, TAB_TRANSITION } from "@/lib/animations";

export const StyledWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
  padding-top: 8px;
`;

export const StyledTabBar = styled.div`
  position: relative;
  display: flex;
  border-bottom: 1px solid ${({ theme }) => theme.colors.outlineVariant};
`;

export const StyledTabButton = styled.button<{ $active?: boolean }>`
  flex: 1;
  padding: 14px 0;
  font-size: 15px;
  font-weight: ${({ $active }) => ($active ? 700 : 500)};
  color: ${({ theme, $active }) =>
    $active ? theme.colors.primary : theme.colors.outline};
  background: none;
  border: none;
  cursor: pointer;
  font-family: inherit;
  transition: color ${TAB_TRANSITION.duration} ${TAB_TRANSITION.easing};
`;

export const StyledTabIndicator = styled.div<{ $right: boolean }>`
  position: absolute;
  bottom: -1px;
  left: ${({ $right }) => ($right ? "50%" : "0%")};
  width: 50%;
  height: 3px;
  background-color: ${({ theme }) => theme.colors.primary};
  border-radius: 3px 3px 0 0;
  transition: left ${TAB_TRANSITION.duration} ${TAB_TRANSITION.easing};
`;

export const StyledTabContent = styled.div`
  animation: ${tabEnter} ${TAB_TRANSITION.duration} ${TAB_TRANSITION.easing}
    both;
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding-top: 20px;
`;

export const StyledSuccess = styled.div`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.success};
  background-color: ${({ theme }) => theme.colors.successContainer};
  border-radius: ${({ theme }) => theme.borderRadius.chip};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  text-align: center;
`;
