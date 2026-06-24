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
      <StyledTopRow>
        <StyledIcon>{icon}</StyledIcon>
        <StyledLabel>{label}</StyledLabel>
      </StyledTopRow>
      <StyledValue>{value}</StyledValue>
      {unit && <StyledUnit>{unit}</StyledUnit>}
    </StyledCard>
  );
}

const StyledCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  flex: 1;
  padding: 14px;
  border-radius: ${({ theme }) => theme.borderRadius.inner};
  background: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.outlineVariant};
`;

const StyledTopRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 4px;
`;

const StyledIcon = styled.span`
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.colors.primary};
  flex-shrink: 0;
`;

const StyledLabel = styled.span`
  font-size: 11px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.onSurfaceMuted};
  line-height: 1.5;
`;

const StyledValue = styled.span`
  font-size: 22px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.onSurface};
  line-height: 1.3;
  margin-top: 4px;
  font-variant-numeric: tabular-nums;
  letter-spacing: -0.02em;
`;

const StyledUnit = styled.span`
  font-size: 10px;
  font-weight: 400;
  color: ${({ theme }) => theme.colors.onSurfaceMuted};
  line-height: 1.5;
`;
