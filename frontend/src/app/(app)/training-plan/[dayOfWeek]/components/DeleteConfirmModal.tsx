"use client";

import styled from "styled-components";

import Modal from "@/components/Modal";
import { strings } from "@/constants/strings";
import { useDeleteExercise } from "@/hooks/useExercises";
import { DayOfWeek, Exercise } from "@/types";

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

  const handleConfirm = () => {
    deleteExercise.mutate(exercise._id, { onSuccess: onClose });
  };

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

const StyledBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  margin-top: ${({ theme }) => theme.spacing.sm};
`;

const StyledMessage = styled.p`
  font-size: ${({ theme }) => theme.typography.bodyMedium.fontSize};
  color: ${({ theme }) => theme.colors.onSurfaceMuted};
  line-height: 1.5;
`;

const StyledActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  justify-content: flex-end;
`;

const StyledCancelBtn = styled.button`
  padding: 10px 20px;
  border-radius: ${({ theme }) => theme.borderRadius.pill};
  border: 1px solid ${({ theme }) => theme.colors.outlineVariant};
  background: transparent;
  color: ${({ theme }) => theme.colors.onSurface};
  font-size: ${({ theme }) => theme.typography.labelLarge.fontSize};
  font-weight: 500;
  cursor: pointer;
  font-family: inherit;
`;

const StyledDeleteBtn = styled.button`
  padding: 10px 20px;
  border-radius: ${({ theme }) => theme.borderRadius.pill};
  border: none;
  background: ${({ theme }) => theme.colors.error};
  color: #fff;
  font-size: ${({ theme }) => theme.typography.labelLarge.fontSize};
  font-weight: 600;
  cursor: pointer;
  font-family: inherit;
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;
