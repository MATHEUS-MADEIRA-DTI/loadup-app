"use client";

import { Dumbbell, MoonStar } from "lucide-react";

import { strings } from "@/constants/strings";

import {
  StyledHeader,
  StyledHeaderSub,
  StyledSummaryBadge,
  StyledSummaryRow,
  StyledTitle,
} from "./styles";

interface PlanHeaderProps {
  trainingCount: number;
  restCount: number;
}

export default function PlanHeader({
  trainingCount,
  restCount,
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
    </StyledHeader>
  );
}
