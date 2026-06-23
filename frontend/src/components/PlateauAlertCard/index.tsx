"use client";

import { PlateauAlertWithMuscleGroup } from "@/types";
import { strings } from "@/constants/strings";
import MuscleChip from "@/components/MuscleChip";
import {
  StyledCard,
  ExerciseName,
  MuscleChipWrapper,
  DetectedDate,
  StagnationLabel,
  SessionCount,
  Suggestion,
  DismissLink,
} from "./styles";

interface PlateauAlertCardProps {
  alert: PlateauAlertWithMuscleGroup;
  onDismiss: (id: string) => void;
  isAnimating: boolean;
}

/**
 * Individual plateau alert card component.
 * Displays alert information and dismiss action.
 */
export function PlateauAlertCard({
  alert,
  onDismiss,
  isAnimating,
}: PlateauAlertCardProps) {
  const handleDismiss = () => onDismiss(alert._id);
  const detectedDate = new Date(alert.detectedAt).toLocaleDateString("pt-BR");

  return (
    <StyledCard isAnimating={isAnimating}>
      <div>
        <ExerciseName>{alert.exerciseName} →</ExerciseName>

        {alert.muscleGroup && (
          <MuscleChipWrapper>
            <MuscleChip muscleGroup={alert.muscleGroup} />
          </MuscleChipWrapper>
        )}

        <DetectedDate>
          {strings.plateau.detected} {detectedDate}
        </DetectedDate>

        <StagnationLabel>{strings.plateau.noProgress}</StagnationLabel>

        <SessionCount>
          {alert.sessionCount} {strings.plateau.sessions}
        </SessionCount>

        {alert.suggestion && <Suggestion>💡 {alert.suggestion}</Suggestion>}
      </div>

      <DismissLink onClick={handleDismiss}>
        {strings.plateau.markRead}
      </DismissLink>
    </StyledCard>
  );
}
