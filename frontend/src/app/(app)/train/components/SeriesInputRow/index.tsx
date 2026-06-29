"use client";

import { forwardRef, useCallback, useImperativeHandle, useState } from "react";

import { strings } from "@/constants/strings";
import { useAddRecord, useUpdateRecord } from "@/hooks/useSession";
import { Exercise, LoggedSet, Series } from "@/types";

import { SERIES_ABBR, SERIES_COLOR } from "../../utils";

import NumPad from "../NumPad";

import {
  StyledActionRow,
  StyledCardControls,
  StyledCardLabel,
  StyledCardTopRow,
  StyledCardValue,
  StyledCheckBtn,
  StyledControlBtn,
  StyledCounterCard,
  StyledEditPencilBtn,
  StyledFieldLabel,
  StyledInput,
  StyledInputField,
  StyledLoggedLabel,
  StyledLoggedSummary,
  StyledLoggedValue,
  StyledNumPadTrigger,
  StyledSeriesDot,
  StyledSeriesDots,
  StyledSeriesError,
  StyledSeriesGoal,
  StyledSeriesInputsRow,
  StyledSeriesName,
  StyledSeriesRow,
  StyledSeriesTopRow,
  StyledSeriesTypeBadge,
} from "./styles";

export interface SeriesInputRowHandle {
  check: () => Promise<boolean>;
  getRestTime: () => number;
}

interface SeriesInputRowProps {
  exercise: Exercise;
  series: Series;
  seriesIndex: number;
  sessionId: string;
  loggedSet: LoggedSet | undefined;
  isReadOnly: boolean;
  inputsOnly?: boolean;
}

function formatNumber(value: number) {
  return Number.isInteger(value) ? String(value) : value.toFixed(1);
}

const SeriesInputRow = forwardRef<SeriesInputRowHandle, SeriesInputRowProps>(
  function SeriesInputRow(
    {
      exercise,
      series,
      seriesIndex,
      sessionId,
      loggedSet,
      isReadOnly,
      inputsOnly = false,
    },
    ref,
  ) {
    const addRecord = useAddRecord(sessionId);
    const updateRecord = useUpdateRecord(sessionId);
    const [isEditing, setIsEditing] = useState(false);
    const [weight, setWeight] = useState<string>("0.5");
    const [reps, setReps] = useState<string>(String(series.reps));
    const [rest, setRest] = useState<string>(String(series.restTime ?? "0"));
    const [logError, setLogError] = useState<string | null>(null);
    const [numpadTarget, setNumpadTarget] = useState<"weight" | "rest" | null>(
      null,
    );

    const showInputs = !loggedSet || isEditing;
    const color = SERIES_COLOR[series.type];
    const isBusy = addRecord.isPending || updateRecord.isPending;

    const adjustValue = (value: string, delta: number, min = 0) => {
      const parsed = parseFloat(value) || 0;
      const nextValue = Math.max(min, parsed + delta);
      return String(nextValue);
    };

    const handleCheck = useCallback((): Promise<boolean> => {
      if (isBusy || isReadOnly) return Promise.resolve(false);
      if (loggedSet && !isEditing) return Promise.resolve(true);

      setLogError(null);
      const parsedWeight = parseFloat(weight);
      const safeWeight = parsedWeight >= 0.5 ? parsedWeight : 0.5;
      const safeReps = Math.max(0, parseInt(reps, 10) || 0);
      const safeRest = Math.max(0, parseInt(rest, 10) || 0);

      const payload = {
        exerciseName: exercise.name,
        seriesType: series.type,
        seriesOrder: seriesIndex + 1,
        weight: safeWeight,
        repsCompleted: safeReps,
        restTime: safeRest,
      };

      if (isEditing && loggedSet) {
        return new Promise((resolve) => {
          updateRecord.mutate(
            {
              recordId: loggedSet._id,
              payload,
            },
            {
              onSuccess: () => {
                setIsEditing(false);
                resolve(true);
              },
              onError: () => {
                setLogError("Erro ao salvar. Tente novamente.");
                resolve(false);
              },
            },
          );
        });
      }

      return new Promise((resolve) => {
        addRecord.mutate(payload, {
          onSuccess: () => resolve(true),
          onError: () => {
            setLogError("Erro ao registrar. Tente novamente.");
            resolve(false);
          },
        });
      });
    }, [
      isBusy,
      isReadOnly,
      loggedSet,
      isEditing,
      weight,
      reps,
      rest,
      exercise.name,
      series.type,
      seriesIndex,
      updateRecord,
      addRecord,
    ]);

    useImperativeHandle(
      ref,
      () => ({
        check: handleCheck,
        getRestTime: () =>
          Math.max(0, parseInt(rest, 10) || series.restTime || 0),
      }),
      [handleCheck, rest, series.restTime],
    );

    const handleEditClick = () => {
      if (!loggedSet) return;
      setWeight(String(loggedSet.weight));
      setReps(String(loggedSet.repsCompleted));
      setRest(String(loggedSet.restTime));
      setIsEditing(true);
    };

    return (
      <StyledSeriesRow
        $logged={!!loggedSet && !isEditing}
        $inputsOnly={inputsOnly}
      >
        {!inputsOnly && (
          <StyledSeriesTopRow>
            <StyledSeriesTypeBadge $bg={color.bg} $text={color.text}>
              {SERIES_ABBR[series.type]}
            </StyledSeriesTypeBadge>
            <StyledSeriesName>
              {strings.workout.seriesLabel(seriesIndex + 1)}
            </StyledSeriesName>
            <StyledSeriesGoal>
              {strings.workout.goalLabel(series.reps)}
            </StyledSeriesGoal>
          </StyledSeriesTopRow>
        )}

        {showInputs ? (
          <StyledSeriesInputsRow>
            <StyledCounterCard>
              <StyledCardTopRow>
                <StyledCardLabel>{strings.workout.weightShort}</StyledCardLabel>
                {!isReadOnly && (
                  <StyledNumPadTrigger
                    type="button"
                    aria-label="Digitar peso"
                    onClick={() => setNumpadTarget("weight")}
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M20 3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-9 3h2v2h-2V6zm0 4h2v2h-2v-2zM8 6h2v2H8V6zm0 4h2v2H8v-2zm-2 8H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V8h2v2zm0-4H4V6h2v2zm10 12H8v-2h8v2zm2-4h-2v-2h2v2zm0-4h-2v-2h2v2zm0-4h-2V6h2v2zm2 12h-2v-2h2v2zm0-4h-2v-2h2v2zm0-4h-2V8h2v2zm0-4h-2V6h2v2z" />
                    </svg>
                  </StyledNumPadTrigger>
                )}
              </StyledCardTopRow>
              <StyledCardValue>
                {formatNumber(parseFloat(weight) || 0.5)}
              </StyledCardValue>
              <StyledCardControls>
                <StyledControlBtn
                  type="button"
                  onClick={() => setWeight(adjustValue(weight, -0.5, 0.5))}
                  disabled={isReadOnly}
                >
                  -
                </StyledControlBtn>
                <StyledControlBtn
                  type="button"
                  $filled
                  onClick={() => setWeight(adjustValue(weight, 0.5, 0.5))}
                  disabled={isReadOnly}
                >
                  +
                </StyledControlBtn>
              </StyledCardControls>
            </StyledCounterCard>

            <StyledCounterCard>
              <StyledCardLabel>{strings.workout.repsShort}</StyledCardLabel>
              <StyledCardValue>
                {formatNumber(parseFloat(reps) || series.reps)}
              </StyledCardValue>
              <StyledCardControls>
                <StyledControlBtn
                  type="button"
                  onClick={() => setReps(adjustValue(reps, -1, 0))}
                  disabled={isReadOnly}
                >
                  -
                </StyledControlBtn>
                <StyledControlBtn
                  type="button"
                  $filled
                  onClick={() => setReps(adjustValue(reps, 1, 0))}
                  disabled={isReadOnly}
                >
                  +
                </StyledControlBtn>
              </StyledCardControls>
            </StyledCounterCard>

            <StyledCounterCard>
              <StyledCardTopRow>
                <StyledCardLabel>{strings.workout.restShort}</StyledCardLabel>
                {!isReadOnly && (
                  <StyledNumPadTrigger
                    type="button"
                    aria-label="Digitar descanso"
                    onClick={() => setNumpadTarget("rest")}
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M20 3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-9 3h2v2h-2V6zm0 4h2v2h-2v-2zM8 6h2v2H8V6zm0 4h2v2H8v-2zm-2 8H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V8h2v2zm0-4H4V6h2v2zm10 12H8v-2h8v2zm2-4h-2v-2h2v2zm0-4h-2v-2h2v2zm0-4h-2V6h2v2zm2 12h-2v-2h2v2zm0-4h-2v-2h2v2zm0-4h-2V8h2v2zm0-4h-2V6h2v2z" />
                    </svg>
                  </StyledNumPadTrigger>
                )}
              </StyledCardTopRow>
              <StyledCardValue>
                {formatNumber(parseFloat(rest) || series.restTime || 0)}
              </StyledCardValue>
              <StyledCardControls>
                <StyledControlBtn
                  type="button"
                  onClick={() => setRest(adjustValue(rest, -5, 0))}
                  disabled={isReadOnly}
                >
                  -
                </StyledControlBtn>
                <StyledControlBtn
                  type="button"
                  $filled
                  onClick={() => setRest(adjustValue(rest, 5, 0))}
                  disabled={isReadOnly}
                >
                  +
                </StyledControlBtn>
              </StyledCardControls>
            </StyledCounterCard>
          </StyledSeriesInputsRow>
        ) : (
          <StyledLoggedSummary>
            <div>
              <StyledLoggedLabel>
                {strings.workout.weightShort}
              </StyledLoggedLabel>
              <StyledLoggedValue>{loggedSet!.weight}</StyledLoggedValue>
            </div>
            <div>
              <StyledLoggedLabel>{strings.workout.repsShort}</StyledLoggedLabel>
              <StyledLoggedValue>{loggedSet!.repsCompleted}</StyledLoggedValue>
            </div>
            <div>
              <StyledLoggedLabel>{strings.workout.restShort}</StyledLoggedLabel>
              <StyledLoggedValue>{loggedSet!.restTime}</StyledLoggedValue>
            </div>
          </StyledLoggedSummary>
        )}

        {!inputsOnly && (
          <StyledActionRow>
            {!isReadOnly && (
              <StyledCheckBtn
                $logged={!!loggedSet && !isEditing}
                onClick={() => {
                  void handleCheck();
                }}
                disabled={isBusy}
              >
                {isBusy ? (
                  <span style={{ fontSize: 11 }}>...</span>
                ) : (
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                  </svg>
                )}
              </StyledCheckBtn>
            )}

            {!isReadOnly && loggedSet && !isEditing && (
              <StyledEditPencilBtn
                type="button"
                onClick={handleEditClick}
                aria-label={strings.common.ariaEditSet}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zm17.71-10.21c.39-.39.39-1.02 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
                </svg>
              </StyledEditPencilBtn>
            )}
          </StyledActionRow>
        )}

        {!inputsOnly && (
          <StyledSeriesDots>
            {Array.from({ length: exercise.series.length }).map((_, index) => (
              <StyledSeriesDot key={index} $active={index === seriesIndex} />
            ))}
          </StyledSeriesDots>
        )}

        {logError && <StyledSeriesError>{logError}</StyledSeriesError>}

        {numpadTarget && (
          <NumPad
            value={numpadTarget === "weight" ? weight : rest}
            label={
              numpadTarget === "weight"
                ? strings.workout.weightShort
                : strings.workout.restShort
            }
            allowDecimal={numpadTarget === "weight"}
            onConfirm={(val) => {
              if (numpadTarget === "weight") setWeight(val);
              else setRest(val);
            }}
            onClose={() => setNumpadTarget(null)}
          />
        )}
      </StyledSeriesRow>
    );
  },
);

export default SeriesInputRow;
