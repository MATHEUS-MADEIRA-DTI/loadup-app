# Implementation Plan: Plateau Alerts (006)

**Feature**: 006-plateau-alerts  
**Status**: Planning  
**Target**: LoadUp Frontend (Next.js App Router)  
**Date**: 2026-05-13

---

## Constitution Check

### ✅ Principle I: TypeScript Strict Mode

- All service functions, hooks, and components will export explicit types
- `PlateauAlert` interface will be defined in `types/index.ts` with all fields typed
- No implicit `any` or loose typing
- React Query will be fully typed with `UseQueryResult<PlateauAlert[]>`

### ✅ Principle II: Component-Based Architecture

- **Service layer** (`plateauService.ts`): isolated API calls via React Query
- **Custom hook** (`usePlateauAlerts.ts`): data-fetching orchestration, localStorage logic
- **Modal component** (`PlateauAlertsModal`): presentation-only, no business logic
- **Card component** (`PlateauAlertCard`): single responsibility (render one alert)
- **Home page integration**: minimal; delegates to hook and components
- Each component max 150 lines; styles co-located

### ✅ Principle III: Clean Code & DRY

- All alert strings centralized in `constants/strings.ts`
- All animations imported from `lib/animations.ts` (reuse from spec 002)
- `muscleGroup` resolution logic in hook to avoid duplication
- No magic numbers; all constants defined (300ms fade, 50ms stagger, localStorage key)

### ✅ Principle IV: API Layer Isolation

- `plateauService.ts` wraps all calls to `GET /plateau/alerts`
- React Query (`useQuery`) handles caching, refetching, error states
- JWT token read from centralized auth source (already available in existing codebase)
- Service returns typed `PlateauAlert[]` after extracting from response wrapper

### ✅ Principle V: Mobile-First, Theme-Driven UI

- All Styled Components use theme tokens from existing ThemeProvider
- Modal and card styles in dedicated `styles.ts` files
- Color scheme for muscle group chips uses theme color map
- Badge and animations respect global theme spacing and timing
- Figma reference: `Buolm5kzeDIg7FMTyM21r5` (authoritative for layout and typography)

---

## Technical Architecture

### Data Flow

```
1. Home page mounts
   ↓
2. usePlateauAlerts hook initializes
   ├─ Fetch alerts via React Query (plateauService.getAlerts)
   ├─ Read dismissed list from localStorage
   ├─ Filter out dismissed alerts
   └─ Return: { alerts, isLoading, error, dismiss, dismissAll }
   ↓
3. Bell icon component
   ├─ Display badge count (activeAlerts.length)
   ├─ Show error state if fetch failed
   └─ Trigger modal on click
   ↓
4. Modal opens (PlateauAlertsModal)
   ├─ Display title with alert count
   ├─ Render PlateauAlertCard for each alert
   └─ Provide dismiss actions
   ↓
5. User dismisses alert(s)
   ├─ Hook updates localStorage
   ├─ Hook filters out dismissed from state
   ├─ Card animates out (300ms)
   └─ Badge updates immediately
```

### Component Hierarchy

```
Home (page.tsx)
├── PlateauAlertsBell (badge + click handler)
│   └── PlateauAlertsModal (conditional render)
│       ├── Header (title, close button)
│       ├── DismissAllLink
│       └── AlertList
│           └── PlateauAlertCard[] (map over filtered alerts)
│               ├── ExerciseName + Arrow
│               ├── MuscleChip (if muscleGroup resolved)
│               ├── DetectedDate
│               ├── SessionCountDisplay
│               ├── SuggestionText
│               └── DismissLink
```

### State Management

**React Query** (server state):

- `useQuery('plateauAlerts', () => plateauService.getAlerts())`
- Handles: loading, error, refetch, cache invalidation
- No manual loading/error state needed in component

**localStorage** (client state):

- Key: `plateau_alerts_dismissed`
- Value: JSON array of alert `_id` strings
- Synced via custom hook after each dismiss action

**Local component state** (UI state):

- Modal open/closed (boolean)
- Animating card IDs (Set<string>) for stagger logic

### Type Definitions

```typescript
// types/index.ts
interface PlateauAlert {
  _id: string;
  exerciseName: string;
  dayOfWeek: string;
  alertType: "exercise" | "day";
  sessionCount: number;
  suggestion: string;
  detectedAt: string;
  active: boolean;
}

interface PlateauAlertWithMuscleGroup extends PlateauAlert {
  muscleGroup?: string; // resolved client-side
}

// Response wrapper from backend
interface PlateauAlertsResponse {
  data: PlateauAlert[];
  timestamp: string;
}
```

---

## Implementation Phases

### Phase 1: Foundation (Data Layer)

**Duration**: 1 session

**Tasks**:

1. Create `src/types/index.ts` → add `PlateauAlert`, `PlateauAlertWithMuscleGroup`, `PlateauAlertsResponse` interfaces
2. Create `src/services/plateauService.ts` → `getAlerts()` function with React Query
3. Add plateau alert strings to `constants/strings.ts`
4. Verify TypeScript compilation

**Deliverables**:

- Typed API service layer
- All strings centralized
- Zero TypeScript errors

---

### Phase 2: Hooks & Business Logic

**Duration**: 1 session

**Tasks**:

1. Create `src/hooks/usePlateauAlerts.ts`
   - Wrap React Query `useQuery`
   - Filter dismissed alerts from localStorage
   - Add `dismiss(alertId)` action
   - Add `dismissAll()` action
   - Cross-reference `muscleGroup` from `useTrainingSheet` hook
   - Return: `{ activeAlerts, isLoading, error, dismiss, dismissAll }`
2. Add `lib/alerts.ts` utility functions
   - `getDismissedFromStorage()`: read localStorage
   - `addToDismissed(alertId)`: update localStorage
   - `clearDismissed()`: clear localStorage
3. Test hook logic manually via browser console

**Deliverables**:

- Custom hook with complete business logic
- localStorage persistence working
- Muscle group resolution working

---

### Phase 3: UI Components

**Duration**: 2 sessions

**Session 3a: Modal & Card Components**

1. Create `src/components/PlateauAlertCard/` (index.tsx + styles.ts)
   - Props: `alert: PlateauAlertWithMuscleGroup`, `onDismiss: (id) => void`, `isAnimating: boolean`
   - Max 120 lines including inline styles structure
   - Display all alert fields per FR-004
   - Apply fade-out animation when `isAnimating=true`
2. Create `src/components/PlateauAlertsModal/` (index.tsx + styles.ts)
   - Props: `isOpen: boolean`, `alerts: PlateauAlertWithMuscleGroup[]`, `onClose: () => void`, `onDismiss: (id) => void`, `onDismissAll: () => void`
   - Max 140 lines
   - Map over alerts → PlateauAlertCard[]
   - Implement stagger animation on dismissAll (50ms delay via Framer Motion or CSS)
3. Test component rendering in isolation

**Session 3b: Integration & Home Page**

1. Integrate `usePlateauAlerts` hook into Home page
   - Add `const { activeAlerts, isLoading, error, dismiss, dismissAll } = usePlateauAlerts()`
   - Keep page component ≤80 lines
2. Add bell icon with badge to header
   - Badge count = `activeAlerts.length`
   - Badge hidden if count = 0
   - Click opens PlateauAlertsModal
3. Wire dismiss handlers to modal and cards
4. Test full flow end-to-end

**Deliverables**:

- Modal and card components rendering correctly
- All animations working
- Home page integration complete
- <150 lines per component, <80 lines on page file

---

### Phase 4: Polish & Validation

**Duration**: 1 session

**Tasks**:

1. Verify Figma design alignment (button styling, colors, spacing, typography)
2. Test all user scenarios from spec.md:
   - View badge
   - Open modal
   - Dismiss single alert
   - Dismiss all alerts
   - localStorage persistence (refresh page)
   - Error handling (mock 500 response)
   - Empty state (no alerts)
3. Accessibility check:
   - Modal is keyboard-navigable
   - Focus management on open/close
   - ARIA labels on buttons
4. Performance check:
   - Modal opens within 200ms (React Query cached)
   - No layout shift on animation
   - localStorage read/write is synchronous
5. Final TypeScript compilation check

**Deliverables**:

- All specs validated
- Design alignment verified
- Performance meets requirements
- Zero TypeScript errors
- Code ready for merge

---

## File Structure & Implementation Order

### New Files

```
src/
├── types/
│   └── index.ts                          (add PlateauAlert, PlateauAlertWithMuscleGroup, PlateauAlertsResponse)
├── services/
│   └── plateauService.ts                 (new file: getAlerts with React Query)
├── hooks/
│   └── usePlateauAlerts.ts               (new file: orchestration + localStorage)
├── components/
│   ├── PlateauAlertsModal/
│   │   ├── index.tsx                     (new file: modal component)
│   │   └── styles.ts                     (new file: styled components)
│   └── PlateauAlertCard/
│       ├── index.tsx                     (new file: alert card component)
│       └── styles.ts                     (new file: styled components)
├── lib/
│   └── alerts.ts                         (new file: localStorage utilities)
└── constants/
    └── strings.ts                        (modify: add plateau alert strings)
```

### Modified Files

```
src/
├── app/
│   └── (dashboard)/
│       └── page.tsx                      (modify: integrate usePlateauAlerts, add bell click)
├── types/
│   └── index.ts                          (modify: add PlateauAlert interfaces)
└── constants/
    └── strings.ts                        (modify: add PLATEAU_ALERTS_* strings)
```

---

## Key Implementation Details

### 1. React Query Service (`plateauService.ts`)

```typescript
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";
import type { PlateauAlert, PlateauAlertsResponse } from "@/types";

async function getAlertsFromAPI(): Promise<PlateauAlert[]> {
  const { data } =
    await apiClient.get<PlateauAlertsResponse>("/plateau/alerts");
  return data.data; // extract from wrapper
}

export function usePlateauAlertsQuery() {
  return useQuery({
    queryKey: ["plateauAlerts"],
    queryFn: getAlertsFromAPI,
    staleTime: 5 * 60 * 1000, // 5 min cache
    retry: 3,
  });
}
```

### 2. Custom Hook (`usePlateauAlerts.ts`)

```typescript
import { useMemo, useCallback, useState } from "react";
import { useTrainingSheet } from "@/hooks/useTrainingSheet";
import { usePlateauAlertsQuery } from "@/services/plateauService";
import {
  getDismissedFromStorage,
  addToDismissed,
  clearDismissed,
} from "@/lib/alerts";
import type { PlateauAlert, PlateauAlertWithMuscleGroup } from "@/types";

export function usePlateauAlerts() {
  const { data: allAlerts = [], isLoading, error } = usePlateauAlertsQuery();
  const { data: trainingSheet } = useTrainingSheet();
  const exercises = trainingSheet?.days.flatMap((day) => day.exercises) ?? [];

  // Initialize from localStorage, triggers re-render on update
  const [dismissedIds, setDismissedIds] = useState<string[]>(() =>
    getDismissedFromStorage(),
  );

  // Resolve muscleGroup from training sheet and filter by dismissed state
  const activeAlerts: PlateauAlertWithMuscleGroup[] = useMemo(() => {
    return allAlerts
      .filter((alert) => !dismissedIds.includes(alert._id))
      .map((alert) => {
        const exercise = exercises.find((ex) => ex.name === alert.exerciseName);
        return {
          ...alert,
          muscleGroup: exercise?.muscleGroup,
        };
      });
  }, [allAlerts, dismissedIds, exercises]);

  const dismiss = useCallback((alertId: string) => {
    setDismissedIds((prev) => {
      const updated = [...prev, alertId];
      addToDismissed(alertId); // sync to localStorage
      return updated;
    });
  }, []);

  const dismissAll = useCallback(() => {
    setDismissedIds([]);
    clearDismissed(); // sync to localStorage
  }, []);

  return {
    activeAlerts,
    isLoading,
    error: error instanceof Error ? error.message : null,
    dismiss,
    dismissAll,
  };
}
```

### 3. localStorage Utilities (`lib/alerts.ts`)

```typescript
const STORAGE_KEY = "plateau_alerts_dismissed";

export function getDismissedFromStorage(): string[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function addToDismissed(alertId: string): void {
  const dismissed = getDismissedFromStorage();
  if (!dismissed.includes(alertId)) {
    dismissed.push(alertId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dismissed));
  }
}

export function clearDismissed(): void {
  localStorage.removeItem(STORAGE_KEY);
}
```

### 4. Alert Card Component (`PlateauAlertCard/index.tsx`)

```typescript
import styled from 'styled-components';
import { MuscleChip } from '@/components/MuscleChip';
import { STRINGS } from '@/constants/strings';
import type { PlateauAlertWithMuscleGroup } from '@/types';

interface Props {
  alert: PlateauAlertWithMuscleGroup;
  onDismiss: (id: string) => void;
  isAnimating: boolean;
}

export function PlateauAlertCard({ alert, onDismiss, isAnimating }: Props) {
  return (
    <StyledCard isAnimating={isAnimating}>
      <ExerciseName>{alert.exerciseName} →</ExerciseName>
      {alert.muscleGroup && <MuscleChip label={alert.muscleGroup} />}
      <DetectedDate>{STRINGS.PLATEAU_DETECTED} {new Date(alert.detectedAt).toLocaleDateString()}</DetectedDate>
      <StagnationLabel>{STRINGS.PLATEAU_NO_PROGRESS}</StagnationLabel>
      <SessionCount>{alert.sessionCount} {STRINGS.PLATEAU_SESSIONS}</SessionCount>
      <Suggestion>💡 {alert.suggestion}</Suggestion>
      <DismissLink onClick={() => onDismiss(alert._id)}>{STRINGS.PLATEAU_MARK_READ}</DismissLink>
    </StyledCard>
  );
}

// Styled components...
```

### 5. Modal Component (`PlateauAlertsModal/index.tsx`)

```typescript
import styled from 'styled-components';
import { PlateauAlertCard } from '@/components/PlateauAlertCard';
import { STRINGS } from '@/constants/strings';
import type { PlateauAlertWithMuscleGroup } from '@/types';

interface Props {
  isOpen: boolean;
  alerts: PlateauAlertWithMuscleGroup[];
  onClose: () => void;
  onDismiss: (id: string) => void;
  onDismissAll: () => void;
}

export function PlateauAlertsModal({ isOpen, alerts, onClose, onDismiss, onDismissAll }: Props) {
  if (!isOpen) return null;

  return (
    <StyledOverlay onClick={onClose}>
      <StyledModal onClick={(e) => e.stopPropagation()}>
        <Header>
          <Title>{STRINGS.PLATEAU_TITLE} ({alerts.length})</Title>
          <CloseButton onClick={onClose}>×</CloseButton>
        </Header>
        <Subtitle>{STRINGS.PLATEAU_SUBTITLE}</Subtitle>
        {alerts.length > 0 && (
          <DismissAllLink onClick={onDismissAll}>{STRINGS.PLATEAU_MARK_ALL_READ}</DismissAllLink>
        )}
        <AlertList>
          {alerts.map((alert) => (
            <PlateauAlertCard
              key={alert._id}
              alert={alert}
              onDismiss={onDismiss}
            />
          ))}
        </AlertList>
      </StyledModal>
    </StyledOverlay>
  );
}

// Styled components...
```

### 6. Home Page Integration

```typescript
'use client';

import { useState } from 'react';
import { BellIcon } from '@/components/Icons';
import { PlateauAlertsModal } from '@/components/PlateauAlertsModal';
import { usePlateauAlerts } from '@/hooks/usePlateauAlerts';

export default function HomePage() {
  const [modalOpen, setModalOpen] = useState(false);
  const { activeAlerts, isLoading, error, dismiss, dismissAll } = usePlateauAlerts();

  return (
    <main>
      {/* Existing home page content */}

      <BellIconWrapper>
        <BellIcon onClick={() => setModalOpen(true)} />
        {activeAlerts.length > 0 && (
          <Badge>{activeAlerts.length}</Badge>
        )}
      </BellIconWrapper>

      <PlateauAlertsModal
        isOpen={modalOpen}
        alerts={activeAlerts}
        onClose={() => setModalOpen(false)}
        onDismiss={(id) => {
          dismiss(id);
          // Optional: stay open, or close on last dismiss
        }}
        onDismissAll={() => {
          dismissAll();
          setModalOpen(false);
        }}
      />
    </main>
  );
}
```

---

## Strings Configuration

All UI text in `constants/strings.ts`:

```typescript
export const STRINGS = {
  PLATEAU_TITLE: "Alertas de Platô",
  PLATEAU_SUBTITLE: "Exercícios sem evolução detectados pelo sistema",
  PLATEAU_MARK_ALL_READ: "Marcar todos como lidos",
  PLATEAU_MARK_READ: "Marcar como lido",
  PLATEAU_DETECTED: "Detectado em",
  PLATEAU_NO_PROGRESS: "Sem evolução",
  PLATEAU_SESSIONS: "sessões sem evolução",
  PLATEAU_FETCH_ERROR: "Erro ao carregar alertas",
  PLATEAU_RETRY: "Tentar novamente",
};
```

---

## Animation Strategy

### Fade-Out (Single Dismiss)

- Use CSS `opacity: 0` + `transition: opacity 300ms ease-out`
- Remove from DOM after transition completes (via useEffect + callback)

### Stagger (Bulk Dismiss)

- Calculate stagger via index: `animation-delay: ${index * 50}ms`
- All cards animate simultaneously with cascading delay
- Reuse animation from `lib/animations.ts` if available from spec 002

---

## Testing Strategy

Per Constitution, **no automated tests**. Instead:

1. **Manual browser testing** (all scenarios from spec.md)
2. **localStorage verification** (DevTools → Application → Storage)
3. **Network tab** (verify JWT in Authorization header, response structure)
4. **TypeScript compilation** (zero errors required)
5. **Performance** (React DevTools Profiler)

---

## Dependencies & Assumptions

| Dependency                          | Status       | Notes                                 |
| ----------------------------------- | ------------ | ------------------------------------- |
| `@tanstack/react-query` v5+         | ✅ Existing  | Already available in project          |
| `useTrainingSheet` hook             | ✅ Existing  | Used for muscle group cross-reference |
| `MuscleChip` component              | ✅ Existing  | Shared component from spec 002        |
| `Modal` base component              | ✅ Existing  | Reuse pattern from spec 002           |
| Figma file `Buolm5kzeDIg7FMTyM21r5` | ✅ Available | Design reference                      |
| `lib/animations.ts`                 | ✅ Existing  | Page transition animations            |
| Auth context/token source           | ✅ Existing  | Centralized JWT access                |
| `ThemeProvider` + theme tokens      | ✅ Existing  | Global styling                        |

---

## Success Criteria

✅ **SC-001**: Bell icon badge displays active alert count (hidden when 0)  
✅ **SC-002**: Modal opens within <200ms (React Query cached)  
✅ **SC-003**: Fade-out animation 300ms, smooth and visual  
✅ **SC-004**: Stagger animation on bulk dismiss (50ms delay between cards)  
✅ **SC-005**: localStorage persists dismissed alerts across page reloads  
✅ **SC-006**: muscleGroup resolved from training sheet (or chip hidden)  
✅ **SC-007**: All strings from constants, no hardcoded text  
✅ **SC-008**: TypeScript strict mode, zero errors  
✅ **SC-009**: All components ≤150 lines, page ≤80 lines  
✅ **SC-010**: Styles in dedicated styles.ts, no inline hex values

---

## Risk & Mitigation

| Risk                                    | Probability | Mitigation                                              |
| --------------------------------------- | ----------- | ------------------------------------------------------- |
| Exercise name mismatch (training sheet) | Low         | Add fallback: chip hidden if exercise not found         |
| localStorage quota exceeded             | Very Low    | Max ~100 alerts = <1KB JSON                             |
| React Query cache stale                 | Low         | Use 5-minute staleTime, manual refetch on modal open    |
| Modal z-index conflict                  | Low         | Use theme.zIndex.modal, ensure consistent with spec 002 |
| Figma design complexity                 | Low         | Copilot has freedom to simplify while maintaining UX    |

---

## Handoff Checklist

Before implementation begins:

- [ ] Constitution Check completed (above)
- [ ] Tech stack alignment confirmed (Next.js, Styled Components, React Query)
- [ ] Figma file accessible: `Buolm5kzeDIg7FMTyM21r5`
- [ ] Training sheet hook signature documented
- [ ] Existing modal/chip components reviewed
- [ ] Backend endpoint `/plateau/alerts` verified to exist
- [ ] Team aligned on stagger timing (50ms) and fade duration (300ms)

---

## References

- **Feature Spec**: [006-plateau-alerts/spec.md](./spec.md)
- **Figma Design**: [Buolm5kzeDIg7FMTyM21r5](https://www.figma.com/file/Buolm5kzeDIg7FMTyM21r5)
- **Constitution**: [LoadUp Frontend Constitution v1.0.0](./.specify/memory/constitution.md)
- **Related Specs**: spec 002 (web-app, modal/animation patterns), spec 005 (translation service)
