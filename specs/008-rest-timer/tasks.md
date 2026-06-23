# Tasks: Rest Timer (008)

**Input**: Design documents from `specs/008-rest-timer/`
**Prerequisites**: plan.md ✅ · spec.md ✅ · research.md ✅ · data-model.md ✅ · contracts/ ✅

---

## Format: `[ID] [P?] [Story?] Description`

- **[P]**: Pode rodar em paralelo (arquivos diferentes, sem dependências de tarefas incompletas)
- **[US1]**: User Story 1 — Configurar tempo de descanso ao criar/editar exercício
- **[US2]**: User Story 2 — Acionar cronômetro regressivo durante o treino
- **[US3]**: User Story 3 — Notificação ao fim do descanso

---

## Phase 1: Foundational (Blocking Prerequisites)

**Purpose**: Alterações de schema, DTO, tipos e utilitários que bloqueiam TODAS as user stories. Nada de US1, US2 ou US3 pode começar antes desta fase.

- [x] T001 Adicionar campo `restTime?: number` ao schema Mongoose em `backend/src/training-sheet/schemas/exercise.schema.ts`
- [x] T002 [P] Adicionar `@IsOptional() @IsInt() @Min(1) @Max(5999) restTime?: number` ao DTO em `backend/src/exercises/dto/create-exercise.dto.ts` (importar `IsInt, Min, Max` de `class-validator`)
- [x] T003 [P] Adicionar `restTime?: number` às interfaces `Exercise`, `CreateExercisePayload` e `UpdateExercisePayload` em `frontend/src/types/trainingSheet.ts`
- [x] T004 [P] Adicionar namespace `restTimer` em `frontend/src/constants/strings.ts` com as chaves: `fieldLabel`, `fieldHint` (função `(s) => formatMMSS(s)`), `buttonIdle`, `buttonRunning`, `buttonCancel`, `finishedMessage`
- [x] T005 [P] Criar utilitário `frontend/src/lib/formatMMSS.ts` exportando `formatMMSS(totalSeconds: number): string` que retorna `"MM:SS"` (ex: 90 → `"1:30"`)

**Checkpoint**: Schema, DTO, tipos e utilitários prontos → US1 e US2 podem começar em paralelo

---

## Phase 2: User Story 1 — Configurar tempo de descanso (Priority: P1) 🎯 MVP

**Goal**: O usuário consegue definir e salvar um tempo de descanso ao criar ou editar um exercício na ficha.

**Independent Test**: Criar exercício com `restTime: 90` via `AddExerciseModal` → conferir no GET `/training-sheet` que o campo foi persistido → abrir `EditExerciseModal` e confirmar que o campo exibe `90`.

- [x] T006 [P] [US1] Persistir `restTime` nos métodos `addExerciseToDay` e `updateExerciseInDay` em `backend/src/exercises/exercises.service.ts` (seguir padrão de spread condicional já usado para `videoUrl`/`tip`)
- [x] T007 [P] [US1] Adicionar styled components `StyledRestTimeRow`, `StyledRestTimeInput`, `StyledRestTimeHint` em `frontend/src/app/(app)/training-plan/[dayOfWeek]/components/AddExerciseModal/styles.ts`
- [x] T008 [US1] Adicionar campo `restTime` ao formulário manual do `AddExerciseModal` em `frontend/src/app/(app)/training-plan/[dayOfWeek]/components/AddExerciseModal/index.tsx`: estado `restTime: number | undefined`, input numérico com hint MM:SS, incluir no payload de submit e no `resetForm`
- [x] T009 [US1] Adicionar campo `restTime` ao `EditExerciseModal` em `frontend/src/app/(app)/training-plan/[dayOfWeek]/components/EditExerciseModal.tsx`: estado inicializado com `exercise.restTime`, input numérico com hint MM:SS, incluir no `UpdateExercisePayload` do submit e sincronizar no `useEffect` de reset

**Checkpoint**: Tempo de descanso configurável e persistido — US1 completa e testável de forma independente

---

## Phase 3: User Story 2 — Cronômetro no treino (Priority: P1)

**Goal**: Durante o treino ativo, exercícios com `restTime` exibem um botão "Descanso" que aciona um cronômetro regressivo local.

**Independent Test**: Iniciar treino com exercício que tem `restTime: 60` → clicar "Descanso" → cronômetro exibe `1:00` e conta regressivamente → clicar cancelar → volta ao botão inicial.

- [x] T010 [P] [US2] Criar styled components do cronômetro em `frontend/src/app/(app)/train/components/RestTimerButton/styles.ts`: `StyledRestBtn` (estado idle), `StyledTimerDisplay` (contador MM:SS em andamento), `StyledCancelBtn`, `StyledFinishedMsg` (estado finalizado)
- [x] T011 [US2] Criar componente `frontend/src/app/(app)/train/components/RestTimerButton/index.tsx` com props `{ restTime: number; exerciseName: string }`, estados `isRunning`, `remaining`, `isFinished`, lógica `setInterval` em `useRef` com cleanup no `useEffect`, botão idle → running → finished
- [x] T012 [US2] Integrar `<RestTimerButton>` na `SessionView` em `frontend/src/app/(app)/train/components/SessionView/index.tsx`: renderizar abaixo do `StyledSeriesList` de cada exercício, somente quando `exercise.restTime && exercise.restTime > 0`

**Checkpoint**: Cronômetro funcional no treino — US2 completa e testável de forma independente

---

## Phase 4: User Story 3 — Notificação ao fim do descanso (Priority: P2)

**Goal**: Quando o cronômetro chega a zero, o app notifica visualmente, emite um beep e vibra o dispositivo.

**Independent Test**: Configurar `restTime: 5` → acionar cronômetro → aguardar zero → verificar mudança visual de estado + som + vibração (testar em dispositivo ou Chrome com DevTools).

- [x] T013 [US3] Criar `frontend/src/lib/restTimerNotification.ts` exportando `playAlertSound()` (beep 880Hz via Web Audio API, 200ms, gain exponential ramp) e `vibrateAlert()` (padrão `[200, 100, 200]` via Vibration API) — ambas com try/catch silencioso
- [x] T014 [US3] Integrar `playAlertSound()` e `vibrateAlert()` no `RestTimerButton` em `frontend/src/app/(app)/train/components/RestTimerButton/index.tsx`: chamar as funções quando `remaining` chega a 1→0 dentro do `setInterval`

**Checkpoint**: Notificação completa — US3 entregue; todas as user stories funcionais

---

## Phase Final: Polish

- [x] T015 Rodar `npx tsc --noEmit` no backend (`cd backend`) e no frontend (`cd frontend`) e corrigir quaisquer erros TypeScript até saída vazia em ambos

---

## Dependencies & Execution Order

### Ordem das fases

- **Foundational (Phase 1)**: Sem dependências — iniciar imediatamente; T002–T005 em paralelo entre si, T001 pode ser paralelo também
- **US1 (Phase 2)**: Depende do Foundational completo; T006 e T007 em paralelo, T008 depende de T007, T009 independente de T008
- **US2 (Phase 3)**: Depende do Foundational completo; T010 em paralelo com T006/T007, T011 depende de T010, T012 depende de T011
- **US3 (Phase 4)**: Depende de T011 (RestTimerButton existe); T013 e T014 são sequenciais
- **Polish (Final)**: Depende de todas as fases anteriores

### Dependências entre tarefas

```
T001 → T006
T002 (parallel)
T003 (parallel) → T008, T009, T012
T004 (parallel) → T008, T009, T011
T005 (parallel) → T008, T009, T011
T007 → T008
T010 → T011 → T012, T014
T013 → T014
Todas → T015
```

### Paralelismo por fase

**Foundational**: T001 · T002 · T003 · T004 · T005 podem todos rodar em paralelo  
**US1 + US2 simultâneos**: T006 · T007 · T010 podem rodar em paralelo após Foundational

---

## Contagem de tarefas

| Fase         | Tarefas       | User Story |
| ------------ | ------------- | ---------- |
| Foundational | T001–T005 (5) | —          |
| US1          | T006–T009 (4) | US1        |
| US2          | T010–T012 (3) | US2        |
| US3          | T013–T014 (2) | US3        |
| Polish       | T015 (1)      | —          |
| **Total**    | **15**        | —          |

**MVP sugerido**: Foundational + US1 + US2 (T001–T012) — cronômetro completo sem notificações sonoras/táteis
