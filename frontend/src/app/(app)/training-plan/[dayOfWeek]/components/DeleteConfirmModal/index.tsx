"use client";

import Modal from "@/components/Modal";
import { strings } from "@/constants/strings";
import { useDeleteExercise } from "@/hooks/useExercises";
import { DayOfWeek, Exercise } from "@/types";

import {
  StyledActions,
  StyledBody,
  StyledCancelBtn,
  StyledDeleteBtn,
  StyledMessage,
} from "./styles";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  dayOfWeek: DayOfWeek;
  exercise: Exercise;
}

export default function DeleteConfirmModal({
  isOpen,
  onClose,
  dayOfWeek,
  exercise,
}: DeleteConfirmModalProps) {
  const deleteExercise = useDeleteExercise(dayOfWeek);
  const handleConfirm = () =>
    deleteExercise.mutate(exercise._id, { onSuccess: onClose });

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={strings.exercises.deleteConfirm}
    >
      <StyledBody>
        <StyledMessage>
          {strings.exercises.deleteConfirmBody(exercise.name)}
        </StyledMessage>
        <StyledActions>
          <StyledCancelBtn type="button" onClick={onClose}>
            {strings.exercises.cancelButton}
          </StyledCancelBtn>
          <StyledDeleteBtn
            type="button"
            onClick={handleConfirm}
            disabled={deleteExercise.isPending}
          >
            {deleteExercise.isPending
              ? strings.common.loading
              : strings.exercises.deleteButton}
          </StyledDeleteBtn>
        </StyledActions>
      </StyledBody>
    </Modal>
  );
}
