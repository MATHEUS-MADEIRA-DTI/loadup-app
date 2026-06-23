# Feature Specification: Exercise Search Modal

**Feature ID**: 007-exercise-search | **Status**: Specification | **Date**: 2026-05-13

---

## Executive Summary

This feature enhances the existing "Adicionar Exercício" modal in the training plan interface by adding a powerful exercise search capability. Users can now search exercises from the local database (spec 005 backend) with real-time filtering by muscle group. The modal gains a tab-based interface with three modes: "Buscar" (search local database) as the default, "Manual" (existing add form), and "Importar" (CSV bulk import). Search results display exercise name and muscle group with clickable video links, and clicking a result pre-fills the series configuration form. CSV import allows coaches and power users to bulk-add exercises from a template file. The feature integrates seamlessly with the existing training flow while maintaining backward compatibility.

---

## User Stories

### US1 — Search Exercises from Local Database

**As a** user building my training plan,  
**I want to** search for exercises from the LoadUp exercise database via a search bar,  
**So that** I can quickly find exercises by name instead of manually typing them.

**Acceptance Criteria**:

- "Buscar" tab is the default mode when modal opens
- Search bar displays with placeholder "Buscar exercício..."
- Search is debounced (300ms) to reduce API calls
- Minimum 2 characters required before search triggers
- Results display exercise name, video link (if available), and muscle group chip
- "Digite para buscar exercícios" message shown initially (before user types)
- Search results update in real-time as user types
- Clicking a result opens the series configuration form with pre-filled name and muscle group

### US2 — Filter Results by Muscle Group

**As a** user,  
**I want to** filter search results by muscle group while searching,  
**So that** I can narrow down results to only exercises targeting specific muscle groups.

**Acceptance Criteria**:

- Muscle group filter chips displayed below search bar: Todos, Peito, Costas, Ombros, Bíceps, Tríceps, Perna, Glúteo, Abdômen, Trapézio, Antebraço, Panturrilha (12 total)
- "Todos" chip is selected by default
- Clicking a chip filters results by that muscle group
- Filter and search work simultaneously (combined)
- Filter sends Portuguese muscle group value to API
- Backend returns results from local JSON database (spec 005)
- Selected chip is visually highlighted
- Filter state resets when user clears search

### US3 — Handle Search States

**As a** user,  
**I want to** see clear feedback for different search scenarios,  
**So that** I understand why results are or aren't displayed.

**Acceptance Criteria**:

- Loading skeleton displays while API request is in-flight
- "Nenhum exercício encontrado" message shown when search returns zero results
- "Digite para buscar exercícios" shown initially (before any search)
- Error state with "Erro ao buscar exercícios" and "Tentar novamente" button if API fails
- Retry button attempts search again after error
- All states are user-friendly and informative

### US4 — Switch Between Search, Manual, and CSV Import Modes

**As a** user,  
**I want to** toggle between "Buscar", "Manual", and "Importar" tabs in the modal,  
**So that** I can either search for exercises, add them manually, or bulk-import from CSV depending on my preference.

**Acceptance Criteria**:

- Three tabs at the top: "Buscar", "Manual", and "Importar"
- "Buscar" tab is active by default
- Clicking "Manual" tab shows the existing add exercise form unchanged
- Clicking "Importar" tab shows CSV upload interface
- Form state is preserved when switching tabs (within same session)
- Clicking "Buscar" tab returns to search interface
- Manual mode functionality remains identical to current implementation

### US5 — Configure Series After Selecting Exercise

**As a** user,  
**I want to** configure series/sets for a searched exercise,  
**So that** I can complete the exercise addition with my training parameters.

**Acceptance Criteria**:

- Clicking a search result opens the series configuration form (same as manual add)
- Exercise name is pre-filled from search result
- Muscle group is pre-filled from search result
- User configures series (reps, weight, rest) as normal
- "Adicionar exercício" button saves the exercise to the training day
- Form resets after successful save
- User returns to search interface ready for next search
- Video link is displayed but optional (user can watch before or after adding series)

### US6 — Import Exercises via CSV

**As a** coach or power user,  
**I want to** bulk-import exercises from a CSV file,  
**So that** I can quickly add many exercises to a training day without searching individually.

**Acceptance Criteria**:

- "Importar" tab shows file upload interface
- "Baixar template" button downloads CSV template with headers and examples
- CSV template includes all 12 muscle groups as examples
- File input accepts .csv files only
- Upload button sends file to `POST /training-sheet/days/:dayOfWeek/exercises/import`
- On success: display "X exercícios importados com sucesso" message with count
- On error: display validation errors with specific row numbers and field messages
- After import: user can view imported exercises and configure series manually
- Imported exercises have empty series arrays (configured manually like search flow)
- User can download template again at any time
- Note: Series are configured manually after import, same workflow as search

### US7 — View Video and Tips on Exercise Card

**As a** user on the training-plan/[dayOfWeek] page,  
**I want to** view exercise videos and tips directly on the ExerciseCard,  
**So that** I can quickly access instructional content and form cues without leaving the training plan.

**Acceptance Criteria**:

- Each ExerciseCard displays a collapsible "📹 Vídeo e Dicas" section at the bottom
- Section is collapsed by default (shows only "📹 Vídeo e Dicas ∨")
- Clicking section toggles expand/collapse with smooth animation
- When expanded, displays two tabs: "Vídeo" and "Dicas"
- **Vídeo tab**:
  - Shows YouTube video thumbnail from exercise.videoUrl
  - Exercise name displayed below thumbnail
  - "Buscar tutorial no YouTube" link below name
  - Clicking thumbnail or link opens videoUrl in new tab
  - If no videoUrl: show "Sem vídeo disponível" message
- **Dicas tab**:
  - Shows count badge (e.g., "Dicas (4)") with number of tips available
  - Displays exercise.tip content split into individual tips
  - Each tip displayed with a checkmark icon (✓)
  - Multiple tips separated by newlines or periods
  - If no tip: show "Sem dicas disponíveis" message
- No new API calls needed (data already in exercise object)
- Uses exercise.videoUrl and exercise.tip fields from spec 001/005 data model

---

## Key Entities

### SearchResult

```typescript
{
  name: string; // Portuguese exercise name
  muscleGroup: string; // Enum: "Peito", "Costas", "Ombros", "Bíceps", "Tríceps", "Perna", "Glúteo", "Abdômen", "Trapézio", "Antebraço", "Panturrilha"
  videoUrl: string; // YouTube URL for exercise demonstration
  tip?: string; // Optional tip or form cue
}
```

### SearchFilter

```typescript
{
  query: string; // User input, min 2 chars
  muscleGroup: "Todos" | MuscleGroup;
  debouncedQuery: string; // After 300ms debounce
}
```

### SeriesConfig

```typescript
{
  exerciseName: string;
  muscleGroup: MuscleGroup;
  series: Array<{
    reps: number;
    weight?: number;
    rest: number;
  }>;
}
```

---

## User Scenarios & Testing

### Scenario 1: Initial Modal Open (Search Tab)

**When** user clicks "Adicionar Exercício" button  
**Then** modal opens with "Buscar" tab active  
**And** search bar is focused with placeholder "Buscar exercício..."  
**And** muscle group chips show "Todos" selected  
**And** empty state message "Digite para buscar exercícios" displays

**Test**: Open training plan, click add exercise button, verify search interface loads

---

### Scenario 2: Type in Search Bar

**When** user types "su" (less than 2 chars)  
**Then** no API request is triggered  
**And** empty state remains visible

**When** user types "sup" (2+ chars)  
**Then** API request to `/exercises/search?name=sup` is triggered after 300ms ("Todos" filter = no muscle param)  
**And** loading skeleton displays  
**And** results populate when API responds

**Test**: Type in search, observe debounce and loading state

---

### Scenario 3: Filter by Muscle Group

**When** search returns 5 results (mixed muscle groups)  
**And** user clicks "Peito" filter chip  
**Then** API request updates to `/exercises/search?name=sup&muscle=Peito` (adds muscle param)  
**And** results re-filter to show only chest exercises  
**And** "Peito" chip is visually highlighted

**Test**: Search, then filter by different muscle groups, verify filtering works

---

### Scenario 4: Select Exercise and Configure Series

**When** user clicks on a search result (e.g., "Supino Reto")  
**Then** modal shows series configuration form  
**And** exercise name field is pre-filled with "Supino Reto"  
**And** muscle group is pre-selected to "Peito"  
**And** user can configure series (3 sets × 8-10 reps)  
**And** clicking "Adicionar exercício" saves the exercise to training day  
**And** form resets and returns to search interface

**Test**: Search, select exercise, configure and save, verify exercise added to training plan

---

### Scenario 5: No Results State

**When** user searches "xyz123" (no matching exercises)  
**Then** loading skeleton displays briefly  
**And** "Nenhum exercício encontrado" message shows  
**And** user can modify search or filter to find results

**Test**: Search non-existent exercise, verify no results message

---

### Scenario 6: API Error Handling

**When** API request fails (500 error or timeout)  
**Then** error state displays: "Erro ao buscar exercícios"  
**And** "Tentar novamente" button is visible  
**And** clicking retry triggers search again

**Test**: Simulate API error, verify retry works

---

### Scenario 7: Switch to Manual Mode

**When** user clicks "Manual" tab  
**Then** existing "Adicionar Exercício" form displays unchanged  
**And** user can manually enter exercise name and muscle group  
**And** form is independent from search state

**When** user switches back to "Buscar" tab  
**Then** search interface returns (with previous search cleared or preserved per design)

**Test**: Switch tabs, verify both modes work independently

---

### Scenario 8: CSV Import Flow

**When** user clicks "Importar" tab  
**Then** CSV import interface displays with two sections:

- "Baixar template" button
- File upload input and upload button

**When** user clicks "Baixar template"  
**Then** CSV file downloads with:

- Header row: `nome;grupo_muscular;video_url;dica`
- 12 example rows (one per muscle group)
- File name: `exercicios_template.csv`

**When** user selects valid CSV file and clicks upload  
**Then** loading state displays  
**And** on success: "X exercícios importados com sucesso" message appears with count  
**And** uploaded exercises are listed without series (ready for series configuration)

**When** user uploads CSV with validation errors  
**Then** error list displays with:

- Row number (e.g., "Linha 3")
- Field name (e.g., "grupo_muscular")
- Error message (e.g., "Campo obrigatório" or "Valor inválido")
- User can fix and retry with new file

**Test**: Download template, upload valid/invalid CSV, verify success/error states

---

### Scenario 9: View Video and Tips on Exercise Card

**When** user navigates to training-plan/[dayOfWeek] page  
**And** sees an exercise card with "📹 Vídeo e Dicas" at the bottom (collapsed)  
**Then** clicking the section expands it with smooth animation

**When** expanded section shows two tabs: "Vídeo" and "Dicas"  
**And** user clicks "Vídeo" tab  
**Then** YouTube thumbnail displays with exercise name below  
**And** "Buscar tutorial no YouTube" link is visible

**When** user clicks thumbnail or link  
**Then** videoUrl opens in new browser tab

**When** user clicks "Dicas" tab  
**Then** "Dicas (4)" count badge displays (example with 4 tips)  
**And** each tip shows with a checkmark icon (✓)  
**And** tips are displayed as a list (split from exercise.tip field)

**When** user clicks the section header again  
**Then** section collapses smoothly

**Test**: Navigate to training plan, expand exercise card video/tips section, verify both tabs work, verify video link opens new tab

---

## Functional Requirements

### FR1 — Search API Integration

- **Requirement**: Fetch exercises from GET `/exercises/search` endpoint with query parameters
  - When "Todos" filter selected: send only `?name={query}` (no muscle parameter)
  - When specific muscle selected: send `?name={query}&muscle={muscleGroup}` (Portuguese value, e.g., "Peito")
  - When only muscle filter (no search text): send `?muscle={muscleGroup}`
  - **Validation**: At least one of `name` or `muscle` must be present in request (backend requires this)
  - Minimum 2 characters in name query to trigger request
  - Results are already translated to Portuguese (spec 005 responsibility)
  - Use `apiClient` for all HTTP requests (per constitution)
  - Implement 300ms debounce on search input; filter changes apply immediately (no debounce)
- **Acceptance**: API requests made with correct parameter combinations; debounce reduces unnecessary requests

### FR2 — UI Tab Interface

- **Requirement**: Implement three tabs "Buscar", "Manual", and "Importar"
  - "Buscar" is default active tab
  - Tab switching is instant (no animation delay)
  - Tab state persists during modal session
  - Each tab content is independent
- **Acceptance**: Tabs render correctly; switching works; each mode displays properly

### FR3 — Search Results Rendering

- **Requirement**: Display each exercise result with 3 elements:
  1. Exercise name (Portuguese)
  2. Clickable YouTube video link (if videoUrl present):
     - Display as "📹 Ver vídeo" link text
     - Opens videoUrl in new tab on click
     - If no videoUrl, show "Sem vídeo" placeholder (disabled)
  3. Muscle group chip (colored, theme token)
  4. Optional tip text below muscle group (if tip field present)
- **Acceptance**: Name, video link, and muscle chip display; video link opens correctly; tips show when available

### FR4 — Muscle Group Filter Chips

- **Requirement**: Render 12 filter chips (Todos + 11 muscle groups)
  - Chips: Todos, Peito, Costas, Ombros, Bíceps, Tríceps, Perna, Glúteo, Abdômen, Trapézio, Antebraço, Panturrilha
  - Chips are always visible below search bar
  - "Todos" is selected by default
  - Only one chip selected at a time (radio-style selection)
  - Selected chip is visually highlighted (theme token color)
  - Filter applies immediately when chip clicked
  - Filter value sent to API as Portuguese text
- **Acceptance**: All 12 chips render; selection works; API receives correct filter value

### FR5 — Loading & Empty States

- **Requirement**: Display appropriate state messages and skeletons:
  - **Initial state** (no search): "Digite para buscar exercícios"
  - **Loading** (API in-flight): Loading skeleton (3-5 placeholder items)
  - **No results**: "Nenhum exercício encontrado"
  - **Error**: "Erro ao buscar exercícios" + "Tentar novamente" button
- **Acceptance**: All states display correctly; skeleton shows while loading; retry works

### FR6 — Series Configuration After Selection

- **Requirement**: Pre-fill series form when exercise selected
  - Form opens with exercise name pre-filled
  - Muscle group pre-selected
  - User configures series (reps, weight, rest) as normal
  - "Adicionar exercício" button saves to training day
  - Form resets after successful save
  - User returns to search interface
- **Acceptance**: Pre-fill works; form saves correctly; UI resets

### FR7 — Debounce & Performance

- **Requirement**: Implement 300ms debounce on search input
  - Debounce applies only to `name` parameter
  - Muscle group filter changes apply immediately (no debounce)
  - Each keystroke after 300ms idle triggers new request (local search is instant)
  - Previous in-flight requests are cancelled if new search triggered
- **Acceptance**: Debounce working; search results appear in <100ms from local database

### FR8 — Manual Mode Unchanged

- **Requirement**: Manual tab displays existing form without modifications
  - All existing functionality preserved
  - Form validation works as before
  - Series builder works as before
  - "Adicionar exercício" button saves as before
- **Acceptance**: Manual mode works identically to current implementation

### FR9 — CSV Import Tab Interface

- **Requirement**: Implement CSV import tab with:
  1. "Baixar template" button:
     - Calls `GET /exercises/csv-template`
     - Downloads file as `exercicios_template.csv`
     - Template includes CSV header and 12 example rows (one per muscle group)
  2. File upload input:
     - Accepts `.csv` files only
     - Shows selected file name
     - Clears on successful import
  3. Upload button:
     - Disabled until file selected
     - Calls `POST /training-sheet/days/:dayOfWeek/exercises/import`
     - Shows loading state while uploading
- **Acceptance**: Template downloads; file input works; upload submits correctly

### FR10 — CSV Import Results & Error Handling

- **Requirement**: Handle CSV import responses:
  - **Success**: Display "X exercícios importados com sucesso" with import count
  - **Validation Errors**: Display error list with:
    - Row number
    - Field name (e.g., "nome", "grupo_muscular")
    - Error message (e.g., "Campo obrigatório")
    - Allow user to download template again and retry
  - **After Import**: Show list of imported exercises without series (series configured manually)
  - **Error Retry**: Allow user to upload different file or try again
- **Acceptance**: Success/error states display correctly; validation errors are specific; user can retry

### FR11 — ExerciseCard Video and Tips Section

- **Requirement**: Each ExerciseCard on training-plan/[dayOfWeek] MUST display a collapsible "📹 Vídeo e Dicas" section at bottom
  - Section collapsed by default (shows label + expand arrow "∨")
  - Click to toggle expand/collapse with smooth CSS animation
  - Section does not require additional API call (uses exercise.videoUrl and exercise.tip from card data)
- **Acceptance**: Section visible, collapsible, animates smoothly, no performance impact

### FR12 — Video Tab in Video/Tips Section

- **Requirement**: When "Vídeo" tab selected, MUST display:
  1. YouTube video thumbnail extracted from exercise.videoUrl
  2. Exercise name below thumbnail
  3. "Buscar tutorial no YouTube" link (or equivalent YouTube search link)
  4. Thumbnail and link both clickable → open videoUrl in new tab
  5. If no videoUrl: display "Sem vídeo disponível" message (disabled state)
- **Acceptance**: Video thumbnail loads; links work; opens in new tab; fallback message displays when no URL

### FR13 — Dicas Tab in Video/Tips Section

- **Requirement**: When "Dicas" tab selected, MUST display:
  1. Count badge with number of tips (e.g., "Dicas (4)")
  2. Exercise.tip field split into individual tips
  3. Each tip prefixed with checkmark icon (✓)
  4. Tips displayed as bulleted or checkmark-prefixed list
  5. Supports multiple tips separated by newlines or periods
  6. If no tip or empty: display "Sem dicas disponíveis" message
- **Acceptance**: Tip count accurate; tips split correctly; all tips visible; fallback message shows when empty

### FR14 — Performance and Integration

- **Requirement**: Video/Tips section MUST:
  - Use data already present in exercise object (no new API calls)
  - Not block ExerciseCard rendering or interaction
  - Maintain existing card functionality (edit, delete, etc)
  - Be keyboard accessible (expand/collapse via Enter key)
  - Be touch-friendly on mobile (adequate tap target sizes)
- **Acceptance**: Card renders normally; new section doesn't impact card speed; keyboard and touch work

---

## Success Criteria

1. **Search Functionality**: User can search exercises by name with 2+ characters; results appear in <100ms from local database
2. **Filtering**: Muscle group filters work in combination with search; all 12 groups functional; correct Portuguese values sent to API
3. **Visual Design**: Results display exercise name, video link, and muscle chip per Figma spec
4. **User Experience**: Search feels responsive; debounce doesn't feel laggy; loading states are clear; video links work
5. **CSV Import**: Template downloads correctly; file upload accepts .csv; validation errors display with row/field details
6. **Integration**: Searched exercises and imported exercises can be added to training plan with series configuration
7. **Performance**: Modal doesn't freeze during search; CSV upload doesn't block UI; no memory leaks
8. **Accessibility**: Search bar, results, and CSV interface are keyboard navigable; ARIA labels on interactive elements
9. **Mobile Responsive**: Search and CSV import interfaces work on mobile with proper touch targets
10. **Backward Compatibility**: Manual mode works identically to current; existing add flow not broken
11. **ExerciseCard Video/Tips**: Collapsible section visible on each exercise card with smooth expand/collapse animation
12. **Video Tab**: YouTube thumbnail and link display correctly; link opens in new tab; "Sem vídeo" message shows when no URL
13. **Dicas Tab**: Tips split correctly with checkmark icons; count badge accurate; "Sem dicas" message shows when empty
14. **ExerciseCard Performance**: New section doesn't block card rendering or interaction; keyboard and touch navigation work

---

## Assumptions

### A1 — Backend Exercise Data

- Backend API (spec 005) provides `/exercises/search` endpoint with local JSON database
- Results include: name (Portuguese), muscleGroup (11 values), videoUrl (YouTube URL), tip (optional)
- Results are from in-memory cached database (172 exercises total)
- No pagination needed (all results returned, typically <50 per search)
- No translation mapping needed (database has Portuguese names pre-loaded)

### A2 — CSV Import

- Backend provides `GET /exercises/csv-template` for template download
- Backend provides `POST /training-sheet/days/:dayOfWeek/exercises/import` for CSV upload
- CSV format: `nome;grupo_muscular;video_url;dica` (semicolon-separated)
- Backend validates CSV and returns specific errors with row/field information
- Imported exercises have empty series arrays (user configures manually)

### A3 — User Behavior

- User types at least 2 characters before expecting results
- User can handle standard network latency (~100ms for local database search)
- User understands Portuguese muscle group names (Peito, Costas, etc, including new: Trapézio, Antebraço, Panturrilha)
- User can prepare CSV files with correct format or download template

### A4 — Design Reference

- Figma file key `Buolm5kzeDIg7FMTyM21r5` contains authoritative UI mockup
- All visual styles (spacing, colors, typography) follow existing LoadUp theme
- Muscle group chips use same design as other chip components in app

### A5 — Existing Components

- Series configuration form exists and works correctly
- Training plan integration already handles exercise additions
- Modal overlay and tab interface patterns already established in app

---

## Out of Scope

- **Exercise Favorites**: Saving frequently used exercises for quick access (future feature)
- **Exercise History**: Viewing previously added exercises (future feature)
- **Video Tutorials**: Links to exercise form videos (future feature)
- **Advanced Filters**: Difficulty level, equipment requirements, time duration filters (future feature)
- **Exercise Variations**: Showing similar exercises or alternative movements (future feature)

---

## Visual Reference

**Figma File**: `Buolm5kzeDIg7FMTyM21r5`

- Design shows search modal with tabs, search bar, filter chips, and results list
- Follow Figma exactly for spacing, colors, typography, and component sizing
- Muscle chip colors match theme tokens (lightTheme, darkTheme)
- Icons are Fluent Emoji (standard emoji set)

---

## Dependencies & Integration Points

### Upstream Dependencies

- **spec 005 (Exercise Database)**: Must provide `/exercises/search` endpoint with local JSON database
- **spec 005 (CSV Import)**: Must provide `/exercises/csv-template` and `/training-sheet/days/:dayOfWeek/exercises/import` endpoints
- **Existing Training Plan**: Must have exercise addition flow (series configuration form)

### Technical Dependencies

- **apiClient** library (from app constitution): All HTTP requests must use this
- **React Query**: For caching and managing search requests
- **Debounce utility**: For 300ms debounce on search input
- **Theme tokens**: For chip colors, spacing, typography (no hardcoded values)
- **Fluent Emoji**: For exercise type icons (💪, 🏃, 🧘, 🏋️, ⚡, etc)

### Files to Modify/Create

- `src/components/AddExerciseModal/index.tsx` (existing) — Add tabs interface
- `src/components/AddExerciseModal/SearchTab.tsx` (NEW) — Search mode implementation
- `src/components/AddExerciseModal/CsvImportTab.tsx` (NEW) — CSV import mode implementation
- `src/components/AddExerciseModal/styles.ts` (modify) — Tab styling
- `src/services/exerciseService.ts` (NEW) — API integration for search and CSV
- `src/hooks/useExerciseSearch.ts` (NEW) — Search state management
- `src/hooks/useCsvImport.ts` (NEW) — CSV import state management
- `src/types/index.ts` (modify) — Add Exercise and SearchResult types

---

## Related Specifications

- **spec 002 (Web App)**: Parent spec for LoadUp frontend
- **spec 005 (Exercise Database)**: Exercise search endpoint and CSV import endpoints
- **spec 006 (Plateau Alerts)**: Similar modal pattern reference
