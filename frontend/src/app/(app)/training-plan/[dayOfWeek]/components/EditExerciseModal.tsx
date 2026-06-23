"use client";

import { useEffect, useState } from "react";
import { Timer } from "lucide-react";
import styled from "styled-components";

import Modal from "@/components/Modal";
import { strings } from "@/constants/strings";
import { useDeleteExercise, useUpdateExercise } from "@/hooks/useExercises";
import { formatMMSS } from "@/lib/formatMMSS";
import {
  DayOfWeek,
  Exercise,
  MuscleGroup,
  Series,
  SeriesType,
  UpdateExercisePayload,
} from "@/types";

const MUSCLE_GROUPS: MuscleGroup[] = [
  "Peito",
  "Tríceps",
  "Costas",
  "Bíceps",
  "Ombros",
  "Abdômen",
  "Perna",
  "Glúteo",
];

const SERIES_TYPES: SeriesType[] = ["warm-up", "adjustment", "working"];

interface EditExerciseModalProps {
  isOpen: boolean;
  onClose: () => void;
  dayOfWeek: DayOfWeek;
  exercise: Exercise;
}

export default function EditExerciseModal({
  isOpen,
  onClose,
  dayOfWeek,
  exercise,
}: EditExerciseModalProps) {
  const updateExercise = useUpdateExercise(dayOfWeek);
  const deleteExercise = useDeleteExercise(dayOfWeek);

  const [name, setName] = useState(exercise.name);
  const [muscleGroup, setMuscleGroup] = useState<MuscleGroup>(
    exercise.muscleGroup,
  );
  const [seriesList, setSeriesList] = useState<Series[]>(exercise.series);
  const [confirmDelete, setConfirmDelete] = useState(false);

  // Sync when exercise prop changes
  useEffect(() => {
    setName(exercise.name);
    setMuscleGroup(exercise.muscleGroup);
    setSeriesList(exercise.series);
    setConfirmDelete(false);
  }, [exercise]);

  const handleClose = () => {
    setConfirmDelete(false);
    onClose();
  };

  const handleAddSeries = () => {
    setSeriesList((prev) => [...prev, { type: "working", reps: 10 }]);
  };

  const handleRemoveSeries = (index: number) => {
    if (seriesList.length === 1) return;
    setSeriesList((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSeriesChange = (
    index: number,
    field: "type" | "reps" | "restTime",
    value: string | number,
  ) => {
    setSeriesList((prev) =>
      prev.map((s, i) => {
        if (i !== index) return s;
        if (field === "restTime") {
          const n = Number(value);
          return { ...s, restTime: value === "" || n <= 0 ? undefined : n };
        }
        return { ...s, [field]: field === "reps" ? Number(value) : value };
      }),
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const payload: UpdateExercisePayload = {
      name: name.trim(),
      muscleGroup,
      series: seriesList,
    };

    updateExercise.mutate(
      { id: exercise._id, payload },
      { onSuccess: handleClose },
    );
  };

  const handleDelete = () => {
    deleteExercise.mutate(exercise._id, { onSuccess: handleClose });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={strings.exercises.editButton}
    >
      {confirmDelete ? (
        <StyledConfirm>
          <StyledConfirmText>
            {strings.exercises.deleteConfirm}
          </StyledConfirmText>
          <StyledConfirmActions>
            <StyledCancelBtn
              type="button"
              onClick={() => setConfirmDelete(false)}
            >
              {strings.exercises.cancelButton}
            </StyledCancelBtn>
            <StyledDeleteConfirmBtn
              type="button"
              onClick={handleDelete}
              disabled={deleteExercise.isPending}
            >
              {deleteExercise.isPending
                ? strings.common.loading
                : strings.exercises.deleteButton}
            </StyledDeleteConfirmBtn>
          </StyledConfirmActions>
        </StyledConfirm>
      ) : (
        <StyledForm onSubmit={handleSubmit}>
          {/* Name */}
          <StyledFieldGroup>
            <StyledLabel>{strings.exercises.nameLabel}</StyledLabel>
            <StyledInput
              type="text"
              placeholder={strings.exercises.namePlaceholder}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </StyledFieldGroup>

          {/* Muscle group */}
          <StyledFieldGroup>
            <StyledLabel>{strings.exercises.muscleGroupLabel}</StyledLabel>
            <StyledMuscleGrid>
              {MUSCLE_GROUPS.map((mg) => (
                <StyledMuscleChip
                  key={mg}
                  type="button"
                  $selected={muscleGroup === mg}
                  onClick={() => setMuscleGroup(mg)}
                >
                  {strings.exercises.muscleGroups[mg]}
                </StyledMuscleChip>
              ))}
            </StyledMuscleGrid>
          </StyledFieldGroup>

          {/* Series */}
          <StyledFieldGroup>
            <StyledLabel>{strings.exercises.seriesLabel}</StyledLabel>
            {seriesList.map((series, index) => (
              <StyledSeriesRow key={index}>
                <StyledSeriesTopRow>
                  <StyledSeriesIndex>{index + 1}</StyledSeriesIndex>
                  <StyledSegmented>
                    {SERIES_TYPES.map((t) => (
                      <StyledSegmentBtn
                        key={t}
                        type="button"
                        $active={series.type === t}
                        onClick={() => handleSeriesChange(index, "type", t)}
                      >
                        {strings.exercises.seriesType[t]}
                      </StyledSegmentBtn>
                    ))}
                  </StyledSegmented>
                  <StyledRemoveBtn
                    type="button"
                    onClick={() => handleRemoveSeries(index)}
                    disabled={seriesList.length === 1}
                    aria-label={strings.common.ariaRemoveSet}
                  >
                    ×
                  </StyledRemoveBtn>
                </StyledSeriesTopRow>
                <StyledSeriesBottomRow>
                  <StyledSeriesInputGroup>
                    <StyledRepsInput
                      type="number"
                      min={1}
                      max={999}
                      value={series.reps}
                      onChange={(e) =>
                        handleSeriesChange(index, "reps", e.target.value)
                      }
                      aria-label={`Série ${index + 1} reps`}
                    />
                    <StyledSeriesInputLabel>reps</StyledSeriesInputLabel>
                  </StyledSeriesInputGroup>
                  <StyledSeriesInputLabel>·</StyledSeriesInputLabel>
                  <StyledSeriesInputGroup $primary>
                    <Timer
                      size={13}
                      style={{ color: "inherit", flexShrink: 0 }}
                    />
                    <StyledSeriesRestInput
                      type="number"
                      min={1}
                      max={5999}
                      placeholder="—"
                      value={series.restTime ?? ""}
                      onChange={(e) =>
                        handleSeriesChange(index, "restTime", e.target.value)
                      }
                      aria-label={`Série ${index + 1} descanso em segundos`}
                    />
                    <StyledSeriesInputLabel>s</StyledSeriesInputLabel>
                  </StyledSeriesInputGroup>
                </StyledSeriesBottomRow>
              </StyledSeriesRow>
            ))}
            <StyledAddSeriesBtn type="button" onClick={handleAddSeries}>
              + {strings.exercises.addSeriesButton}
            </StyledAddSeriesBtn>
          </StyledFieldGroup>

          {(updateExercise.isError || deleteExercise.isError) && (
            <StyledError>{strings.common.error}</StyledError>
          )}

          <StyledActions>
            <StyledDeleteBtn
              type="button"
              onClick={() => setConfirmDelete(true)}
            >
              {strings.exercises.deleteButton}
            </StyledDeleteBtn>
            <StyledSubmitBtn
              type="submit"
              disabled={updateExercise.isPending || !name.trim()}
            >
              {updateExercise.isPending
                ? strings.common.loading
                : strings.exercises.saveButton}
            </StyledSubmitBtn>
          </StyledActions>
        </StyledForm>
      )}
    </Modal>
  );
}

/* ─── Styles ──────────────────────────────────────────────────────────── */
const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  margin-top: ${({ theme }) => theme.spacing.sm};
`;

const StyledFieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const StyledLabel = styled.label`
  font-size: ${({ theme }) => theme.typography.labelLarge.fontSize};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.onSurface};
`;

const StyledInput = styled.input`
  height: 48px;
  padding: 0 ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.outlineVariant};
  border-radius: ${({ theme }) => theme.borderRadius.chip};
  font-size: ${({ theme }) => theme.typography.bodyMedium.fontSize};
  color: ${({ theme }) => theme.colors.onSurface};
  background: ${({ theme }) => theme.colors.background};
  font-family: inherit;
  width: 100%;
  box-sizing: border-box;
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const StyledMuscleGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const StyledMuscleChip = styled.button<{ $selected: boolean }>`
  padding: 6px 14px;
  border-radius: ${({ theme }) => theme.borderRadius.chip};
  border: 1.5px solid
    ${({ theme, $selected }) =>
      $selected ? theme.colors.primary : theme.colors.outlineVariant};
  background: ${({ theme, $selected }) =>
    $selected ? theme.colors.primaryContainer : "transparent"};
  color: ${({ theme, $selected }) =>
    $selected ? theme.colors.primary : theme.colors.onSurfaceMuted};
  font-size: 13px;
  font-weight: ${({ $selected }) => ($selected ? 600 : 400)};
  cursor: pointer;
  font-family: inherit;
  transition: all 150ms ease;
`;

const StyledSeriesRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
  padding: ${({ theme }) => theme.spacing.sm};
  border: 1px solid ${({ theme }) => theme.colors.outlineVariant};
  border-radius: ${({ theme }) => theme.borderRadius.chip};
  background: ${({ theme }) => theme.colors.surface};
`;

const StyledSeriesTopRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const StyledSeriesBottomRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding-left: 22px;
`;

const StyledSeriesInputGroup = styled.div<{ $primary?: boolean }>`
  display: flex;
  align-items: center;
  gap: 5px;
  color: ${({ theme, $primary }) =>
    $primary ? theme.colors.primary : theme.colors.onSurfaceMuted};
`;

const StyledSeriesInputLabel = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.onSurfaceMuted};
  white-space: nowrap;
`;

const StyledSeriesIndex = styled.span`
  font-size: 12px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.onSurfaceMuted};
  width: 16px;
  flex-shrink: 0;
`;

const StyledSegmented = styled.div`
  display: flex;
  border: 1px solid ${({ theme }) => theme.colors.outlineVariant};
  border-radius: ${({ theme }) => theme.borderRadius.chip};
  overflow: hidden;
  flex: 1;
`;

const StyledSegmentBtn = styled.button<{ $active: boolean }>`
  flex: 1;
  padding: 6px 4px;
  border: none;
  background: ${({ theme, $active }) =>
    $active ? theme.colors.primary : "transparent"};
  color: ${({ theme, $active }) =>
    $active ? theme.colors.onPrimary : theme.colors.onSurfaceMuted};
  font-size: 11px;
  font-weight: ${({ $active }) => ($active ? 600 : 400)};
  cursor: pointer;
  font-family: inherit;
  transition: all 150ms ease;
`;

const StyledRepsInput = styled.input`
  width: 52px;
  height: 32px;
  text-align: center;
  border: 1px solid ${({ theme }) => theme.colors.outlineVariant};
  border-radius: ${({ theme }) => theme.borderRadius.chip};
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.onSurface};
  background: ${({ theme }) => theme.colors.background};
  font-family: inherit;
  flex-shrink: 0;
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const StyledSeriesRestInput = styled.input`
  width: 52px;
  height: 32px;
  text-align: center;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.chip};
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
  background: ${({ theme }) => theme.colors.primaryContainer};
  font-family: inherit;
  flex-shrink: 0;
  &:focus {
    outline: none;
    box-shadow: 0 0 0 1.5px ${({ theme }) => theme.colors.primary};
  }
  &::placeholder {
    font-size: 12px;
    font-weight: 400;
    color: ${({ theme }) => theme.colors.primary};
    opacity: 0.5;
  }
  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button {
    opacity: 1;
  }
`;

const StyledRemoveBtn = styled.button`
  width: 28px;
  height: 28px;
  border: none;
  background: none;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.error};
  font-size: 20px;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  flex-shrink: 0;
  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
`;

const StyledAddSeriesBtn = styled.button`
  background: none;
  border: 1.5px dashed ${({ theme }) => theme.colors.outlineVariant};
  border-radius: ${({ theme }) => theme.borderRadius.chip};
  color: ${({ theme }) => theme.colors.primary};
  font-size: 13px;
  font-weight: 600;
  padding: 8px;
  cursor: pointer;
  width: 100%;
  font-family: inherit;
`;

const StyledRestTimeRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const StyledRestTimeInput = styled.input`
  width: 88px;
  height: 44px;
  padding: 0 ${({ theme }) => theme.spacing.sm};
  border: 1px solid ${({ theme }) => theme.colors.outlineVariant};
  border-radius: ${({ theme }) => theme.borderRadius.chip};
  font-size: ${({ theme }) => theme.typography.bodyMedium.fontSize};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.onSurface};
  background: ${({ theme }) => theme.colors.background};
  font-family: inherit;
  text-align: center;
  box-sizing: border-box;
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button {
    opacity: 1;
  }
`;

const StyledRestTimeHint = styled.span`
  font-size: ${({ theme }) => theme.typography.labelSmall.fontSize};
  color: ${({ theme }) => theme.colors.onSurfaceMuted};
  flex: 1;
`;

const StyledError = styled.p`
  font-size: ${({ theme }) => theme.typography.labelSmall.fontSize};
  color: ${({ theme }) => theme.colors.error};
`;

const StyledActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-top: ${({ theme }) => theme.spacing.xs};
`;

const StyledDeleteBtn = styled.button`
  height: 48px;
  padding: 0 ${({ theme }) => theme.spacing.md};
  border: 1.5px solid ${({ theme }) => theme.colors.error};
  border-radius: ${({ theme }) => theme.borderRadius.pill};
  background: transparent;
  color: ${({ theme }) => theme.colors.error};
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  font-family: inherit;
`;

const StyledSubmitBtn = styled.button`
  flex: 1;
  height: 48px;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.pill};
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.onPrimary};
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  font-family: inherit;
  box-shadow: ${({ theme }) => theme.shadows.primary};
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    box-shadow: none;
  }
`;

/* ─── Delete confirm ──────────────────────────────────────────────────── */
const StyledConfirm = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
  padding-top: ${({ theme }) => theme.spacing.sm};
`;

const StyledConfirmText = styled.p`
  font-size: ${({ theme }) => theme.typography.bodyMedium.fontSize};
  color: ${({ theme }) => theme.colors.onSurface};
  text-align: center;
`;

const StyledConfirmActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const StyledCancelBtn = styled.button`
  flex: 1;
  height: 48px;
  border: 1.5px solid ${({ theme }) => theme.colors.outlineVariant};
  border-radius: ${({ theme }) => theme.borderRadius.pill};
  background: transparent;
  color: ${({ theme }) => theme.colors.onSurface};
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  font-family: inherit;
`;

const StyledDeleteConfirmBtn = styled.button`
  flex: 1;
  height: 48px;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.pill};
  background: ${({ theme }) => theme.colors.error};
  color: #ffffff;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  font-family: inherit;
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;
