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
  padding: 18px;
  border-radius: 36px;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
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
  color: rgba(255, 255, 255, 0.9);
  flex-shrink: 0;
`;

const StyledLabel = styled.span`
  font-size: 11px;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.9);
  letter-spacing: 0.045em;
  line-height: 1.5;
`;

const StyledValue = styled.span`
  font-size: 22px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.onPrimary};
  line-height: 1.5;
  letter-spacing: 0.023em;
  margin-top: 4px;
`;

const StyledUnit = styled.span`
  font-size: 10px;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.7);
  letter-spacing: 0.05em;
  line-height: 1.5;
`;
