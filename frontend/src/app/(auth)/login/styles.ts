import styled from "styled-components";

export const StyledWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
`;

export const StyledTabBar = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  padding: 4px;
  border-radius: 999px;
  background: ${({ theme }) => theme.colors.surfaceElevated};
  border: 1px solid rgba(255, 255, 255, 0.05);
  position: relative;
`;

export const StyledTabButton = styled.button<{ $active: boolean }>`
  height: 44px;
  border-radius: 999px;
  font-family: var(--font-barlow), sans-serif;
  font-size: 14px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  border: none;
  cursor: pointer;
  transition: all 200ms ease;
  background: ${({ $active }) => ($active ? "#3B82F6" : "transparent")};
  color: ${({ $active }) => ($active ? "#ffffff" : "rgba(255,255,255,0.5)")};
  box-shadow: ${({ $active }) =>
    $active ? "0 0 20px rgba(59,130,246,0.4)" : "none"};
`;

export const StyledTabIndicator = styled.div<{ $right: boolean }>`
  display: none;
`;

export const StyledTabContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const StyledSuccess = styled.p`
  font-family: var(--font-inter), sans-serif;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.success};
  background: ${({ theme }) => theme.colors.successContainer};
  padding: 10px 14px;
  border-radius: ${({ theme }) => theme.borderRadius.chip};
  text-align: center;
`;
