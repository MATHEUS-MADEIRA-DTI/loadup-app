# Implementation Tasks: Plateau Alerts (006)

**Feature**: 006-plateau-alerts  
**Status**: Ready for Implementation  
**Target**: LoadUp Frontend (Next.js App Router)  
**Date**: 2026-05-13

---

## Task Organization

Tasks are grouped by **Phase** and **User Story**, following the priority order defined in `plan.md`:

1. Foundation (types, strings, utilities)
2. Data Layer (service, hook)
3. UI Components (modal, card)
4. Integration (home page, validation)

Each phase is independently testable and builds upon the previous one.

---

## Phase 1: Foundation (Data Layer Scaffolding)

**Goal**: Establish types, constants, and utility layer. Verify TypeScript compilation.  
**Duration**: 1 session  
**Independent Test Criteria**:

- TypeScript compiles with zero errors
- All string constants exported and accessible
- localStorage utilities work in isolation (via browser console)

---

### T001 — [P] Create PlateauAlert Type Definitions

- [x] T001 [P] Create `src/types/index.ts` with PlateauAlert interfaces
  - Add `PlateauAlert` interface (8 fields: `_id`, `exerciseName`, `dayOfWeek`, `alertType`, `sessionCount`, `suggestion`, `detectedAt`, `active`)
  - Add `PlateauAlertWithMuscleGroup` interface (extends PlateauAlert + optional `muscleGroup`)
  - Add `PlateauAlertsResponse` interface (wrapper: `data: PlateauAlert[]`, `timestamp: string`)
  - Export all three interfaces
  - Verify TypeScript strict mode compliance (no implicit any)

**File**: [src/types/index.ts](../../../src/types/index.ts)

---

### T002 — [P] Add Plateau Alert Strings to Constants

- [x] T002 [P] Update `src/constants/strings.ts` with plateau alert text
  - Add `PLATEAU_TITLE = "Alertas de Platô"`
  - Add `PLATEAU_SUBTITLE = "Exercícios sem evolução detectados pelo sistema"`
  - Add `PLATEAU_MARK_ALL_READ = "Marcar todos como lidos"`
  - Add `PLATEAU_MARK_READ = "Marcar como lido"`
  - Add `PLATEAU_DETECTED = "Detectado em"`
  - Add `PLATEAU_NO_PROGRESS = "Sem evolução"`
  - Add `PLATEAU_SESSIONS = "sessões sem evolução"`
  - Add `PLATEAU_FETCH_ERROR = "Erro ao carregar alertas"`
  - Add `PLATEAU_RETRY = "Tentar novamente"`
  - Export all strings from STRINGS constant

**File**: [src/constants/strings.ts](../../../src/constants/strings.ts)

---

### T003 — [P] Create localStorage Utility Functions

- [x] T003 [P] Create `src/lib/alerts.ts` with localStorage helpers
  - Define `STORAGE_KEY = "plateau_alerts_dismissed"`
  - Implement `getDismissedFromStorage(): string[]` (reads from localStorage, returns empty array on error)
  - Implement `addToDismissed(alertId: string): void` (adds to localStorage, handles duplicates)
  - Implement `clearDismissed(): void` (removes key from localStorage)
  - All functions are synchronous (localStorage is blocking)
  - Export all three functions with proper TypeScript types

**File**: [src/lib/alerts.ts](../../../src/lib/alerts.ts)

---

### T004 — Verify Phase 1 TypeScript Compilation

- [x] T004 Run `npm run build` and verify zero TypeScript errors
  - Check that all three files compile successfully
  - No implicit `any` or loose typing
  - All exports properly typed

**Deliverables**:

- ✅ Types defined and exported
- ✅ Strings centralized
- ✅ localStorage utilities functional
- ✅ Zero TypeScript errors

---

## Phase 2: Data Layer (Service & Hook)

**Goal**: Implement API service and custom hook. Verify data fetching and state management.  
**Duration**: 1 session  
**Independent Test Criteria**:

- React Query queries `/plateau/alerts` and caches response
- Hook filters dismissed alerts from localStorage state
- Hook resolves muscleGroup from training sheet
- Dismiss actions update both state and localStorage

---

### T005 — [P] Create Plateau Alerts Service with React Query

- [x] T005 [P] Create `src/services/plateauService.ts` with API integration
  - Import `useQuery` from `@tanstack/react-query`
  - Import `apiClient` from `@/lib/apiClient` (do NOT use fetch directly)
  - Implement `getAlertsFromAPI(): Promise<PlateauAlert[]>` async function
    - Call `apiClient.get<PlateauAlertsResponse>('/plateau/alerts')`
    - Extract `data.data` from response wrapper
    - No manual Authorization header (handled by apiClient)
  - Implement `usePlateauAlertsQuery()` hook
    - Uses `useQuery` with key `["plateauAlerts"]`
    - Set `staleTime: 5 * 60 * 1000` (5 minute cache)
    - Set `retry: 3` for resilience
  - Export `usePlateauAlertsQuery` function
  - Full TypeScript typing (no implicit any)

**File**: [src/services/plateauService.ts](../../../src/services/plateauService.ts)

---

### T006 — [P] Create usePlateauAlerts Custom Hook

- [x] T006 [P] Create `src/hooks/usePlateauAlerts.ts` with orchestration logic
  - Import `useState`, `useMemo`, `useCallback` from React
  - Import `useTrainingSheet` hook
  - Import `usePlateauAlertsQuery` from service
  - Import localStorage utilities from `lib/alerts.ts`
  - Initialize state: `const [dismissedIds, setDismissedIds] = useState<string[]>(() => getDismissedFromStorage())`
  - Extract exercises: `const exercises = trainingSheet?.days.flatMap(day => day.exercises) ?? []`
  - Create `activeAlerts` useMemo that:
    - Filters out dismissed IDs from all alerts
    - Maps each alert and resolves `muscleGroup` from training sheet by exercise name
    - Returns `PlateauAlertWithMuscleGroup[]`
  - Implement `dismiss(alertId: string)` callback:
    - Calls `setDismissedIds(prev => [...prev, alertId])`
    - Calls `addToDismissed(alertId)` for localStorage sync
  - Implement `dismissAll()` callback:
    - Calls `setDismissedIds([])`
    - Calls `clearDismissed()` for localStorage sync
  - Return object with `{ activeAlerts, isLoading, error, dismiss, dismissAll }`
  - Full TypeScript typing

**File**: [src/hooks/usePlateauAlerts.ts](../../../src/hooks/usePlateauAlerts.ts)

---

### T007 — Verify Phase 2 Data Flow

- [x] T007 Open browser DevTools and test hook logic
  - Mount component using hook and verify `activeAlerts` array is populated
  - Call `dismiss(alertId)` and verify state updates immediately
  - Verify `dismissedIds` state reflects localStorage write
  - Call `dismissAll()` and verify state clears
  - Refresh page and verify dismissed IDs persist from localStorage

**Deliverables**:

- ✅ API service fetches and caches alerts
- ✅ Hook manages dismissed state
- ✅ Muscle group resolution working
- ✅ localStorage persistence working

---

## Phase 3: UI Components (Modal & Card)

**Goal**: Build presentation components. Verify rendering and animations.  
**Duration**: 1.5 sessions  
**Independent Test Criteria**:

- PlateauAlertCard renders all fields correctly
- PlateauAlertsModal displays list and handles interactions
- Fade-out animation plays on dismiss (300ms)
- Stagger animation plays on bulk dismiss (50ms delay)
- No business logic in components

---

### T008 — Create PlateauAlertCard Component

- [x] T008 Create `src/components/PlateauAlertCard/index.tsx`
  - Define Props interface: `{ alert: PlateauAlertWithMuscleGroup, onDismiss: (id: string) => void, isAnimating: boolean }`
  - Render alert fields in order:
    1. Exercise name + arrow: `{alert.exerciseName} →`
    2. Muscle group chip (conditional): `{alert.muscleGroup && <MuscleChip label={alert.muscleGroup} />}`
    3. Detected date: `{STRINGS.PLATEAU_DETECTED} {new Date(alert.detectedAt).toLocaleDateString()}`
    4. Stagnation label: `{STRINGS.PLATEAU_NO_PROGRESS}`
    5. Session count: `{alert.sessionCount} {STRINGS.PLATEAU_SESSIONS}`
    6. Suggestion: `💡 {alert.suggestion}`
    7. Dismiss link: `{STRINGS.PLATEAU_MARK_READ}` (onClick → `onDismiss(alert._id)`)
  - Component size: max 120 lines
  - Use theme tokens only (no hardcoded colors/spacing)
  - Export as `PlateauAlertCard`

**File**: [src/components/PlateauAlertCard/index.tsx](../../../src/components/PlateauAlertCard/index.tsx)

---

### T009 — Create PlateauAlertCard Styles

- [x] T009 Create `src/components/PlateauAlertCard/styles.ts`
  - Create `StyledCard` styled component (supports `isAnimating` prop)
    - When `isAnimating=true`: `opacity: 0; transition: opacity 300ms ease-out`
    - When `isAnimating=false`: `opacity: 1; transition: opacity 300ms ease-out`
  - Create styled components for: `ExerciseName`, `DetectedDate`, `StagnationLabel`, `SessionCount`, `Suggestion`, `DismissLink`
  - Use theme tokens for colors, spacing, typography
  - No hardcoded hex values or pixel sizes
  - Export all styled components

**File**: [src/components/PlateauAlertCard/styles.ts](../../../src/components/PlateauAlertCard/styles.ts)

---

### T010 — Create PlateauAlertsModal Component

- [x] T010 Create `src/components/PlateauAlertsModal/index.tsx`
  - Define Props interface: `{ isOpen: boolean, alerts: PlateauAlertWithMuscleGroup[], onClose: () => void, onDismiss: (id: string) => void, onDismissAll: () => void }`
  - Return null if `isOpen=false`
  - Render overlay with modal structure:
    1. Overlay (clickable to close)
    2. Modal (onClick stop propagation)
    3. Header with title: `{STRINGS.PLATEAU_TITLE} ({alerts.length})`
    4. Close button (×) → `onClose()`
    5. Subtitle: `{STRINGS.PLATEAU_SUBTITLE}`
    6. Conditional "Dismiss All" link (if alerts.length > 0): `{STRINGS.PLATEAU_MARK_ALL_READ}` → `onDismissAll()`
    7. Alert list (scrollable): map alerts → `<PlateauAlertCard key={alert._id} alert={alert} onDismiss={onDismiss} isAnimating={...} />`
  - Component size: max 140 lines
  - Pass state management to parent (no localStorage logic here)
  - Export as `PlateauAlertsModal`

**File**: [src/components/PlateauAlertsModal/index.tsx](../../../src/components/PlateauAlertsModal/index.tsx)

---

### T011 — Create PlateauAlertsModal Styles

- [x] T011 Create `src/components/PlateauAlertsModal/styles.ts`
  - Create `StyledOverlay` styled component
    - Position fixed, full screen, backdrop
    - Click handler for close
  - Create `StyledModal` styled component
    - Centered modal with max-width (mobile-first)
    - Scrollable content area
    - Z-index from theme
  - Create styled components for: `Header`, `Title`, `CloseButton`, `Subtitle`, `DismissAllLink`, `AlertList`
  - Stagger animation on AlertList children (index-based `animation-delay: ${index * 50}ms`)
  - Use theme tokens (colors, spacing, typography, z-index)
  - Export all styled components

**File**: [src/components/PlateauAlertsModal/styles.ts](../../../src/components/PlateauAlertsModal/styles.ts)

---

### T012 — Verify Phase 3 Component Rendering

- [x] T012 Render components in isolation and verify
  - PlateauAlertCard displays all fields correctly
  - PlateauAlertsModal renders overlay and modal structure
  - Fade-out animation triggers on card when `isAnimating=true`
  - Stagger animation visible in DevTools when dismissing all
  - No TypeScript errors in components

**Deliverables**:

- ✅ Modal and card components rendering correctly
- ✅ All animations working (fade-out 300ms, stagger 50ms)
- ✅ Components < 150 lines each
- ✅ Styles in separate files using theme tokens

---

## Phase 4: Integration (Home Page & Validation)

**Goal**: Wire components together, test end-to-end, finalize.  
**Duration**: 1 session  
**Independent Test Criteria**:

- Badge displays alert count (hidden when 0)
- Modal opens on bell click
- Dismiss actions update UI and localStorage
- All user scenarios from spec.md pass manual testing
- Zero TypeScript errors

---

### T013 — Integrate usePlateauAlerts into Home Page

- [x] T013 Update `src/app/dashboard/page.tsx` (or appropriate home page path)
  - Mark as `'use client'`
  - Import `useState` from React
  - Import `usePlateauAlerts` hook
  - Import `PlateauAlertsModal` component
  - Import `BellIcon` component
  - Initialize hook: `const { activeAlerts, isLoading, error, dismiss, dismissAll } = usePlateauAlerts()`
  - Initialize modal state: `const [modalOpen, setModalOpen] = useState(false)`
  - Add bell icon to header (location depends on existing layout):
    - Icon clickable: `onClick={() => setModalOpen(true)}`
    - Badge visible if `activeAlerts.length > 0`: show count
    - Badge hidden if count = 0
  - Render `<PlateauAlertsModal>` with props:
    - `isOpen={modalOpen}`
    - `alerts={activeAlerts}`
    - `onClose={() => setModalOpen(false)}`
    - `onDismiss={(id) => { dismiss(id); }}`
    - `onDismissAll={() => { dismissAll(); setModalOpen(false); }}`
  - Page component size: max 80 lines (excluding existing content)

**File**: [src/app/dashboard/page.tsx](../../../src/app/dashboard/page.tsx)

---

### T014 — [P] Verify Figma Design Alignment (Visual Reference)

- [x] T014 [P] Reference Figma file for design validation
  - Open Figma file key: `Buolm5kzeDIg7FMTyM21r5`
  - Verify bell icon badge positioning and styling
  - Verify modal layout: title, subtitle, alert cards, dismiss links
  - Verify alert card structure: exercise name, muscle chip, dates, suggestion, dismiss link
  - Verify animation timing: 300ms fade, 50ms stagger
  - Note any design adjustments needed
  - Use Figma MCP tool if available to extract exact dimensions/colors

**Reference**: Figma file `Buolm5kzeDIg7FMTyM21r5`

---

### T015 — Test All User Scenarios from Spec

- [x] T015 Manually test all scenarios from spec.md
  - **Scenario 1: View Badge** → Bell icon shows count ≥1, hidden when 0
  - **Scenario 2: Open Modal** → Modal opens within 200ms, displays alerts
  - **Scenario 3: Dismiss Single** → Card fades out (300ms), badge updates, localStorage persists
  - **Scenario 4: Dismiss All** → All cards stagger (50ms), modal closes, badge hidden, localStorage cleared
  - **Scenario 5: Persistence** → Refresh page, dismissed alerts remain gone
  - **Scenario 6: Error Handling** → Mock API error (500), verify graceful degradation
  - **Scenario 7: Empty State** → Zero alerts, no badge, no modal content
  - Document any issues found

**Test Cases**:

- Navigate to home screen
- Click bell icon multiple times
- Dismiss single alert, observe animation
- Refresh page, verify persistence
- Clear browser storage, reload to reset

---

### T016 — Accessibility & Keyboard Navigation

- [x] T016 Verify accessibility compliance
  - Modal is keyboard-navigable (Tab, Escape to close)
  - Dismiss links have proper focus styling
  - ARIA labels on buttons: `aria-label="Close"` on close button
  - All interactive elements have `:focus-visible` states
  - Color contrast meets WCAG AA minimum (4.5:1 text)
  - No focus traps

**Verification**: Use browser DevTools Accessibility Audit

---

### T017 — Performance Validation

- [x] T017 Verify performance meets success criteria
  - Modal opens within <200ms (React Query cached)
  - No layout shift during animations
  - localStorage read/write is synchronous (no janky scrolling)
  - React DevTools Profiler: component render time <100ms
  - Network tab: API call caches properly, second request uses cache

**Tools**: React DevTools Profiler, Chrome DevTools Network/Performance

---

### T018 — Final TypeScript Validation

- [x] T018 Run full TypeScript compilation and fix any errors
  - Command: `npm run build`
  - Zero errors required
  - Check all files in Phase 1-4
  - Verify strict mode: no implicit `any`, no loose typing
  - All exports properly typed

**Success Criteria**:

- ✅ Build succeeds
- ✅ Zero TypeScript errors
- ✅ All files follow constitution principles

---

### T019 — Cross-Cutting Concerns & Polish

- [x] T019 Final checks before merge
  - Verify no hardcoded strings (all from STRINGS constant)
  - Verify no hardcoded colors/spacing (all from theme)
  - Verify all animations from spec (fade 300ms, stagger 50ms)
  - Verify no fetch calls (all use apiClient)
  - Verify no tests generated (per constitution)
  - Code review: component sizes, naming, organization
  - Commit message format: `feat: implement plateau alerts (006)`

**Checklist**:

- [ ] All strings centralized
- [ ] All styles theme-driven
- [ ] All animations spec-compliant
- [ ] All API calls via apiClient
- [ ] No tests in codebase
- [ ] TypeScript strict mode
- [ ] Components < 150 lines
- [ ] Page file < 80 lines

---

## Phase Dependencies & Parallel Execution

### Dependency Graph

```
Phase 1 (Foundation)
├─ T001 (Types)
├─ T002 (Strings)
├─ T003 (localStorage utilities)
└─ T004 (TS validation)
    ↓
Phase 2 (Data Layer)
├─ T005 (Service) — depends on T001, T002
├─ T006 (Hook) — depends on T005, T003
└─ T007 (Data flow test) — depends on T006
    ↓
Phase 3 (UI Components)
├─ T008 (PlateauAlertCard) — depends on T001, T002
├─ T009 (Card styles) — depends on T008
├─ T010 (PlateauAlertsModal) — depends on T008, T001, T002
├─ T011 (Modal styles) — depends on T010
└─ T012 (Component test) — depends on T011
    ↓
Phase 4 (Integration)
├─ T013 (Home page) — depends on T006, T011
├─ T014 (Design alignment) — parallel to T013
├─ T015 (Scenario testing) — depends on T013
├─ T016 (Accessibility) — depends on T015
├─ T017 (Performance) — depends on T015
├─ T018 (TypeScript) — depends on all
└─ T019 (Polish) — depends on T018
```

### Parallel Opportunities

**Within Phase 1**:

- T001, T002, T003 can run in parallel (no dependencies)
- T004 runs after all three

**Within Phase 3**:

- T008 & T010 can start in parallel (both depend on T001, T002 from Phase 1)
- T009 depends on T008; T011 depends on T010
- T012 runs last (after both components ready)

**Within Phase 4**:

- T013 & T014 can run in parallel
- Rest depends on T013

---

## Success Criteria Summary

| Criterion               | Task | Validation                                        |
| ----------------------- | ---- | ------------------------------------------------- |
| Badge displays count    | T013 | Visual test: count visible, hidden when 0         |
| Modal opens fast        | T017 | Performance: <200ms (React Query cached)          |
| Fade-out animation      | T012 | Visual test: 300ms smooth transition              |
| Stagger animation       | T012 | Visual test: 50ms delay between cards             |
| localStorage persists   | T015 | Test: refresh page, dismissed alerts stay gone    |
| muscleGroup resolved    | T006 | Test: chip displays if exercise in training sheet |
| All strings centralized | T019 | Code review: no hardcoded text                    |
| Strict TypeScript       | T018 | Build succeeds, zero errors                       |
| Component sizes         | T019 | Code review: <150 lines each, <80 page            |
| Theme-driven styles     | T019 | Code review: no hardcoded colors                  |

---

## Sign-Off Checklist

- [ ] All tasks completed in sequence
- [ ] All phases independently tested
- [ ] User scenarios pass manual testing
- [ ] TypeScript strict mode validation passes
- [ ] Figma design alignment verified
- [ ] Accessibility checklist complete
- [ ] Performance metrics met
- [ ] Code review passed
- [ ] Ready for merge to main

---

## References

- **Feature Spec**: [spec.md](./spec.md)
- **Implementation Plan**: [plan.md](./plan.md)
- **Figma Design**: [Buolm5kzeDIg7FMTyM21r5](https://www.figma.com/file/Buolm5kzeDIg7FMTyM21r5)
- **Constitution**: [LoadUp Frontend Constitution](../../.specify/memory/constitution.md)
- **Related Specs**: spec 002 (web-app), spec 005 (translation-service)
