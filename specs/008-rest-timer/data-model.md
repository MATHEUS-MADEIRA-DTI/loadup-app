# Data Model: Rest Timer (008)

**Date**: 2026-06-23  
**Scope**: Extensão incremental do subdocumento `Exercise` existente

---

## Entidades Modificadas

### Exercise (subdocumento — `backend/src/training-sheet/schemas/exercise.schema.ts`)

Campo adicionado ao schema Mongoose existente:

| Campo      | Tipo     | Obrigatório | Validação       | Default     | Notas                                          |
| ---------- | -------- | ----------- | --------------- | ----------- | ---------------------------------------------- |
| `restTime` | `number` | Não         | inteiro, 1–5999 | `undefined` | Segundos de descanso configurados pelo usuário |

Todos os demais campos do subdocumento (`_id`, `name`, `muscleGroup`, `series`, `order`, `videoUrl`, `tip`, `database`) permanecem **sem alteração**.

**Compatibilidade retroativa**: Exercícios existentes sem `restTime` continuam válidos. O campo ausente é equivalente a "sem cronômetro".

---

## Entidades Frontend Modificadas

### `Exercise` (interface — `frontend/src/types/trainingSheet.ts`)

```ts
export interface Exercise {
  _id: string;
  name: string;
  muscleGroup: MuscleGroup;
  series: Series[];
  videoUrl?: string;
  tip?: string;
  restTime?: number; // ← ADICIONADO: segundos (1–5999)
}
```

### `CreateExercisePayload` (interface — `frontend/src/types/trainingSheet.ts`)

```ts
export interface CreateExercisePayload {
  name: string;
  muscleGroup: MuscleGroup;
  series: Series[];
  videoUrl?: string;
  tip?: string;
  restTime?: number; // ← ADICIONADO
}
```

### `UpdateExercisePayload` (interface — `frontend/src/types/trainingSheet.ts`)

```ts
export interface UpdateExercisePayload {
  name?: string;
  muscleGroup?: MuscleGroup;
  series?: Series[];
  videoUrl?: string;
  tip?: string;
  restTime?: number; // ← ADICIONADO
}
```

---

## DTOs Backend Modificados

### `CreateExerciseDto` (`backend/src/exercises/dto/create-exercise.dto.ts`)

```ts
@IsOptional()
@IsInt()
@Min(1)
@Max(5999)
restTime?: number;
```

### `UpdateExerciseDto` (`backend/src/exercises/dto/update-exercise.dto.ts`)

Herdado automaticamente via `PartialType(CreateExerciseDto)` — nenhuma alteração manual necessária.

---

## Novos Componentes de UI

### `RestTimerButton` (`frontend/src/app/(app)/train/components/RestTimerButton/`)

Componente de UI puro — estado local, sem chamada à API.

**Props**:

```ts
interface RestTimerButtonProps {
  restTime: number; // segundos configurados no exercício (>0 garantido pelo caller)
  exerciseName: string; // para acessibilidade (aria-label)
}
```

**Estados internos**:
| Estado | Tipo | Valor inicial | Descrição |
| ------------ | --------- | ------------- | ------------------------------------------- |
| `isRunning` | `boolean` | `false` | Se o cronômetro está em contagem regressiva |
| `remaining` | `number` | `restTime` | Segundos restantes |
| `isFinished` | `boolean` | `false` | Se o timer acabou de chegar a zero |

**Fluxo de estados**:

```
[idle: botão "Descanso"]
  → toque → [running: MM:SS + botão cancelar]
  → 0 → [finished: "Pode continuar!" + feedback sensorial]
  → toque cancelar (ou reiniciar) → [idle]
```

---

## Utilitário

### `formatMMSS` (`frontend/src/lib/formatMMSS.ts`) — ou inline em `strings.ts`

```ts
export function formatMMSS(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}
```

### `restTimerNotification` (`frontend/src/lib/restTimerNotification.ts`)

Exporta duas funções:

- `playAlertSound()` — beep via Web Audio API
- `vibrateAlert()` — dois pulsos via Vibration API

Ambas com try/catch silencioso para compatibilidade cross-browser.

---

## Diagrama de Fluxo de Dados

```
[AddExerciseModal: campo restTime]
        │
        ▼
[POST /training-sheet/days/:day/exercises]  ←  restTime?: number (1–5999)
        │
        ▼
[MongoDB: Exercise subdocument { ...existing, restTime: 90 }]
        │
        ▼
[GET /training-sheet → trainingSheet.days[].exercises[]]
        │
        ▼
[SessionView: exercise.restTime > 0 → renderiza <RestTimerButton restTime={90} />]
        │
        ▼
[RestTimerButton: setInterval local → countdown → triggerNotification()]
```
