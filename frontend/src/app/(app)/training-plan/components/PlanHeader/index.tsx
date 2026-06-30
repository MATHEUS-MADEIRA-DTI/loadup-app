"use client";

import { Dumbbell, GripVertical, MoonStar } from "lucide-react";

import { strings } from "@/constants/strings";

import {
  StyledHeader,
  StyledHeaderSub,
  StyledReorderBtn,
  StyledReorderLeft,
  StyledReorderStatus,
  StyledSummaryBadge,
  StyledSummaryRow,
  StyledTitle,
} from "./styles";

interface PlanHeaderProps {
  trainingCount: number;
  restCount: number;
  dragEnabled: boolean;
  onToggleDrag: () => void;
}

export default function PlanHeader({
  trainingCount,
  restCount,
  dragEnabled,
  onToggleDrag,
}: PlanHeaderProps) {
  return (
    <StyledHeader>
      <StyledHeaderSub>{strings.trainingPlan.titleSub}</StyledHeaderSub>
      <StyledTitle>{strings.trainingPlan.titleMain}</StyledTitle>
      <StyledSummaryRow>
        <StyledSummaryBadge>
          <Dumbbell size={13} />
          {strings.trainingPlan.summaryTrainingDays(trainingCount)}
        </StyledSummaryBadge>
        <StyledSummaryBadge>
          <MoonStar size={13} />
          {strings.trainingPlan.summaryRestDays(restCount)}
        </StyledSummaryBadge>
      </StyledSummaryRow>
      <StyledReorderBtn
        $active={dragEnabled}
        onClick={onToggleDrag}
        type="button"
      >
        <StyledReorderLeft>
          <GripVertical size={14} />
          Reordenar dias
        </StyledReorderLeft>
        <StyledReorderStatus $active={dragEnabled}>
          {dragEnabled ? "Ativado" : "Desativado"}
        </StyledReorderStatus>
      </StyledReorderBtn>
    </StyledHeader>
  );
}
