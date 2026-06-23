# Implementation Plan: Exercise Search Modal (007)

**Feature**: 007-exercise-search  
**Status**: Planning  
**Target**: LoadUp Frontend (Next.js App Router)  
**Date**: 2026-05-13

---

## Constitution Check

### ✅ Principle I: TypeScript Strict Mode

- All service functions, hooks, and components will export explicit types
- `SearchResult` interface defined in `types/index.ts` with all fields typed (name, muscleGroup, videoUrl, tip)
- `CsvImportError` interface for CSV validation errors (row, field, message)
- Filter state will be typed: `{ query: string, muscleGroup: "Todos" | MuscleGroup }`
- React Query will be fully typed with `UseQueryResult<SearchResult[]>`
- No implicit `any` or loose typing; strict parameter validation

### ✅ Principle II: Component-Based Architecture

- **Service layer** (`exerciseSearchService.ts`): isolated API calls for search via React Query
- **Service layer** (`csvImportService.ts`): isolated API calls for CSV template and import
- **Custom hook** (`useExerciseSearch.ts`): debounce logic, filter state management, search orchestration
- **Custom hook** (`useCsvImport.ts`): CSV template download, file upload, error state management
- **Tab container** (`AddExerciseModal/index.tsx`): extend existing, add 3-tab UI (Buscar, Manual, Importar)
- **Search tab** (`SearchTab/index.tsx`): presentation-only search interface (search bar + 12 filters + results)
- **CSV import tab** (`CsvImportTab/index.tsx`): CSV download, file upload, success/error display
- **Result card** (`ExerciseSearchResult/index.tsx`): render name, videoUrl link, muscle chip, optional tip
- **Loading skeleton** (`SearchSkeleton/index.tsx`): placeholder while fetching
- **Manual tab**: existing form (no changes to layout, only refactor to tab mode)
- Each component max 150 lines; styles co-located in `styles.ts` files

### ✅ Principle III: Clean Code & DRY

- All search strings centralized in `constants/strings.ts` (search placeholder, empty states, error messages, CSV strings)
- Muscle group names centralized in `constants/strings.ts` with 12 groups (Todos, Peito, Costas, Ombros, Bíceps, Tríceps, Perna, Glúteo, Abdômen, Trapézio, Antebraço, Panturrilha)
- Debounce logic isolated in hook (300ms on name input only; muscle filter changes apply immediately)
- Muscle group chip rendering reused (MuscleChip component from existing app)
- Video link rendering logic reused ("📹 Ver vídeo" or "Sem vídeo")
- No magic numbers; all constants defined (300ms debounce, 2 char minimum, API endpoint paths)

### ✅ Principle IV: API Layer Isolation

- `exerciseSearchService.ts` wraps all calls to `GET /exercises/search`
- `csvImportService.ts` wraps calls to `GET /exercises/csv-template` and `POST /training-sheet/days/:dayOfWeek/exercises/import`
- Parameter building logic: handle "Todos" special case (no muscle param), single muscle, muscle-only calls
- React Query (`useQuery`, `useMutation`) handles caching, refetching, error states
- Service validates at least one of `name` or `muscle` is present before API call
- Service returns typed `SearchResult[]` with videoUrl and tip fields
- CSV service parses response and returns typed errors with row/field/message

### ✅ Principle V: Mobile-First, Theme-Driven UI

- All Styled Components use theme tokens (colors, spacing, typography)
- Tab interface styles in `AddExerciseModal/styles.ts` (extend existing file, support 3 tabs)
- Search tab styles in `SearchTab/styles.ts` (search bar, 12 filter chips, results)
- CSV import tab styles in `CsvImportTab/styles.ts` (template button, file input, upload button, results)
- Result card styles in `ExerciseSearchResult/styles.ts` (name, video link, muscle chip, tip)
- Skeleton styles in `SearchSkeleton/styles.ts` (loading placeholders)
- Color scheme for muscle chips uses existing theme color map
- Video link styling: underlined, colored, cursor pointer
- Figma reference: `Buolm5kzeDIg7FMTyM21r5` (authoritative for layout and spacing)

### ✅ Principle VI: US7 — Video and Tips on ExerciseCard

- Each ExerciseCard on training-plan/[dayOfWeek] page gains a collapsible "📹 Vídeo e Dicas" section (bottom)
- Section collapsed by default; smooth expand/collapse CSS animation
- When expanded: two tabs (Vídeo | Dicas) with synchronized state
- **Vídeo tab**: YouTube thumbnail from exercise.videoUrl, exercise name, "Buscar tutorial no YouTube" link
- **Dicas tab**: Count badge (e.g., "Dicas (4)"), tips split from exercise.tip field, checkmark icons per tip
- No new API calls (uses exercise.videoUrl and exercise.tip from card data)
- Uses existing exercise data model (spec 001/005)
- Component max 150 lines; styles in co-located styles.ts file

---

## Technical Architecture

### Data Flow

```
1. User clicks "Adicionar Exercício" button
   ↓
2. Modal opens (AddExerciseModal)
   ├─ Render three tabs: "Buscar" (active) | "Manual" | "Importar"
   ├─ Tab=Buscar: SearchTab component mounts
   ├─ Tab=Manual: existing form (unchanged)
   └─ Tab=Importar: CsvImportTab component mounts
   ↓
3. SearchTab component mounts
   ├─ Initialize useExerciseSearch hook
   ├─ Render search bar (focused)
   ├─ Render 12 muscle filter chips ("Todos" selected)
   ├─ Display initial state: "Digite para buscar exercícios"
   └─ Results area (empty)
   ↓
4. User types in search bar (debounced)
   ├─ <2 chars: no API call, empty state
   ├─ >=2 chars: debounce 300ms, then API call
   └─ API params: ?name={query} (if "Todos"), or add &muscle={muscleGroup}
   ↓
5. API response received
   ├─ Results render with: name, videoUrl (clickable "📹 Ver vídeo" or "Sem vídeo"), muscle chip, optional tip
   ├─ Clicking result opens series config form (pre-filled: name, muscleGroup)
   └─ Form submission saves exercise to training day
   ↓
6. User filters by muscle group
   ├─ Muscle filter changes apply IMMEDIATELY (no debounce)
   ├─ API call with updated muscle param
   ├─ Results re-filter without clearing search bar
   └─ Selected chip highlighted
   ↓
7. Error handling
   ├─ API fails: show error state with "Tentar novamente" button
   ├─ No results: show "Nenhum exercício encontrado"
   └─ Retry: same API call, retry mechanism built in
   ↓
8. User switches to "Importar" tab
   ├─ CsvImportTab mounts, initialize useCsvImport hook
   ├─ Show "Baixar template" button and file input
   ├─ Click "Baixar template": GET /exercises/csv-template → downloads CSV
   ├─ Select CSV file, click Upload: POST /training-sheet/days/:dayOfWeek/exercises/import
   ├─ Success: show "X exercícios importados com sucesso"
   ├─ Error: show error list with row, field, message per error
   └─ User can retry with fixed file
   ↓
9. User switches to "Manual" tab
   ├─ Manual form renders unchanged
   └─ All tab states preserved
   ↓
10. User closes modal
    ├─ All cleanup (debounce timer cleared, React Query cache maintained)
    └─ Modal closes
```

### Component Hierarchy

```
AddExerciseModal (modified)
├── TabContainer
│   ├── Tab button: "Buscar" (active)
│   ├── Tab button: "Manual"
│   ├── Tab button: "Importar"
│   └── TabContent
│       ├── SearchTab (conditional render)
│       │   ├── SearchInput (placeholder: "Buscar exercício...")
│       │   ├── MuscleFilterChips (12 chips)
│       │   │   ├── ChipButton: "Todos" (selected by default)
│       │   │   ├── ChipButton: "Peito"
│       │   │   ├── ChipButton: "Costas"
│       │   │   ├── ChipButton: "Ombros"
│       │   │   ├── ChipButton: "Bíceps"
│       │   │   ├── ChipButton: "Tríceps"
│       │   │   ├── ChipButton: "Perna"
│       │   │   ├── ChipButton: "Glúteo"
│       │   │   ├── ChipButton: "Abdômen"
│       │   │   ├── ChipButton: "Trapézio" (new)
│       │   │   ├── ChipButton: "Antebraço" (new)
│       │   │   └── ChipButton: "Panturrilha" (new)
│       │   └── ResultsArea
│       │       ├── SearchSkeleton (if loading)
│       │       ├── ExerciseSearchResult[] (if results)
│       │       │   ├── ExerciseName
│       │       │   ├── VideoLink ("📹 Ver vídeo" or "Sem vídeo")
│       │       │   ├── MuscleChip
│       │       │   ├── Tip (optional)
│       │       │   └── ClickHandler: openSeriesForm
│       │       ├── EmptyState (if no results)
│       │       ├── InitialState (if no search)
│       │       └── ErrorState (if error)
│       ├── CsvImportTab (conditional render) (new)
│       │   ├── Button: "Baixar template" → GET /exercises/csv-template
│       │   ├── FileInput (accept .csv only)
│       │   ├── Button: "Enviar arquivo" (disabled until file selected)
│       │   └── ResultsArea
│       │       ├── Success state: "X exercícios importados com sucesso"
│       │       ├── Error state: list of { row, field, message }
│       │       ├── Loading state during upload
│       │       └── Message: "Após importar configure as séries manualmente"
│       └── ManualTab (existing form unchanged)
│           ├── ExerciseNameInput
│           ├── MuscleGroupSelector
│           ├── SeriesBuilder
│           └── AddButton
```

ExerciseCard (modified — US7 Video & Tips) — on training-plan/[dayOfWeek] page

```
ExerciseCard
├── ExerciseNameSection
├── MuscleChipSection
├── SeriesListSection
├── EditDeleteButtons
└── VideoTipsSection (NEW — collapsible)
    ├── SectionHeader: "📹 Vídeo e Dicas ∨" (collapsed indicator)
    ├── ExpandedContent (hidden when collapsed)
    │   ├── TabContainer (Vídeo | Dicas)
    │   │   ├── Tab button: "Vídeo"
    │   │   └── Tab button: "Dicas"
    │   └── TabContent
    │       ├── VideoTab (conditional)
    │       │   ├── YouTubeThumbnail (from exercise.videoUrl)
    │       │   ├── ExerciseName (below thumbnail)
    │       │   ├── Link: "Buscar tutorial no YouTube"
    │       │   └── Fallback: "Sem vídeo disponível" (if no videoUrl)
    │       └── DicasTab (conditional)
    │           ├── CountBadge: "Dicas (4)" (or count of tips)
    │           ├── TipsList
    │           │   ├── TipItem (checkmark icon + tip text)
    │           │   ├── TipItem
    │           │   └── ... (repeat for each tip)
    │           └── Fallback: "Sem dicas disponíveis" (if no tip)
```

### State Management

**Hook: `useExerciseSearch`**

```typescript
interface SearchResult {
  name: string; // Portuguese exercise name
  muscleGroup: string; // Enum: Peito, Costas, Ombros, Bíceps, Tríceps, Perna, Glúteo, Abdômen, Trapézio, Antebraço, Panturrilha
  videoUrl: string; // YouTube URL for demonstration
  tip?: string; // Optional form cue
}

interface UseExerciseSearchState {
  // Input
  query: string;
  muscleGroup: "Todos" | MuscleGroup;

  // Debounced query
  debouncedQuery: string;

  // API Response
  results: SearchResult[];
  isLoading: boolean;
  error: Error | null;

  // Actions
  setQuery: (q: string) => void;
  setMuscleGroup: (m: "Todos" | MuscleGroup) => void;
  retry: () => void;
}
```

**Hook: `useCsvImport`**

```typescript
interface CsvImportError {
  row: number; // Line number in CSV
  field: string; // Field name (nome, grupo_muscular, video_url, dica)
  message: string; // Error message (Campo obrigatório, Valor inválido, etc)
}

interface UseCsvImportState {
  // File input
  selectedFile: File | null;
  setSelectedFile: (file: File | null) => void;

  // CSV response
  isLoading: boolean;
  successCount?: number;
  errors: CsvImportError[];
  error: Error | null;

  // Actions
  downloadTemplate: () => Promise<void>;
  importCsv: (file: File, dayOfWeek: string) => Promise<void>;
  reset: () => void;
}
```

**Hook internals**:

- `useState(query)`: track user input
- `useState(muscleGroup)`: track selected filter
- `useState(debouncedQuery)`: state for debounced query value
- `useEffect` with `setTimeout`: debounce name input 300ms
  - Cleanup function: `clearTimeout()` to cancel previous timer on each keystroke
  - Fire API call when 300ms passes without new keystroke
  - Muscle filter changes bypass debounce (immediate effect)
- `useExerciseSearchQuery()`: React Query hook with dynamic parameters

**Debounce implementation pattern**:

```typescript
// State declarations
const [query, setQuery] = useState("");
const [debouncedQuery, setDebouncedQuery] = useState("");

// Debounce effect: 300ms after user stops typing
useEffect(() => {
  const timer = setTimeout(() => {
    setDebouncedQuery(query);
  }, 300);

  return () => clearTimeout(timer);
}, [query]);

// When user types:
// 1. setQuery() triggers immediately
// 2. useEffect runs, starts 300ms timer
// 3. If user types again before timer fires, cleanup cancels it
// 4. New timer starts from 0 after each keystroke
// 5. After 300ms of inactivity, setDebouncedQuery() fires
// 6. This triggers API call via dependent useQuery hook
```

- **Parameter building logic**:
  - If debouncedQuery empty AND muscleGroup === "Todos": skip API call
  - If debouncedQuery length < 2 AND muscleGroup === "Todos": skip API call
  - If debouncedQuery length < 2 AND muscleGroup !== "Todos": call `/exercises/search?muscle={muscleGroup}`
  - If debouncedQuery length >= 2 AND muscleGroup === "Todos": call `/exercises/search?name={debouncedQuery}`
  - If debouncedQuery length >= 2 AND muscleGroup !== "Todos": call `/exercises/search?name={debouncedQuery}&muscle={muscleGroup}`

---

## File Structure

### New Files to Create

```
src/services/
├── exerciseSearchService.ts (API integration + React Query hook for search)
├── csvImportService.ts (API integration for CSV template and import)

src/hooks/
├── useExerciseSearch.ts (search state management + debounce)
├── useCsvImport.ts (CSV import state management + download/upload logic)

src/components/AddExerciseModal/
├── SearchTab/
│   ├── index.tsx (search interface: search bar + 12 filters + results)
│   └── styles.ts (SearchTab styling)
├── CsvImportTab/
│   ├── index.tsx (CSV import interface: template button + file input + results)
│   └── styles.ts (CsvImportTab styling)
├── ExerciseSearchResult/
│   ├── index.tsx (single result card: name, video link, muscle chip, tip)
│   └── styles.ts (result card styling)
├── SearchSkeleton/
│   ├── index.tsx (loading skeleton placeholder)
│   └── styles.ts (skeleton styling)

src/app/(app)/training-plan/[dayOfWeek]/components/ExerciseCard/
├── VideoTipsSection/  (NEW — US7)
│   ├── index.tsx (collapsible video & tips section)
│   └── styles.ts (section styling)
├── VideoTab/  (NEW — US7)
│   ├── index.tsx (YouTube thumbnail + link)
│   └── styles.ts (video tab styling)
├── DicasTab/  (NEW — US7)
│   ├── index.tsx (tips list with checkmarks + count badge)
│   └── styles.ts (dicas tab styling)

src/types/
├── exercise.ts (or add to existing index.ts: SearchResult, CsvImportError)
```

### Files to Modify

```
src/components/AddExerciseModal/
├── index.tsx (add tabs: "Buscar" | "Manual" | "Importar")
└── styles.ts (add tab container styling for 3 tabs)

src/app/(app)/training-plan/[dayOfWeek]/components/ExerciseCard/
├── index.tsx (add VideoTipsSection import and integration)
└── styles.ts (update if needed for new section)

src/constants/
├── strings.ts (add: search strings, 12 muscle group names, CSV strings, video/tips strings)

src/types/
├── index.ts (add: SearchResult interface, CsvImportError interface)
```

---

## Implementation Phases

### Phase 1: Foundation & Types (1 session)

**Goal**: Define types, constants, and service layers. Verify TypeScript compilation.

**Tasks**:

1. [P1.1] Create `SearchResult` interface in `types/index.ts`
   - name (Portuguese), muscleGroup (11 values), videoUrl (YouTube URL), tip (optional)
   - No id, type, equipment, or icon fields
2. [P1.2] Create `CsvImportError` interface in `types/index.ts`
   - row (line number), field (nome/grupo_muscular/video_url/dica), message (error text)
3. [P1.3] Add search strings to `constants/strings.ts`
   - "Buscar exercício..." (placeholder)
   - "Digite para buscar exercícios" (initial state)
   - "Nenhum exercício encontrado" (no results)
   - "Erro ao buscar exercícios" (error)
   - "Tentar novamente" (retry)
4. [P1.4] Add 12 muscle group names to `constants/strings.ts`
   - Todos, Peito, Costas, Ombros, Bíceps, Tríceps, Perna, Glúteo, Abdômen, Trapézio, Antebraço, Panturrilha
5. [P1.5] Add CSV strings to `constants/strings.ts`
   - "Baixar template" (button text)
   - "Escolher arquivo" (file input label)
   - "Enviar arquivo" (upload button)
   - "X exercícios importados com sucesso" (success message template)
   - "Erro ao importar CSV" (error title)
   - "Após importar configure as séries manualmente" (instruction)
6. [P1.6] Create `exerciseSearchService.ts` with React Query hook
   - `getExercisesFromAPI(name?, muscle?): Promise<SearchResult[]>`
   - `useExerciseSearchQuery(name?, muscle?): UseQueryResult<SearchResult[]>`
   - Handle parameter validation (at least one present)
7. [P1.7] Create `csvImportService.ts` with React Query hooks
   - `downloadTemplateFile(): Promise<Blob>`
   - `uploadCsvFile(file: File, dayOfWeek: string): Promise<{ count: number, errors: CsvImportError[] }>`
   - Parse CSV response and return structured errors
8. [P1.8] Run `npm run build` and verify zero TypeScript errors

**Deliverables**: ✅ Types defined, ✅ Service integration ready, ✅ CSV infrastructure, ✅ Zero TS errors

---

### Phase 2: Search Hook & CSV Hook (1 session)

**Goal**: Implement debounce logic, search state management, and CSV import logic. Verify parameter building.

**Tasks**:

1. [P2.1] Create `useExerciseSearch.ts` hook
   - useState for query and muscleGroup
   - useState for debouncedQuery (state, not computed)
   - useEffect with setTimeout (300ms) to update debouncedQuery
     - Cleanup function: `clearTimeout()` cancels previous timer on each keystroke
     - Ensures search fires only 300ms after user stops typing
   - useExerciseSearchQuery with dynamic parameters based on debouncedQuery
   - Return: `{ results, isLoading, error, setQuery, setMuscleGroup, retry }`
2. [P2.2] Create `useCsvImport.ts` hook
   - useState for selectedFile
   - useState for isLoading, successCount, errors, error
   - `downloadTemplate()`: calls csvImportService.downloadTemplateFile(), triggers download
   - `importCsv(file, dayOfWeek)`: calls csvImportService.uploadCsvFile(), handles response
   - Return: `{ selectedFile, setSelectedFile, isLoading, successCount, errors, downloadTemplate, importCsv, reset }`
3. [P2.3] Implement parameter building logic
   - Handle "Todos" special case (no muscle param in URL)
   - Handle muscle-only calls (when query is empty but muscle selected)
   - Validate at least one of name or muscle present
4. [P2.4] Test hook logic via browser console
   - Mount hook, type in search, verify debounce (observe network tab)
   - Change muscle filter, verify immediate API call (no debounce)
   - Verify parameter combinations in network requests
5. [P2.5] Run `npm run build` and verify zero TypeScript errors

**Deliverables**: ✅ Debounce working, ✅ Parameter building correct, ✅ CSV hook ready, ✅ Hook testable, ✅ Zero TS errors

---

### Phase 3: UI Components (2 sessions)

**Goal**: Build search interface, CSV import interface, result cards, and loading states. Verify rendering.

**Tasks**:

1. [P3.1] Create `SearchSkeleton` component
   - Render 3-5 placeholder items while loading
   - Skeleton styling: grey placeholder boxes, theme-driven spacing
   - Component size: max 80 lines
2. [P3.2] Create `ExerciseSearchResult` component
   - Props: `{ result: SearchResult, onSelect: (result) => void }`
   - Render: exercise name, videoUrl link (📹 Ver vídeo or Sem vídeo), muscle chip, optional tip
   - No emoji icon, no equipment tag
   - Clickable row opens series form with pre-filled name and muscleGroup
   - Component size: max 120 lines
3. [P3.3] Create `SearchTab` component
   - Search input: placeholder "Buscar exercício...", onChange → setQuery
   - 12 muscle filter chips: onClick → setMuscleGroup (updated from 9)
   - Chips: Todos, Peito, Costas, Ombros, Bíceps, Tríceps, Perna, Glúteo, Abdômen, Trapézio, Antebraço, Panturrilha
   - Results rendering with conditional states:
     - Initial: "Digite para buscar exercícios"
     - Loading: SearchSkeleton
     - Results: map ExerciseSearchResult[] with onClick → open series form
     - No results: "Nenhum exercício encontrado"
     - Error: "Erro ao buscar exercícios" + Retry button
   - Component size: max 150 lines
4. [P3.4] Create `CsvImportTab` component
   - "Baixar template" button → calls downloadTemplate()
   - File input (accept .csv only)
   - "Enviar arquivo" button (disabled until file selected) → calls importCsv()
   - Loading state during upload
   - Success state: "X exercícios importados com sucesso"
   - Error state: list of errors with row, field, message
   - Instruction: "Após importar configure as séries manualmente"
   - Component size: max 150 lines
5. [P3.5] Create styled components (SearchTab/styles.ts, CsvImportTab/styles.ts, ExerciseSearchResult/styles.ts, SearchSkeleton/styles.ts)
   - Use theme tokens for all colors, spacing, typography
   - No hardcoded values
   - Video link styling: underlined, colored, cursor pointer
6. [P3.6] Verify component rendering in isolation
   - Search bar displays correctly
   - 12 filter chips render and are clickable
   - Result cards display: name, video link, muscle chip, optional tip
   - CSV interface displays: template button, file input, upload button
   - Loading skeleton displays
   - Empty state messages appear
7. [P3.7] Run `npm run build` and verify zero TypeScript errors

**Deliverables**: ✅ SearchTab renders, ✅ CsvImportTab renders, ✅ All state messages display, ✅ Video links work, ✅ 12 chips render, ✅ Zero TS errors

---

### Phase 4: Integration & Tab Interface (1 session)

**Goal**: Extend AddExerciseModal with 3 tabs (Buscar, Manual, Importar). Wire search and CSV results to series form. Verify end-to-end flow.

**Tasks**:

1. [P4.1] Modify `AddExerciseModal/index.tsx` to add 3-tab interface
   - Add state: `const [activeTab, setActiveTab] = useState<"search" | "manual" | "csv">("search")`
   - Render 3 tab buttons: "Buscar" (active by default), "Manual", "Importar"
   - Render TabContent: conditional render SearchTab, Manual form, or CsvImportTab
   - Component size stays within limits
2. [P4.2] Add tab styling to `AddExerciseModal/styles.ts`
   - StyledTabContainer with flex layout supporting 3 tabs
   - TabButton with active/inactive states
   - TabContent with smooth transition (or instant)
   - Use theme tokens
3. [P4.3] Wire search result selection to series configuration
   - Clicking ExerciseSearchResult → open series form
   - Pre-fill: exerciseName from result.name, muscleGroup from result.muscleGroup
   - Form submission → save exercise to training day
   - After save → reset search interface and return to search tab
4. [P4.4] Wire CSV import to series configuration
   - After successful CSV import → show imported exercises list (without series)
   - User can configure series manually for each imported exercise
   - After configuring and saving → return to CSV import results view
5. [P4.5] Verify tab switching
   - "Buscar" tab shows search interface
   - "Manual" tab shows existing form
   - "Importar" tab shows CSV interface
   - Switching tabs maintains state
6. [P4.6] Test full user flows
   - Search flow: Open modal → search interface loads → type → results display → click result → series form → save
   - CSV flow: Open modal → click Importar tab → download template → upload CSV → success/error display → configure series
   - Manual flow: Open modal → click Manual tab → existing form works → save
7. [P4.7] Run `npm run build` and verify zero TypeScript errors

**Deliverables**: ✅ 3 tabs render and switch, ✅ Search results open series form, ✅ CSV import shows results, ✅ Pre-fill working, ✅ Manual mode works, ✅ Zero TS errors

---

### Phase 5: US7 — ExerciseCard Video & Tips Section (1 session)

**Goal**: Implement collapsible video and tips section on each ExerciseCard. No new API calls (uses exercise.videoUrl and exercise.tip). Verify rendering and interactions.

**Tasks**:

1. [P5.1] Create `VideoTipsSection` component (wrapper)
   - Props: `{ exercise: Exercise }` (must have videoUrl and tip fields)
   - State: `const [isExpanded, setIsExpanded] = useState(false)` for collapse/expand
   - Render: collapsible header "📹 Vídeo e Dicas {arrow}" + expanded content
   - onClick header → toggles isExpanded with smooth CSS animation
   - When expanded: render tab interface (Vídeo | Dicas)
   - Component size: max 150 lines
   - Import and use styles from `./styles.ts`

2. [P5.2] Create `VideoTab` component
   - Props: `{ exercise: Exercise }` (must have videoUrl and name)
   - Render: YouTube video thumbnail (extract from exercise.videoUrl)
   - Below thumbnail: exercise.name text
   - Below name: "Buscar tutorial no YouTube" link (clickable → opens videoUrl in new tab)
   - If no videoUrl: show "Sem vídeo disponível" message (disabled appearance)
   - Component size: max 120 lines
   - Import and use styles from `./styles.ts`

3. [P5.3] Create `DicasTab` component
   - Props: `{ exercise: Exercise }` (must have tip field)
   - State: count badge: "Dicas ({tipCount})" showing number of individual tips
   - Logic to split exercise.tip field into individual tips:
     - Split by newlines or periods to get individual tips
     - Count the tips to display in badge
   - Render: each tip with checkmark icon (✓) + tip text
   - If no tip or empty: show "Sem dicas disponíveis" message
   - Component size: max 100 lines
   - Import and use styles from `./styles.ts`

4. [P5.4] Create styled components (VideoTipsSection/styles.ts, VideoTab/styles.ts, DicasTab/styles.ts)
   - Use theme tokens for all colors, spacing, typography
   - No hardcoded values
   - VideoTipsSection: smooth expand/collapse animation (CSS transition)
   - TabContainer: flex layout for Vídeo | Dicas tabs
   - TabButton: active/inactive states (theme tokens)
   - TabContent: smooth transition when switching tabs
   - Video thumbnail styling: responsive, maintains aspect ratio
   - Tips list: checkmark icon styling (color: theme.primary)

5. [P5.5] Modify `ExerciseCard/index.tsx` to integrate VideoTipsSection
   - Import VideoTipsSection component
   - Pass exercise object to VideoTipsSection (with videoUrl and tip fields)
   - Add VideoTipsSection import and render at bottom of card
   - Verify card rendering and layout intact

6. [P5.6] Add video/tips strings to `constants/strings.ts`
   - "📹 Vídeo e Dicas" (section header)
   - "Vídeo" (tab label)
   - "Dicas" (tab label)
   - "Buscar tutorial no YouTube" (link text)
   - "Sem vídeo disponível" (fallback message)
   - "Sem dicas disponíveis" (fallback message)
   - "Dicas ({count})" (count badge template, e.g., "Dicas (4)")

7. [P5.7] Verify ExerciseCard rendering
   - Open training-plan/[dayOfWeek] page
   - Verify each exercise card shows "📹 Vídeo e Dicas ∨" at bottom (collapsed)
   - Click section header → expands with animation
   - Verify two tabs appear (Vídeo | Dicas)
   - Click Vídeo tab → YouTube thumbnail displays (if videoUrl exists)
   - Verify thumbnail link opens videoUrl in new tab
   - Click Dicas tab → tips list shows (if tip exists) with checkmarks
   - Verify count badge shows correct tip count
   - Click header again → collapses smoothly
   - Verify card functionality (edit, delete buttons, etc.) still works

8. [P5.8] Verify performance
   - React DevTools Profiler: VideoTipsSection render time <50ms
   - Expand/collapse animation smooth (no jank)
   - No performance impact on ExerciseCard rendering

9. [P5.9] Run `npm run build` and verify zero TypeScript errors

**Deliverables**: ✅ VideoTipsSection renders, ✅ Vídeo tab shows thumbnail + link, ✅ Dicas tab shows tips + count badge, ✅ Collapse/expand animates smoothly, ✅ No new API calls, ✅ Card functionality preserved, ✅ Zero TS errors

---

### Phase 6: Validation & Polish (1 session)

**Goal**: Verify all success criteria, accessibility, performance, error handling. Final validation for all phases.

**Tasks**:

1. [P6.1] Verify all success criteria (spec requirement validation)
   - ✓ Search with 2+ chars returns results within 500ms after debounce
   - ✓ Muscle filter works in combination with search
   - ✓ Results display name, video link and muscle chip per Figma spec
   - ✓ Search feels responsive (no lag)
   - ✓ Loading states are clear
   - ✓ Error with retry mechanism works
   - ✓ Modal doesn't freeze during search
   - ✓ No memory leaks (debounce cleanup)
   - ✓ ExerciseCard video/tips section collapsible and animates smoothly
   - ✓ Video tab shows YouTube thumbnail and link correctly
   - ✓ Dicas tab shows tips with checkmarks and count badge
   - ✓ No new API calls for video/tips (uses exercise data)

2. [P6.2] Accessibility compliance
   - Search bar and results keyboard navigable (Tab, Enter)
   - ARIA labels on button/interactive elements
   - Focus visible on chips and result items
   - Video/Tips section keyboard accessible (Enter to expand/collapse)
   - Keyboard navigation between tabs (arrow keys)
   - Color contrast WCAG AA minimum (video links, tips text)

3. [P6.3] Mobile responsivity
   - Search bar responsive on mobile
   - Filter chips stack/scroll properly
   - Result cards touch-friendly (min 44px tap target)
   - ExerciseCard video/tips section responsive on mobile
   - Thumbnail scales properly on small screens
   - Tips text readable on mobile
   - Test on Chrome DevTools Mobile Emulation (iPhone 12, Pixel 5)

4. [P6.4] Error handling
   - Mock API error (500), verify error state displays and retry works
   - API timeout, verify graceful handling
   - Network offline, verify message
   - Missing videoUrl: "Sem vídeo disponível" displays
   - Missing tip: "Sem dicas disponíveis" displays

5. [P6.5] Performance validation
   - React DevTools Profiler: SearchTab render time <100ms
   - React DevTools Profiler: VideoTipsSection render time <50ms
   - Network tab: debounce prevents excessive API calls
   - Expand/collapse animation smooth (60fps)
   - No console errors or warnings

6. [P6.6] Code review checklist
   - No hardcoded strings (all from constants/strings.ts) ✓
   - No hardcoded colors/spacing (all from theme tokens) ✓
   - All components <150 lines ✓
   - All styles in separate styles.ts files ✓
   - All API calls via apiClient ✓
   - TypeScript strict mode ✓
   - No tests in codebase ✓

7. [P6.7] Final TypeScript validation
   - Run `npm run build`
   - Zero errors required
   - Verify strict mode: no implicit any, no loose typing

**Deliverables**: ✅ All success criteria met, ✅ Accessibility compliant, ✅ Mobile responsive, ✅ Error handling working, ✅ Performance validated, ✅ Code review passed, ✅ Zero TS errors

---

## Success Criteria Summary

| Criterion                          | Phase | Validation                                                    |
| ---------------------------------- | ----- | ------------------------------------------------------------- |
| Search with 2+ chars               | P3/P4 | Type in search bar, observe results within 500ms              |
| Muscle filter applies immediately  | P2    | Click filter chip, observe API call and re-filtering          |
| Results display                    | P3    | Verify name, video link, muscle chip on each result           |
| Debounce 300ms works               | P2    | Type rapidly, observe network tab (3-5 API calls, not 20+)    |
| Zero TypeScript errors             | All   | `npm run build` succeeds with zero errors                     |
| Tab switching works                | P4    | Click "Buscar" and "Manual" tabs, verify rendering            |
| Pre-fill series form               | P4    | Select exercise, verify name and muscleGroup fields filled    |
| Manual mode unchanged              | P4    | Use existing form, verify all functionality works             |
| Video/Tips section on ExerciseCard | P5    | Navigate to training-plan/[dayOfWeek], verify section renders |
| Collapse/Expand animation          | P5    | Click section header, verify smooth animation                 |
| Vídeo tab renders thumbnail        | P5    | Click Vídeo tab, verify YouTube thumbnail displays            |
| Video link opens in new tab        | P5    | Click thumbnail or link, verify videoUrl opens new tab        |
| Dicas tab shows tips with count    | P5    | Click Dicas tab, verify tips display with checkmarks + count  |
| Fallback messages display          | P5    | Verify "Sem vídeo disponível" and "Sem dicas disponíveis"     |
| No new API calls for video/tips    | P5    | Monitor network tab, verify no extra requests                 |
| Accessibility                      | P6    | Tab/Enter navigation works; ARIA labels present               |
| Mobile responsive                  | P6    | Test on mobile emulation; touch targets >44px                 |
| Error resilience                   | P6    | Mock API error; verify error state and retry                  |
| No memory leaks                    | P6    | Close/open modal repeatedly; monitor performance              |

---

## Architecture Decision Records

### ADR001: Parameter Building Logic for "Todos" Filter

**Decision**: When "Todos" muscle filter is selected, do NOT send muscle parameter to API.

**Rationale**:

- Cleaner API contract (single-concern parameter)
- Backend simpler: only handle name OR muscle, not both
- Matches user mental model: "Todos" means "all muscles" → no muscle filter

**Implementation**:

```typescript
// In hook parameter building:
if (muscleGroup === "Todos") {
  return `/exercises/search?name=${debouncedQuery}`;
} else {
  return `/exercises/search?name=${debouncedQuery}&muscle=${muscleGroup}`;
}
```

### ADR003: Debounce Only on Name Input, Immediate Filter Changes

**Decision**: Debounce 300ms applies to search name input only; muscle filter changes trigger API call immediately.

**Rationale**:

- User expects instant visual feedback when clicking filter chips
- Name input debounce reduces unnecessary API calls (natural typing pause)
- Muscle filter clicks are discrete actions (not continuous typing)
- Matches user behavior: deliberate click vs. rapid typing

**Implementation**:

- Use separate useEffect hooks: one for debounced name, one for immediate muscle
- React Query re-runs when either parameter changes
- Performance: fewer API calls without sacrificing responsiveness

---

## Related Specifications

- **spec 002 (Web App)**: Parent spec for LoadUp frontend
- **spec 003 (Backend API)**: `/exercises/search` endpoint requirement
- **spec 005 (Exercise Database)**: Exercise names pre-translated to Portuguese
- **spec 006 (Plateau Alerts)**: Similar modal pattern reference (tab implementation)

---

## Phase Dependencies & Timing

```
Phase 1 (Foundation) ─────────────────────────────────────────────── 1 session
├─ P1.1: SearchResult type
├─ P1.3: Strings constants
├─ P1.4: exerciseSearchService.ts
└─ P1.5: TypeScript validation
    ↓
Phase 2 (Search Hook) ─────────────────────────────────────────────── 1 session
├─ P2.1: useExerciseSearch hook
├─ P2.2: Parameter building logic
├─ P2.3: Hook testing
└─ P2.4: TypeScript validation
    ↓
Phase 3 (UI Components) ───────────────────────────────────────────── 2 sessions
├─ P3.1: SearchSkeleton component
├─ P3.2: ExerciseSearchResult component
├─ P3.3: SearchTab component
├─ P3.4: Styling (3 styles.ts files)
├─ P3.5: Component verification
└─ P3.6: TypeScript validation
    ↓
Phase 4 (Integration) ──────────────────────────────────────────────── 1 session
├─ P4.1: Tab interface in AddExerciseModal
├─ P4.2: Tab styling
├─ P4.3: Series form pre-fill
├─ P4.4: Tab switching verification
├─ P4.5: End-to-end flow testing
└─ P4.6: TypeScript validation
    ↓
Phase 5 (Validation) ──────────────────────────────────────────────── 1 session
├─ P5.1: Success criteria validation
├─ P5.2: Accessibility check
├─ P5.3: Mobile responsivity
├─ P5.4: Error handling
├─ P5.5: Performance validation
├─ P5.6: Code review
└─ P5.7: Final TypeScript validation

Total: ~6 sessions (1 week intensive or 2 weeks part-time)
```

---

## Sign-Off

- [ ] All phases completed in sequence
- [ ] All phases independently tested
- [ ] User scenarios from spec pass manual testing
- [ ] TypeScript strict mode validation passes
- [ ] Figma design alignment verified
- [ ] Accessibility checklist complete
- [ ] Performance metrics met
- [ ] Code review passed
- [ ] Ready for merge to main
