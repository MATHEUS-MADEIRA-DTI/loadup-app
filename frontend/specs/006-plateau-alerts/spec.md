# Feature Specification: Plateau Alerts Notification System

**Feature ID**: 006-plateau-alerts | **Status**: Specification | **Date**: 2026-05-13

---

## Executive Summary

This feature adds a plateau alerts notification system to the LoadUp frontend home screen. Users receive visual alerts when exercises show no progression for extended periods. Alerts are displayed via a badge-enabled notification bell icon in the home header, with details in a modal dialog. The system uses localStorage for dismissal persistence and integrates with the backend `/plateau/alerts` endpoint.

---

## User Stories

### US1 — View Plateau Alerts on Home Screen

**As a** user training with LoadUp  
**I want to** see a notification badge showing how many exercises have plateau alerts  
**So that** I'm immediately aware of exercises that need intervention

**Acceptance Criteria**:

- Bell icon in home header displays a badge with the count of active plateau alerts (≥1)
- Badge is hidden when alert count is 0
- Badge updates when alerts are dismissed
- Clicking the bell opens the "Alertas de Platô" modal

### US2 — Review Plateau Alert Details in Modal

**As a** user,  
**I want to** open a modal showing detailed information about each plateau alert  
**So that** I understand which exercises are stagnating and for how long

**Acceptance Criteria**:

- Modal opens on bell click with title "Alertas de Platô" and active alert count
- Modal displays subtitle: "Exercícios sem evolução detectados pelo sistema"
- Each alert card shows: exercise name, muscle group, last progress date, stagnation period (weeks), and suggestion text
- Close button (X) in modal header closes the modal
- Modal scrolls if alert list exceeds visible area

### US3 — Dismiss Individual Alerts

**As a** user,  
**I want to** dismiss individual plateau alerts one at a time  
**So that** I can focus on other exercises and suppress repetitive alerts temporarily

**Acceptance Criteria**:

- Each alert card displays a "Marcar como lido" link at the bottom
- Clicking "Marcar como lido" removes that alert from the list with a fade-out animation
- Dismissed alerts are stored in localStorage so they remain dismissed after page refresh
- Badge counter decrements by 1
- Modal closes if the last alert is dismissed

### US4 — Dismiss All Alerts at Once

**As a** user,  
**I want to** quickly dismiss all plateau alerts in one action  
**So that** I can reset the notification state and start fresh

**Acceptance Criteria**:

- "Marcar todos como lidos" link appears at the top of the modal
- Clicking it dismisses all alerts simultaneously
- All alerts fade out and are removed from the modal
- Modal closes when all alerts are dismissed
- Badge disappears (count = 0)
- localStorage dismissed list is cleared

---

## Functional Requirements

### FR-001 — Fetch Alerts on Home Mount

When the home screen component mounts, the system shall fetch the list of active plateau alerts from the backend endpoint `GET /plateau/alerts` with the user's JWT token.

### FR-002 — Display Badge Counter

The notification bell icon shall display a badge showing the count of alerts that have not been dismissed. The badge shall be hidden if the count is 0.

### FR-003 — Modal Display

Clicking the bell icon shall open a modal with:

- Title: "Alertas de Platô" with count badge (e.g., "Alertas de Platô (3)")
- Subtitle: "Exercícios sem evolução detectados pelo sistema"
- "Marcar todos como lidos" link at the top (if alerts exist)
- Scrollable list of alert cards
- Close button (X) in the header

### FR-004 — Alert Card Structure

Each alert card shall display:

- **Exercise Name** with arrow icon (→)
- **Muscle Group Chip**: colored label (e.g., Peito, Costas, Perna) — resolved from training sheet data using the exercise name
  - If exercise not found in training sheet, chip is not displayed
- **Detected Date**: "Detectado em {date}" in small text (from `detectedAt` ISO date)
- **Stagnation Label**: "Sem evolução"
- **Session Count Display**: showing number of sessions without progression (e.g., "4 sessões sem evolução")
- **Suggestion Icon & Text**: yellow bulb icon (💡) with recommendation text
- **Dismiss Link**: "Marcar como lido" link at the bottom
- **Alert Type Badge**: Optional badge indicating alert type ("exercise" or "day")

### FR-005 — Individual Dismissal

Clicking "Marcar como lido" on an alert card shall:

1. Add the alert `_id` to a dismissed list in localStorage (key: `plateau_alerts_dismissed`)
2. Animate the card out with a fade-out transition (300ms)
3. Remove the card from the DOM
4. Decrement the badge counter by 1
5. Hide the badge if counter reaches 0
6. Close the modal if no alerts remain

### FR-006 — Bulk Dismissal

Clicking "Marcar todos como lidos" shall:

1. Animate all alert cards out with staggered fade-out (50ms delay between cards)
2. Clear the dismissed list in localStorage
3. Close the modal
4. Hide the badge

### FR-007 — localStorage Persistence

- Dismissed alerts shall be stored in `localStorage.plateau_alerts_dismissed` as a JSON array of alert `_id` values
- On page refresh, alerts in the dismissed list shall be hidden from the modal
- The badge counter shall reflect only non-dismissed alerts
- Example dismissed array: `["507f1f77bcf86cd799439011", "507f1f77bcf86cd799439012"]`

### FR-008 — API Integration

- Fetch alerts via `GET /plateau/alerts` (JWT required)
- Response is wrapped: `{ data: PlateauAlert[], timestamp: string }`
- Frontend shall extract alerts from `response.data`
- No POST/PUT/DELETE endpoints needed (marking as read is visual-only)
- Retry logic: if fetch fails, display a warning message and allow user to retry

---

## User Scenarios & Testing

### Scenario 1: User Discovers New Plateau Alerts

1. User navigates to home screen
2. Bell icon displays badge "2" indicating 2 active alerts
3. User clicks bell icon
4. Modal opens showing 2 alert cards (Bench Press with 3 weeks stagnation, Squat with 1 week stagnation)
5. User reviews the exercise names, muscle groups, and suggestions

**Test Case**:

- Mock `/plateau/alerts` to return `{ data: [2 alerts], timestamp: "..." }`
- Verify badge displays "2"
- Verify modal content matches returned data
- Verify card layout matches Figma design

### Scenario 2: User Dismisses One Alert

1. User has modal open with 2 alerts
2. User clicks "Marcar como lido" on the Bench Press alert
3. Card fades out and is removed
4. Badge updates to "1"
5. User refreshes page
6. Modal shows only 1 alert (Squat)
7. Badge still shows "1"

**Test Case**:

- Mock `/plateau/alerts` to return `{ data: [2 alerts], timestamp: "..." }`
- Click "Marcar como lido" on first alert
- Verify card animates out
- Verify localStorage has alert `_id` in dismissed list
- Verify badge updates
- Reload page and verify dismissed alert is not shown

### Scenario 3: User Dismisses All Alerts

1. User has modal open with 3 alerts
2. User clicks "Marcar todos como lidos"
3. All cards fade out with staggered timing
4. Modal closes automatically
5. Badge disappears
6. User clicks bell again
7. No modal opens (or empty state is shown)

**Test Case**:

- Mock `/plateau/alerts` to return `{ data: [3 alerts], timestamp: "..." }`
- Click "Marcar todos como lidos"
- Verify staggered animation
- Verify modal closes
- Verify badge is hidden
- Verify localStorage dismissed list is empty
- Click bell again and verify empty state

### Scenario 4: API Failure Handling

1. User navigates to home screen
2. Backend `/plateau/alerts` returns 500 error
3. Bell icon shows error state (or no badge)
4. Retry button or warning message is displayed
5. User can click retry to fetch alerts again

**Test Case**:

- Mock `/plateau/alerts` to return error
- Verify error state is handled gracefully
- Verify retry mechanism works

---

## Success Criteria

| Criterion                        | Metric                                             | Definition                                             |
| -------------------------------- | -------------------------------------------------- | ------------------------------------------------------ |
| **SC-001: Feature Adoption**     | ≥80% of active users see the bell icon badge       | Badge displayed to all logged-in users on home screen  |
| **SC-002: Alert Dismissal Rate** | ≥50% of alerts are dismissed within 7 days         | Indicates user engagement with the notification system |
| **SC-003: Performance**          | Modal opens within <200ms                          | User perceives instant response on bell click          |
| **SC-004: Persistence**          | Dismissed alerts remain hidden across page reloads | localStorage implementation verified                   |
| **SC-005: Empty State**          | Badge hidden when alert count = 0                  | Visual clutter reduced for users without alerts        |

---

## Key Entities & Data Structure

### Alert Object (from `/plateau/alerts`)

**Response Wrapper**:

```typescript
interface ApiResponse {
  data: PlateauAlert[];
  timestamp: string; // ISO date string
}
```

**Alert Object** (from backend):

```typescript
interface PlateauAlert {
  _id: string; // unique ID for dismissal tracking (MongoDB ObjectId)
  exerciseName: string; // e.g., "Supino"
  dayOfWeek: string; // e.g., "Monday", "Segunda-feira"
  alertType: "exercise" | "day"; // type of alert: exercise stagnation or day-based alert
  sessionCount: number; // e.g., 4 (number of sessions without progression)
  suggestion: string; // e.g., "Aumente o peso em 5%"
  detectedAt: string; // ISO date string when alert was detected "2026-05-01T..."
  active: boolean; // whether alert is still active
}
```

**Client-Side Resolution**:

The `muscleGroup` field is **not** provided by the backend. The frontend shall resolve it by:
1. Taking the `exerciseName` from the PlateauAlert
2. Cross-referencing it against the training sheet data (available via `useTrainingSheet` hook)
3. Retrieving the muscle group association from the training sheet
4. If no match is found, the muscle group chip is not displayed

This approach ensures that the muscle group label always matches the user's current training sheet configuration.

### localStorage Key

**Key**: `plateau_alerts_dismissed`  
**Type**: `string` (JSON-stringified array)  
**Value**: `["_id1", "_id2"]` (array of alert `_id` values from backend)  
**Scope**: Application-wide, persists across sessions

---

## Visual & Interaction Design

### Figma Reference

**File Key**: `Buolm5kzeDIg7FMTyM21r5`  
**Screens to reference**:

- Bell icon badge positioning and styling
- "Alertas de Platô" modal layout, typography, spacing
- Alert card component with all sub-elements
- Fade-out animation timing and easing

### Color Palette (from app theme)

- **Badge Background**: Theme primary color (e.g., orange, blue)
- **Muscle Group Chips**: Predefined color map (e.g., Peito=red, Costas=blue)
- **Stagnation Bar**: Orange/warning color
- **Suggestion Icon**: Yellow (💡)
- **Dismiss Link**: Theme link color (blue, underline on hover)

### Typography

- Modal title: Bold, 18px
- Subtitle: Regular, 14px, secondary color
- Exercise name: Bold, 16px
- Muscle group chip: Small, 12px, white text
- Dismiss link: 13px, link color, underline on hover

### Animation

- **Fade-out**: 300ms, ease-out
- **Bulk dismissal stagger**: 50ms delay between cards
- **Modal open/close**: 200ms, ease-in-out

---

## Constraints & Assumptions

### Constraints

- Feature is **visual/client-side only** — no server-side state changes
- No backend endpoint exists for marking alerts as read
- Badge counter is synchronous and client-only
- Dismissed alerts are not synced to server or other devices

### Assumptions

- User is always logged in (JWT available) when viewing home screen
- Backend returns well-formed alert objects with all required fields
- Training sheet data is available on the frontend via `useTrainingSheet` hook
- Exercise names in plateau alerts match exercise names in the training sheet for reliable cross-referencing
- Muscle group translations are handled by spec 005 (already applied)
- Figma design is authoritative for visual styling
- Browser supports `localStorage` (all modern browsers)
- Maximum reasonable alert count is <100 (no pagination assumed)

---

## Dependencies

### Internal

- [spec 005 — Translation Service](../../005-translation-service/spec.md): Muscle group translations already applied by backend

### External

- **Backend Endpoint**: `GET /plateau/alerts` (returns active plateau alerts)
- **Design System**: Figma file `Buolm5kzeDIg7FMTyM21r5`
- **Authentication**: JWT token from app auth state

---

## Out of Scope

The following are explicitly out of scope for this feature:

- Server-side marking alerts as read (no POST endpoint)
- Push notifications or email alerts
- Alert history or archive view
- Syncing dismissals across user devices
- Custom alert preferences or filtering
- Exporting or sharing alert data

---

## Acceptance & Readiness

**Specification Completeness**: Ready for planning  
**Stakeholder Sign-Off**: Pending  
**Design Finalization**: Pending Figma review  
**Backend Readiness**: `/plateau/alerts` endpoint assumed available (spec 004)
