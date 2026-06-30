"use client";

import { useState } from "react";
import { Timer } from "lucide-react";

import { toast } from "sonner";

import Modal from "@/components/Modal";
import { strings } from "@/constants/strings";
import { useAddExercise } from "@/hooks/useExercises";
import { formatMMSS } from "@/lib/formatMMSS";
import {
  CreateExercisePayload,
  DayOfWeek,
  MuscleGroup,
  Series,
  SeriesType,
} from "@/types";
import { SearchResult } from "@/types/exerciseSearch";
import { SearchTab } from "./SearchTab";
import { CsvImportTab } from "./CsvImportTab";

import {
  TabContainer,
  TabButton,
  TabContent,
  StyledActions,
  StyledAddSeriesBtn,
  StyledCancelBtn,
  StyledFieldGroup,
  StyledForm,
  StyledInput,
  StyledLabel,
  StyledMuscleChip,
  StyledMuscleGrid,
  StyledRemoveBtn,
  StyledRepsInput,
  StyledRestTimeHint,
  StyledRestTimeInput,
  StyledRestTimeRow,
  StyledSegmentBtn,
  StyledSegmented,
  StyledSeriesBottomRow,
  StyledSeriesIndex,
  StyledSeriesInputGroup,
  StyledSeriesInputLabel,
  StyledSeriesRestInput,
  StyledSeriesRow,
  StyledSeriesTopRow,
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

interface AddExerciseModalProps {
  isOpen: boolean;
  onClose: () => void;
  dayOfWeek: DayOfWeek;
}

export default function AddExerciseModal({
  isOpen,
  onClose,
  dayOfWeek,
}: AddExerciseModalProps) {
  const addExercise = useAddExercise(dayOfWeek);
  const [activeTab, setActiveTab] = useState<"search" | "manual" | "csv">(
    "search",
  );
  const [name, setName] = useState("");
  const [muscleGroup, setMuscleGroup] = useState<MuscleGroup | "">("");
  const [videoUrl, setVideoUrl] = useState<string | undefined>();
  const [tip, setTip] = useState<string | undefined>();
  const [seriesList, setSeriesList] = useState<Series[]>([
    { type: "working", repsMin: 8, repsMax: 12 },
  ]);

  const handleExerciseSelect = (result: SearchResult) => {
    setName(result.name);
    setMuscleGroup(result.muscleGroup as MuscleGroup);
    setVideoUrl(result.videoUrl);
    setTip(result.tip);
    setActiveTab("manual");
  };

  const resetForm = () => {
    setName("");
    setMuscleGroup("");
    setVideoUrl(undefined);
    setTip(undefined);
    setSeriesList([{ type: "working", repsMin: 8, repsMax: 12 }]);
    setActiveTab("search");
  };
  const handleClose = () => {
    resetForm();
    onClose();
  };
  const handleAddSeries = () =>
    setSeriesList((prev) => [...prev, { type: "working", repsMin: 8, repsMax: 12 }]);
  const handleRemoveSeries = (i: number) => {
    if (seriesList.length === 1) return;
    setSeriesList((prev) => prev.filter((_, idx) => idx !== i));
  };
  const handleSeriesChange = (
    i: number,
    field: "type" | "repsMin" | "repsMax" | "restTime",
    value: string | number,
  ) => {
    setSeriesList((prev) =>
      prev.map((s, idx) => {
        if (idx !== i) return s;
        if (field === "restTime") {
          const n = Number(value);
          return { ...s, restTime: value === "" || n <= 0 ? undefined : n };
        }
        if (field === "type") return { ...s, type: value as SeriesType };
        return { ...s, [field]: Math.max(1, Number(value) || 1) };
      }),
    );
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !muscleGroup) return;
    const payload: CreateExercisePayload = {
      name: name.trim(),
      muscleGroup,
      series: seriesList.map((s) => ({
        type: s.type,
        repsMin: s.repsMin,
        repsMax: s.repsMax,
        ...(s.restTime != null ? { restTime: s.restTime } : {}),
      })),
      ...(videoUrl && { videoUrl }),
      ...(tip && { tip }),
    };
    addExercise.mutate(payload, {
      onSuccess: () => {
        toast.success("Exercício adicionado!");
        handleClose();
      },
      onError: () => toast.error("Erro ao adicionar exercício. Tente novamente."),
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={strings.exercises.addButton}
    >
      <TabContainer>
        <TabButton
          $isActive={activeTab === "search"}
          onClick={() => setActiveTab("search")}
        >
          Buscar
        </TabButton>
        <TabButton
          $isActive={activeTab === "manual"}
          onClick={() => setActiveTab("manual")}
        >
          Manual
        </TabButton>
        <TabButton
          $isActive={activeTab === "csv"}
          onClick={() => setActiveTab("csv")}
        >
          Importar
        </TabButton>
      </TabContainer>

      <TabContent>
        {activeTab === "search" ? (
          <SearchTab onExerciseSelect={handleExerciseSelect} />
        ) : activeTab === "csv" ? (
          <CsvImportTab dayOfWeek={dayOfWeek} />
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
                autoFocus
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
                  <StyledSeriesTopRow>
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
                    <StyledRemoveBtn
                      type="button"
                      onClick={() => handleRemoveSeries(i)}
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
                        max={200}
                        value={series.repsMin}
                        onChange={(e) =>
                          handleSeriesChange(i, "repsMin", e.target.value)
                        }
                        aria-label={`Série ${i + 1} mínimo de reps`}
                      />
                      <StyledSeriesInputLabel style={{ opacity: 0.5 }}>a</StyledSeriesInputLabel>
                      <StyledRepsInput
                        type="number"
                        min={1}
                        max={200}
                        value={series.repsMax}
                        onChange={(e) =>
                          handleSeriesChange(i, "repsMax", e.target.value)
                        }
                        aria-label={`Série ${i + 1} máximo de reps`}
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
                          handleSeriesChange(i, "restTime", e.target.value)
                        }
                        aria-label={`Série ${i + 1} descanso em segundos`}
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

            <StyledActions>
              <StyledCancelBtn type="button" onClick={handleClose}>
                {strings.exercises.cancelButton}
              </StyledCancelBtn>
              <StyledSubmitBtn
                type="submit"
                disabled={addExercise.isPending || !name.trim() || !muscleGroup}
              >
                {addExercise.isPending
                  ? strings.common.loading
                  : strings.exercises.saveButton}
              </StyledSubmitBtn>
            </StyledActions>
          </StyledForm>
        )}
      </TabContent>
    </Modal>
  );
}
