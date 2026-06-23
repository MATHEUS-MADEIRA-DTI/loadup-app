---
description: "Task list for Exercise Search Modal (007) implementation"
---

# Tasks: 007 — Exercise Search Modal

**Feature**: 007-exercise-search  
**Status**: Ready to Implement  
**Workspace**: LoadUp Frontend (Next.js App Router)  
**Figma**: `Buolm5kzeDIg7FMTyM21r5`

> **Implementation rule**: Complete each phase fully and run `npm run build` before advancing.
> Zero TypeScript errors required at every checkpoint. Stop after each phase and wait for confirmation.

**Constraints**:

- No tests of any kind (unit, integration, e2e)
- TypeScript strict mode — no implicit `any`, no loose typing
- All strings via `src/constants/strings.ts`
- All styles in separate `styles.ts` files (co-located)
- Components max 150 lines each
- Use `apiClient` not `fetch` directly
- Debounce: `useState + useEffect + setTimeout + clearTimeout cleanup`
- Muscle filter: immediate (no debounce)
- Min 2 characters to trigger name search
- `"Todos"` = no muscle param in API call
- NO emoji/type mapping, NO equipment field (removed from spec)

**Format**: `- [ ] [ID] [P?] [Story?] Description — file path`

- **[P]**: Parallelizable (different files, no dependency on incomplete task)
- **[US#]**: User story label (US1–US6)

---

## Phase 1: Setup — Types, Strings & Services

**Purpose**: Establish TypeScript contracts, centralize all UI strings, and wire API service layers.
All user stories depend on this foundation.

**CRITICAL**: No user story work can begin until this phase is complete.

- [x] T001 Add `SearchResult` interface to `src/types/index.ts` — fields: `name: string`, `muscleGroup: string`, `videoUrl: string`, `tip?: string` (no `id`, no `type`, no `equipment`, no emoji field)
- [x] T002 Add `CsvImportError` interface to `src/types/index.ts` — fields: `row: number`, `field: string`, `message: string`
- [x] T003 Add search strings to `src/constants/strings.ts` — keys: `exerciseSearch.placeholder` (`"Buscar exercício..."`), `exerciseSearch.initialState` (`"Digite para buscar exercícios"`), `exerciseSearch.noResults` (`"Nenhum exercício encontrado"`), `exerciseSearch.error` (`"Erro ao buscar exercícios"`), `exerciseSearch.retry` (`"Tentar novamente"`)
- [x] T004 Add muscle group constants to `src/constants/strings.ts` — export `MUSCLE_GROUPS: string[]` with all 12 values in order: `Todos, Peito, Costas, Ombros, Bíceps, Tríceps, Perna, Glúteo, Abdômen, Trapézio, Antebraço, Panturrilha`
- [x] T005 Add CSV import strings to `src/constants/strings.ts` — keys: `csvImport.downloadTemplate` (`"Baixar template"`), `csvImport.chooseFile` (`"Escolher arquivo"`), `csvImport.uploadButton` (`"Enviar arquivo"`), `csvImport.success` (`"exercícios importados com sucesso"`), `csvImport.errorTitle` (`"Erro ao importar CSV"`), `csvImport.instruction` (`"Após importar configure as séries manualmente"`)
- [x] T006 [P] Create `src/services/exerciseSearchService.ts` — export `getExercisesFromAPI(name?: string, muscle?: string): Promise<SearchResult[]>` using `apiClient` with `GET /exercises/search`; export `useExerciseSearchQuery(name?: string, muscle?: string)` using React Query `useQuery` with key `["exerciseSearch", name, muscle]`; guard: skip call if neither name (>=2 chars) nor muscle provided
- [x] T007 [P] Create `src/services/csvImportService.ts` — export `downloadTemplateFile(): Promise<Blob>` calling `GET /exercises/csv-template` via `apiClient`; export `uploadCsvFile(file: File, dayOfWeek: string): Promise<{ count: number; errors: CsvImportError[] }>` calling `POST /training-sheet/days/:dayOfWeek/exercises/import` via `apiClient`
- [x] T008 Run `npm run build`

**Checkpoint**: Types defined, all strings centralized, both API service layers ready and compiling.

---

## Phase 2: Foundational — Hooks

**Purpose**: Implement search debounce logic and CSV import state management.
All UI component phases depend on these hooks being complete.

**CRITICAL**: No component work can begin until this phase is complete.

- [x] T009 [P] Create `src/hooks/useExerciseSearch.ts` — `useState` for `query: string`, `muscleGroup: "Todos" | string`, `debouncedQuery: string`; `useEffect` + `setTimeout(300ms)` + `clearTimeout` cleanup debounces name input only; parameter building: skip if `debouncedQuery < 2 chars AND muscleGroup === "Todos"`; muscle changes re-query immediately (no debounce); call `useExerciseSearchQuery`; return `{ results, isLoading, error, query, muscleGroup, setQuery, setMuscleGroup, retry }`
- [x] T010 [P] Create `src/hooks/useCsvImport.ts` — `useState` for `selectedFile: File | null`, `isLoading: boolean`, `successCount: number | undefined`, `errors: CsvImportError[]`, `error: Error | null`; implement `downloadTemplate(): Promise<void>` calling `csvImportService.downloadTemplateFile()` then triggering browser download via blob URL; implement `importCsv(file: File, dayOfWeek: string): Promise<void>` calling `csvImportService.uploadCsvFile()`; implement `reset()`; return all state + actions
- [x] T011 Run `npm run build`

**Checkpoint**: Debounce logic working, parameter building correct, CSV download/upload hook ready.

---

## Phase 3: US1 · US2 · US3 — Search Core Components (Priority: P1) MVP

**Goal**: Build the full search interface — loading skeleton, result card, and SearchTab with 12 muscle filter chips and all state messages.

**User Stories**: US1 (search), US2 (muscle filter), US3 (states)

**Independent Test**: Open modal → SearchTab shows placeholder message → type 3+ chars → LoadingSkeleton appears → results render with name, video link, muscle chip → click "Peito" filter chip → results re-filter immediately → no-results and error states display correctly

- [x] T012 [P] [US1] Create `src/components/AddExerciseModal/SearchSkeleton/index.tsx` — render 3-5 placeholder skeleton rows; import styles from `./styles.ts`; max 80 lines; no required props
- [x] T013 [P] [US1] Create `src/components/AddExerciseModal/ExerciseSearchResult/index.tsx` — props: `{ result: SearchResult; onSelect: (result: SearchResult) => void }`; render: exercise `name`, video link (`"Ver vídeo"` as `<a>` if `result.videoUrl` non-empty, otherwise `"Sem vídeo"` as plain text), `MuscleChip` with `result.muscleGroup`, optional `result.tip` below; no emoji icon, no equipment; entire row clickable via `onSelect(result)`; import styles from `./styles.ts`; max 120 lines
- [x] T014 [P] [US1] Create `src/components/AddExerciseModal/SearchSkeleton/styles.ts` — styled-components use theme tokens only; skeleton rows with animated pulse or grey background; no hardcoded colors or sizes
- [x] T015 [P] [US1] Create `src/components/AddExerciseModal/ExerciseSearchResult/styles.ts` — styled-components use theme tokens only; video link: `text-decoration: underline`, theme accent color, `cursor: pointer`; row hover state; no hardcoded values
- [x] T016 [US1] Create `src/components/AddExerciseModal/SearchTab/index.tsx` — use `useExerciseSearch` hook; render: search input (placeholder from `strings.ts`, `onChange → setQuery`); 12 muscle filter chips mapped from `MUSCLE_GROUPS` constant (`onClick → setMuscleGroup`), selected chip highlighted; conditional results area: initialState message (before search), `SearchSkeleton` (loading), `ExerciseSearchResult[]` mapped with `onSelect` prop, noResults message, error message + retry button; all text from `strings.ts`; import styles from `./styles.ts`; max 150 lines
- [x] T017 [US1] Create `src/components/AddExerciseModal/SearchTab/styles.ts` — theme-token-only styled-components; chip selected vs unselected visual states; chips row with horizontal scroll; results scroll area; no hardcoded values
- [x] T018 Run `npm run build`

**Checkpoint**: SearchTab renders with 12 chips, ExerciseSearchResult shows name + video link + muscle chip, all 4 states (initial, loading, results, error) display correctly.

---

## Phase 3.5: US7 — ExerciseCard Video and Tips (Priority: P3)

**Goal**: Add collapsible video and tips section to each ExerciseCard on training-plan/[dayOfWeek] page. No new API calls (uses existing exercise.videoUrl and exercise.tip fields).

**User Stories**: US7

**Independent Test**: Navigate to training-plan/[dayOfWeek] → see "📹 Vídeo e Dicas" section (collapsed) on each card → click to expand → two tabs appear (Vídeo | Dicas) → click Vídeo tab → YouTube thumbnail displays with name and link → click link → opens in new tab → click Dicas tab → tips list with checkmarks visible → count badge accurate → click to collapse → animation smooth

- [x] [T_YT1] [P] Create `src/lib/youtube.ts` utility — export `extractYouTubeId(url: string): string | null` supporting youtu.be/{id} and youtube.com/watch?v={id} formats, returns null if URL invalid; export `getYouTubeThumbnailUrl(videoId: string): string` returning `https://img.youtube.com/vi/{id}/maxresdefault.jpg`
- [x] [T_YT2] [P] Add video/tips strings to `src/constants/strings.ts` — keys: `videoTips.sectionLabel` (`"📹 Vídeo e Dicas"`), `videoTips.videoTab` (`"Vídeo"`), `videoTips.tipsTab` (`"Dicas"`), `videoTips.noVideo` (`"Sem vídeo disponível"`), `videoTips.noTips` (`"Sem dicas disponíveis"`), `videoTips.watchLink` (`"Buscar tutorial no YouTube"`)
- [x] [T_YT3] [US7] Create `src/components/ExerciseCard/VideoTipsSection/index.tsx` — props: `{ videoUrl?: string; tip?: string; exerciseName: string }`; state: `isExpanded` (boolean, default false), `activeTab` ("video" | "tips", default "video"); render collapsed: section label + expand arrow (∨/∧); when expanded: two tab buttons + tab content; Vídeo tab: if videoUrl, show `<img>` thumbnail (via `getYouTubeThumbnailUrl(extractYouTubeId(videoUrl))`), exercise name below, "Buscar tutorial no YouTube" link (`<a href={videoUrl} target="_blank">`), else "Sem vídeo disponível"; Dicas tab: parse `tip.split("\n").filter(Boolean)`, show count badge "Dicas ({count})", each tip as `✓ tip text`, else "Sem dicas disponíveis"; all text from `strings.ts`; max 150 lines
- [x] [T_YT4] [P] Create `src/components/ExerciseCard/VideoTipsSection/styles.ts` — `StyledSection` with smooth max-height transition for expand/collapse animation; `StyledHeader` clickable with cursor pointer; `StyledTabButton` with active/inactive states (theme colors); `StyledTabContent` flex layout; `StyledThumbnail` width 100% border-radius cursor pointer; `StyledTip` flex row with checkmark icon + text; all styles via theme tokens only, no hardcoded values
- [x] [T_YT5] [US7] Update `src/components/ExerciseCard/index.tsx` — import `VideoTipsSection`; add at bottom of card (after series list): `<VideoTipsSection videoUrl={exercise.videoUrl} tip={exercise.tip} exerciseName={exercise.name} />`; ensure existing edit/delete functionality unaffected; component stays within 150 lines
- [x] [T_YT6] Run `npm run build` — zero TypeScript errors required before proceeding to Phase 4

**Checkpoint**: VideoTipsSection renders on each ExerciseCard, collapse/expand animates smoothly, Vídeo tab shows thumbnail + link, Dicas tab shows tips + count badge, no new API calls, keyboard accessible, touch-friendly.

---

## Phase 4: US6 — CSV Import (Priority: P3)

**Goal**: Build the CSV import tab — template download button, file input, upload action, success/error feedback.

**User Stories**: US6

**Independent Test**: Click "Importar" tab → see "Baixar template" button and file input → click download → browser saves CSV → select CSV file → "Enviar arquivo" activates → click upload → success: count message → error: list shows row/field/message per error → instruction text visible

- [x] T019 [US6] Create `src/components/AddExerciseModal/CsvImportTab/index.tsx` — use `useCsvImport` hook; render: `"Baixar template"` button (`onClick → downloadTemplate()`); file input `accept=".csv"` (`onChange → setSelectedFile`); `"Enviar arquivo"` button (disabled until `selectedFile !== null`, `onClick → importCsv(selectedFile, dayOfWeek)`); loading indicator while `isLoading`; success: `"${successCount} ${strings.csvImport.success}"` message; error: list of `CsvImportError` showing `row`, `field`, `message`; instruction text from `strings.ts`; all text from `strings.ts`; import styles from `./styles.ts`; max 150 lines
- [x] T020 [US6] Create `src/components/AddExerciseModal/CsvImportTab/styles.ts` — theme-token-only styled-components; upload button enabled/disabled/loading states; error list styling; instruction text muted style; no hardcoded values
- [x] T021 Run `npm run build`

**Checkpoint**: CsvImportTab renders, download triggers file save, upload shows success count or error list per row.

---

## Phase 5: US4 · US5 — Modal Integration & Tab Interface (Priority: P2)

**Goal**: Extend `AddExerciseModal` with 3-tab layout, wire search result click to series form pre-fill, and wire CSV import result navigation.

**User Stories**: US4 (tab switching), US5 (series pre-fill)

**Independent Test**: Open modal → 3 tab buttons visible (Buscar/Manual/Importar) → default is Buscar → click Manual → existing form unchanged → click Importar → CsvImportTab renders → click Buscar → search back → click result → series form opens with name and muscleGroup pre-filled → save → return to search

- [x] T022 [US4] Modify `src/components/AddExerciseModal/index.tsx` — add `const [activeTab, setActiveTab] = useState<"search" | "manual" | "csv">("search")`; render 3 tab buttons (text from `strings.ts`); conditionally render `SearchTab`, existing manual form (zero changes to manual logic), or `CsvImportTab`; preserve all existing manual form state and submission logic exactly as-is
- [x] T023 [US4] Update `src/components/AddExerciseModal/styles.ts` — add `TabContainer`, `TabButton` (active/inactive states), `TabContent` styled-components using theme tokens only; layout supports exactly 3 equal-width tabs
- [x] T024 [US5] Wire `ExerciseSearchResult` click → series configuration form in `src/components/AddExerciseModal/index.tsx` — `onSelect` callback pre-fills `exerciseName` from `result.name` and `muscleGroup` from `result.muscleGroup` into the series form state; after successful save: reset search query and set `activeTab` to `"search"`
- [x] T025 [US6] Wire CSV import success in `src/components/AddExerciseModal/index.tsx` — after upload success display imported exercises list; each exercise shows configure button opening series form pre-filled with name/muscleGroup; after series save return to CSV results view (not search tab)
- [x] T026 Run `npm run build`

**Checkpoint**: 3 tabs work, Buscar default, Manual unchanged, search pre-fill working, CSV import navigable.

---

## Final Phase: Polish & Validation

**Goal**: Verify all success criteria, accessibility, mobile responsiveness, error handling. Final code review.

- [x] T027 [P] Verify success criteria in browser — type 2+ chars → results within 500ms after debounce; click muscle chip → API fires immediately (no debounce, check Network tab); video link opens correctly; retry button re-triggers search; modal does not freeze during rapid typing
- [x] T028 [P] Accessibility compliance — keyboard: Tab through chips and results, Enter selects; all interactive elements have ARIA labels; focus ring visible on chips and result rows; WCAG AA color contrast minimum
- [x] T029 [P] Mobile responsivity — Chrome DevTools (iPhone 12 + Pixel 5): search bar full width, filter chips scroll horizontally, result card tap targets >=44px, modal scrollable
- [x] T030 Error handling validation — mock API 500 error: verify error state + retry button; disconnect network: graceful offline message; CSV upload error: verify row-level error list renders
- [x] T031 Code review — no hardcoded strings (all from `constants/strings.ts`); no hardcoded colors/spacing (theme tokens only); all components <=150 lines; styles in separate `styles.ts`; all API calls via `apiClient`; strict TypeScript; no `any`; no tests
- [x] T032 Final `npm run build` — zero errors; strict mode; no implicit `any`

**Checkpoint**: All success criteria met, accessibility compliant, mobile responsive, error handling verified, code review passed.

---

## Dependency Graph

```
Phase 1 (T001-T008) — Types + Strings + Services
    |
Phase 2 (T009-T011) — Hooks  [T009 || T010]
    |
Phase 3 (T012-T018) — Search Core  [T012 || T013 || T014 || T015] -> T016 -> T017
    |
Phase 3.5 (T_YT1-T_YT5) — Video & Tips [T_YT1 || T_YT2] -> T_YT3 -> T_YT4 -> T_YT5
    |
Phase 4 (T019-T021) — CSV Import
    |
Phase 5 (T022-T026) — Modal Integration
    |
Final   (T027-T032) — Polish  [T027 || T028 || T029]
```

## Parallel Opportunities Per Phase

| Phase       | Parallel tasks         | Description                                       |
| ----------- | ---------------------- | ------------------------------------------------- |
| Phase 1     | T006 and T007          | exerciseSearchService.ts and csvImportService.ts  |
| Phase 2     | T009 and T010          | useExerciseSearch.ts and useCsvImport.ts          |
| Phase 3     | T012, T013, T014, T015 | SearchSkeleton and ExerciseSearchResult (4 files) |
| Phase 3.5   | T_YT1 and T_YT2        | youtube.ts utility and strings constants          |
| Final Phase | T027, T028, T029       | Success criteria, accessibility, mobile checks    |

## Implementation Strategy

**MVP Scope**: Phases 1 + 2 + 3 = US1 (search), US2 (muscle filter), US3 (states) fully working.

- After Phase 3: search feature fully functional
- After Phase 3.5: ExerciseCard video/tips fully functional
- After Phase 4: CSV import standalone works
- After Phase 5: full 3-tab modal production-ready
- After Final Phase: production-grade quality, ready for merge

**Task counts**:

- Total tasks: 38 (32 previous + 6 new for US7)
- Phase 1 (Foundation): 8 tasks
- Phase 2 (Hooks): 3 tasks
- Phase 3 (US1/US2/US3 — Search): 7 tasks
- Phase 3.5 (US7 — Video & Tips): 6 tasks (NEW)
- Phase 4 (US6 — CSV): 3 tasks
- Phase 5 (US4/US5 — Integration): 5 tasks
- Final (Polish): 6 tasks
- Parallel opportunities: 5 groups
