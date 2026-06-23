"use client";

import { useState } from "react";

import { strings } from "@/constants/strings";
import { useAddRecord, useUpdateRecord } from "@/hooks/useSession";
import { Exercise, LoggedSet, Series } from "@/types";

import { SERIES_ABBR, SERIES_COLOR } from "../../utils";

import {
  StyledCheckBtn, StyledEditPencilBtn, StyledFieldLabel, StyledInput,
  StyledInputField, StyledLoggedField, StyledLoggedValue, StyledSeriesGoal,
  StyledSeriesInputsRow, StyledSeriesName, StyledSeriesRow, StyledSeriesTopRow,
  StyledSeriesTypeBadge,
} from "./styles";

interface SeriesInputRowProps {
  exercise: Exercise;
  series: Series;
  seriesIndex: number;
  sessionId: string;
  loggedSet: LoggedSet | undefined;
  isReadOnly: boolean;
}

export default function SeriesInputRow({ exercise, series, seriesIndex, sessionId, loggedSet, isReadOnly }: SeriesInputRowProps) {
  const addRecord = useAddRecord(sessionId);
  const updateRecord = useUpdateRecord(sessionId);
  const [isEditing, setIsEditing] = useState(false);
  const [weight, setWeight] = useState<string>("0.5");
  const [reps, setReps] = useState<string>(String(series.reps));
  const [rest, setRest] = useState<string>("60");

  const showInputs = !loggedSet || isEditing;
  const color = SERIES_COLOR[series.type];
  const isBusy = addRecord.isPending || updateRecord.isPending;

  const handleCheck = () => {
    if (isBusy || isReadOnly) return;
    const parsedWeight = parseFloat(weight);
    const safeWeight = parsedWeight >= 0.5 ? parsedWeight : 0.5;
    if (isEditing && loggedSet) {
      updateRecord.mutate({ recordId: loggedSet._id, payload: { weight: safeWeight, repsCompleted: parseInt(reps) || 0, restTime: parseInt(rest) || 0 } }, { onSuccess: () => setIsEditing(false) });
    } else {
      addRecord.mutate({ exerciseName: exercise.name, seriesType: series.type, seriesOrder: seriesIndex + 1, weight: safeWeight, repsCompleted: parseInt(reps) || 0, restTime: parseInt(rest) || 0 });
    }
  };

  const handleEditClick = () => {
    if (!loggedSet) return;
    setWeight(String(loggedSet.weight));
    setReps(String(loggedSet.repsCompleted));
    setRest(String(loggedSet.restTime));
    setIsEditing(true);
  };

  return (
    <StyledSeriesRow $logged={!!loggedSet && !isEditing}>
      <StyledSeriesTopRow>
        <StyledSeriesTypeBadge $bg={color.bg} $text={color.text}>{SERIES_ABBR[series.type]}</StyledSeriesTypeBadge>
        <StyledSeriesName>{strings.workout.seriesLabel(seriesIndex + 1)}</StyledSeriesName>
        <StyledSeriesGoal>{strings.workout.goalLabel(series.reps)}</StyledSeriesGoal>
      </StyledSeriesTopRow>

      <StyledSeriesInputsRow>
        {showInputs ? (
          <>
            <StyledInputField>
              <StyledFieldLabel>{strings.workout.weightShort}</StyledFieldLabel>
              <StyledInput type="number" min="0.5" step="0.5" value={weight} onChange={(e) => setWeight(e.target.value)} disabled={isReadOnly} />
            </StyledInputField>
            <StyledInputField>
              <StyledFieldLabel>{strings.workout.repsShort}</StyledFieldLabel>
              <StyledInput type="number" min="0" value={reps} onChange={(e) => setReps(e.target.value)} disabled={isReadOnly} />
            </StyledInputField>
            <StyledInputField>
              <StyledFieldLabel>{strings.workout.restShort}</StyledFieldLabel>
              <StyledInput type="number" min="0" value={rest} onChange={(e) => setRest(e.target.value)} disabled={isReadOnly} />
            </StyledInputField>
            {!isReadOnly && (
              <StyledCheckBtn $logged={false} onClick={handleCheck} disabled={isBusy}>
                {isBusy ? <span style={{ fontSize: 11 }}>...</span> : <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" /></svg>}
              </StyledCheckBtn>
            )}
          </>
        ) : (
          <>
            <StyledLoggedField>
              <StyledFieldLabel>{strings.workout.weightShort}</StyledFieldLabel>
              <StyledLoggedValue>{loggedSet!.weight}</StyledLoggedValue>
            </StyledLoggedField>
            <StyledLoggedField>
              <StyledFieldLabel>{strings.workout.repsShort}</StyledFieldLabel>
              <StyledLoggedValue>{loggedSet!.repsCompleted}</StyledLoggedValue>
            </StyledLoggedField>
            <StyledLoggedField>
              <StyledFieldLabel>{strings.workout.restShort}</StyledFieldLabel>
              <StyledLoggedValue>{loggedSet!.restTime}</StyledLoggedValue>
            </StyledLoggedField>
            <StyledCheckBtn $logged={true} disabled>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" /></svg>
            </StyledCheckBtn>
            {!isReadOnly && (
              <StyledEditPencilBtn onClick={handleEditClick} aria-label={strings.common.ariaEditSet}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zm17.71-10.21c.39-.39.39-1.02 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" /></svg>
              </StyledEditPencilBtn>
            )}
          </>
        )}
      </StyledSeriesInputsRow>
    </StyledSeriesRow>
  );
}
