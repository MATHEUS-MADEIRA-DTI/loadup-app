"use client";

import styled from "styled-components";

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  unit?: string;
}

export default function StatCard({ icon, label, value, unit }: StatCardProps) {
  return (
    <StyledCard>
      <StyledIcon>{icon}</StyledIcon>
      <StyledValue>{value}</StyledValue>
      {unit && <StyledUnit>{unit}</StyledUnit>}
      <StyledLabel>{label}</StyledLabel>
    </StyledCard>
  );
}

const StyledCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  flex: 1;
  padding: 14px;
  border-radius: ${({ theme }) => theme.borderRadius.card};
  background: ${({ theme }) => theme.colors.glassOverlay};
  border: 1px solid ${({ theme }) => theme.colors.outlineVariant};
  box-shadow: ${({ theme }) => theme.shadows.card};
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
`;

const StyledIcon = styled.span`
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 6px;
`;

const StyledValue = styled.span`
  font-family: "Bebas Neue", Impact, sans-serif;
  font-size: 28px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.onSurface};
  line-height: 1.1;
  font-variant-numeric: tabular-nums;
  letter-spacing: -0.04em;
`;

const StyledUnit = styled.span`
  font-family: Inter, system-ui, sans-serif;
  font-size: ${({ theme }) => theme.typography.labelSmall.fontSize};
  font-weight: 400;
  color: ${({ theme }) => theme.colors.onSurfaceMuted};
  line-height: 1.3;
`;

const StyledLabel = styled.span`
  font-family: Inter, system-ui, sans-serif;
  font-size: 11px;
  font-weight: 400;
  color: ${({ theme }) => theme.colors.onSurfaceMuted};
  line-height: 1.3;
  margin-top: 4px;
`;
