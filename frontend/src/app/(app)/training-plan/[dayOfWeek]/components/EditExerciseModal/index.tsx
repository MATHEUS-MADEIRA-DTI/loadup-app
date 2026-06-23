"use client";

import { useEffect, useState } from "react";

import Modal from "@/components/Modal";
import { strings } from "@/constants/strings";
import { useDeleteExercise, useUpdateExercise } from "@/hooks/useExercises";
import {
  DayOfWeek,
  Exercise,
  MuscleGroup,
  Series,
  SeriesType,
  UpdateExercisePayload,
} from "@/types";

import {
  StyledActions,
  StyledAddSeriesBtn,
  StyledCancelBtn,
  StyledConfirm,
  StyledConfirmActions,
  StyledConfirmText,
  StyledDeleteBtn,
  StyledDeleteConfirmBtn,
  StyledError,
  StyledFieldGroup,
  StyledForm,
  StyledInput,
  StyledLabel,
  StyledMuscleChip,
  StyledMuscleGrid,
  StyledRemoveBtn,
  StyledRepsInput,
  StyledSegmentBtn,
  StyledSegmented,
  StyledSeriesIndex,
  StyledSeriesRow,
  StyledSubmitBtn,
} from "./styles";

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
  const handleAddSeries = () =>
    setSeriesList((prev) => [...prev, { type: "working", reps: 10 }]);
  const handleRemoveSeries = (i: number) => {
    if (seriesList.length === 1) return;
    setSeriesList((prev) => prev.filter((_, idx) => idx !== i));
  };
  const handleSeriesChange = (
    i: number,
    field: "type" | "reps",
    value: string | number,
  ) => {
    setSeriesList((prev) =>
      prev.map((s, idx) =>
        idx === i
          ? { ...s, [field]: field === "reps" ? Number(value) : value }
          : s,
      ),
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
  const handleDelete = () =>
    deleteExercise.mutate(exercise._id, { onSuccess: handleClose });

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

          <StyledFieldGroup>
            <StyledLabel>{strings.exercises.seriesLabel}</StyledLabel>
            {seriesList.map((series, i) => (
              <StyledSeriesRow key={i}>
                <StyledSeriesIndex>{i + 1}</StyledSeriesIndex>
                <StyledSegmented>
                  {SERIES_TYPES.map((t) => (
                    <StyledSegmentBtn
                      key={t}
                      type="button"
                      $active={series.type === t}
                      onClick={() => handleSeriesChange(i, "type", t)}
                    >
                      {strings.exercises.seriesType[t]}
                    </StyledSegmentBtn>
                  ))}
                </StyledSegmented>
                <StyledRepsInput
                  type="number"
                  min={1}
                  max={999}
                  value={series.reps}
                  onChange={(e) =>
                    handleSeriesChange(i, "reps", e.target.value)
                  }
                  aria-label={`Série ${i + 1} reps`}
                />
                <span style={{ fontSize: 12 }}>reps</span>
                <StyledRemoveBtn
                  type="button"
                  onClick={() => handleRemoveSeries(i)}
                  disabled={seriesList.length === 1}
                  aria-label={strings.common.ariaRemoveSet}
                >
                  ×
                </StyledRemoveBtn>
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
