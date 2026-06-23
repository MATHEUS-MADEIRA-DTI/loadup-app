# Implementation Plan: Rest Timer

**Branch**: `008-rest-timer` | **Date**: 2026-06-23 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `specs/008-rest-timer/spec.md`

## Summary

Adicionar campo `restTime` (segundos) ao subdocumento de exercício no backend (MongoDB/Mongoose + NestJS) e expô-lo nas APIs de criação e edição. No frontend (Next.js + styled-components), incluir o campo no `AddExerciseModal` e no `EditExerciseModal`, e criar o componente `RestTimerButton` na tela de treino ativo (`SessionView`), que exibe um cronômetro regressivo local com notificação visual, sonora (Web Audio API) e tátil (Vibration API) ao atingir zero.

## Technical Context

**Language/Version**: TypeScript 5.x (strict) — frontend (Next.js 14, React 18) e backend (NestJS 10, Node.js 20)  
**Primary Dependencies**: styled-components (UI), @tanstack/react-query (estado servidor), Mongoose (ODM), class-validator (DTOs)  
**Storage**: MongoDB — campo `restTime: number` adicionado ao subdocumento `Exercise` da `TrainingSheet`  
**Testing**: `npx tsc --noEmit` (zero erros) — único gate de qualidade (sem testes unitários no escopo)  
**Target Platform**: PWA mobile-first (iOS 13+ Safari, Android 8+ Chrome)  
**Project Type**: Web application full-stack (backend API REST + frontend SPA)  
**Performance Goals**: Cronômetro com tick de 1 segundo via `setInterval`; notificação em ≤ 50ms do zero  
**Constraints**: Sem background timer (para quando o usuário sai da tela); Web Audio API e Vibration API usadas sem permissão explícita; `restTime` máximo 5999s  
**Scale/Scope**: Modificação incremental em dois módulos existentes (exercises backend, train frontend) + criação de 1 novo componente

## Constitution Check

_GATE: Nenhuma constituição de projeto definida — aplicar regras de `specs/technical-decisions.md`._

| Regra                                         | Status       | Notas                         |
| --------------------------------------------- | ------------ | ----------------------------- |
| `strict: true` TypeScript em ambas as stacks  | ✅ Pass      | Mantido sem alteração         |
| Zero styled-components em `page.tsx`          | ✅ Pass      | Timer será componente próprio |
| Tokens de tema exclusivos (sem hex hardcoded) | ✅ Pass      | Verificar no StyledRestTimer  |
| DELETE retorna 204                            | N/A          | Nenhum DELETE nesta spec      |
| `restTime` ≥ 1 e ≤ 5999 validado no DTO       | ✅ Planejado | `@Min(1) @Max(5999)` no DTO   |

## Project Structure

### Documentation (this feature)

```text
specs/008-rest-timer/
├── plan.md         ← este arquivo
├── research.md     ← Phase 0
├── data-model.md   ← Phase 1
├── contracts/      ← Phase 1 (PATCH endpoint atualizado)
└── tasks.md        ← gerado por /speckit.tasks
```

### Source Code

```text
backend/src/
├── training-sheet/schemas/exercise.schema.ts   ← ADD: restTime?: number
├── exercises/dto/create-exercise.dto.ts        ← ADD: @IsOptional @IsInt @Min(1) @Max(5999) restTime?
├── exercises/dto/update-exercise.dto.ts        ← herdado via PartialType (automático)
└── exercises/exercises.service.ts              ← ADD: persistir restTime em addExerciseToDay e updateExerciseInDay

frontend/src/
├── types/trainingSheet.ts                      ← ADD: restTime?: number em Exercise, CreateExercisePayload, UpdateExercisePayload
├── constants/strings.ts                        ← ADD: strings.restTimer.*
├── app/(app)/training-plan/[dayOfWeek]/components/
│   └── AddExerciseModal/
│       ├── index.tsx                           ← ADD: campo restTime no formulário manual
│       └── styles.ts                           ← ADD: StyledRestTimeInput, StyledRestTimeLabel, StyledRestTimeHint
└── app/(app)/train/components/
    ├── SessionView/index.tsx                   ← ADD: <RestTimerButton> por exercício
    └── RestTimerButton/
        ├── index.tsx                           ← NEW: cronômetro regressivo local
        └── styles.ts                           ← NEW: styled components do timer
```

## Complexity Tracking

> Nenhuma violação identificada — feature é puramente incremental nos módulos existentes.
