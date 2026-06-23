# Feature Specification: External Exercise Search API

**Feature Branch**: `003-exercise-api-mcp`  
**Created**: 2026-05-12  
**Status**: Draft

## User Scenarios & Testing _(mandatory)_

### User Story 1 — Search Exercises by Name or Muscle Group (Priority: P1)

A user types a search term (exercise name) or selects a muscle group filter and receives a list of matching exercises from an external source, with all relevant details needed to add one to their training plan.

**Why this priority**: This is the core capability of the feature. Without it, nothing else in this spec is deliverable.

**Independent Test**: Call `GET /exercises/search?name=bench` and verify a list of exercises is returned with the required fields (name, muscle group, type, equipment, instructions).

**Acceptance Scenarios**:

1. **Given** a valid authenticated request with `?name=bench press`, **When** the endpoint is called, **Then** the system returns a list of exercises matching the name with all required fields.
2. **Given** a valid authenticated request with `?muscle=chest`, **When** the endpoint is called, **Then** only exercises targeting that muscle group are returned.
3. **Given** both `?name=curl&muscle=biceps`, **When** the endpoint is called, **Then** results are filtered by both criteria.
4. **Given** the external API returns no results, **When** the endpoint is called, **Then** an empty list is returned with HTTP 200.
5. **Given** no search parameters are provided, **When** the endpoint is called, **Then** the system returns HTTP 400 with a descriptive error.

---

### User Story 2 — Cache Search Results to Avoid Redundant External Calls (Priority: P2)

When the same search query is made more than once within 7 days, the system returns results from a local cache instead of calling the external API again.

**Why this priority**: Reduces latency for repeated searches and protects the API key quota. Required before any real usage.

**Independent Test**: Make the same search twice; verify the second call does not contact the external API (observable via response time or cache metadata field).

**Acceptance Scenarios**:

1. **Given** a search has never been made before, **When** the endpoint is called, **Then** the external API is contacted, results are saved to cache, and returned to the caller.
2. **Given** the same query was cached less than 7 days ago, **When** the endpoint is called again, **Then** cached results are returned without calling the external API.
3. **Given** a cached entry is older than 7 days, **When** the endpoint is called, **Then** the external API is called again and the cache is refreshed.
4. **Given** the external API is unavailable, **When** there is a cached result (even expired), **Then** the cached results are returned with a warning flag in the response.
5. **Given** the external API is unavailable and no cache exists, **When** the endpoint is called, **Then** an empty list is returned with a graceful error message (HTTP 200, not 500).

---

### User Story 3 — Add a Found Exercise Directly to a Training Day (Priority: P3)

After finding an exercise via search, the user selects it and adds it directly to a specific day in their active training sheet, without having to manually re-enter all the exercise details.

**Why this priority**: Completes the end-to-end flow. The search is useful alone (P1/P2), but the add-from-search action is the key productivity win for the user.

**Independent Test**: Call `POST /training-sheet/days/{dayOfWeek}/exercises` with a payload sourced from a search result and verify the exercise appears in the training day.

**Acceptance Scenarios**:

1. **Given** a user has an active training sheet and a valid exercise payload from search results, **When** they add it to a day, **Then** the exercise is saved with name, muscle group, type, equipment, and an initial empty series list.
2. **Given** the user selects a day that is currently set to "rest", **When** they add an exercise, **Then** the system rejects the operation with HTTP 400 unless the day is first toggled to "training" (existing behavior from spec 001).
3. **Given** an exercise name already exists on that day, **When** the user adds the same exercise again, **Then** the system allows it (duplicate names are permitted per existing rules).

---

### Edge Cases

- What happens if `EXERCISES_API_KEY` is not set? → System must fail fast at startup with a descriptive configuration error, not at request time.
- What if the external API changes its response schema? → The mapping layer must validate required fields and silently skip malformed entries, logging the anomaly.
- What if cache storage is unavailable (MongoDB down)? → Fall through to the external API directly; log the cache failure but do not surface it to the caller.
- What if search term contains special characters or SQL/NoSQL injection patterns? → Input must be sanitized before use as a cache key and before forwarding to the external API.
- What if the external API rate-limits the request? → Return cached data if available, otherwise return empty list with graceful message. Do not propagate the upstream HTTP 429 to the client as-is.

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: The system MUST expose a `GET /exercises/search` endpoint, protected by JWT authentication, that accepts `name` (string) and/or `muscle` (string) query parameters.
- **FR-002**: At least one of `name` or `muscle` MUST be provided; the system MUST return HTTP 400 if both are absent.
- **FR-003**: The system MUST return exercise results with the following fields: `name`, `muscleGroup`, `type`, `equipment`, `instructions`.
- **FR-004**: The system MUST cache search results in MongoDB using a composite cache key of `name + muscle` (normalized to lowercase, trimmed), with a TTL of 7 days.
- **FR-005**: On a cache hit (entry exists and is not expired), the system MUST return cached results without contacting the external API.
- **FR-006**: On a cache miss, the system MUST call the API Ninjas Exercises API using the `EXERCISES_API_KEY` environment variable.
- **FR-007**: If the external API is unreachable or returns an error, and a cached result exists (even expired), the system MUST return the cached result with a `cached: true, warning: "external API unavailable"` flag in the response.
- **FR-008**: If the external API is unreachable and no cache exists, the system MUST return HTTP 200 with an empty results list and a `warning` field explaining the issue.
- **FR-009**: The system MUST NOT expose the raw external API error or the API key in any response or log.
- **FR-010**: The `EXERCISES_API_KEY` environment variable MUST be validated at module initialization; missing key must throw a descriptive configuration exception that prevents the app from starting.
- **FR-011**: The add-exercise flow (`POST /training-sheet/days/{dayOfWeek}/exercises`) MUST continue to work as before (spec 001); exercise data sourced from search results MUST conform to the same DTO.
- **FR-012**: The system MUST translate the `muscle` field returned by the external API from English to Portuguese before returning results to the client, using the mapping table defined in the Assumptions section. Values not present in the mapping are passed through as-is. This translation MUST be applied before results are cached, so cached data is always stored in Portuguese.
- **FR-013**: The system MUST translate the `type` field returned by the external API from English to Portuguese before returning results to the client, using the type mapping table defined in the Assumptions section. Values not found in the mapping are passed through as-is. This translation MUST be applied before results are cached, so cached data always contains Portuguese type values.

### Key Entities

- **ExerciseCache**: Represents a cached search result set. Attributes: `cacheKey` (string, unique index), `results` (array of exercise objects), `createdAt` (date), `expiresAt` (date, indexed for TTL queries).
- **ExerciseSearchResult**: Value object returned to the caller. Attributes: `name`, `muscleGroup`, `type`, `equipment`, `instructions`, source metadata (`cached: boolean`, `warning?: string`).

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: Search results are returned in under 300 ms for cache hits (no external API call involved).
- **SC-002**: A repeated identical search within 7 days never triggers a second external API call (0 redundant calls per cache period).
- **SC-003**: The external API is never called when a valid cache entry exists, regardless of external API availability.
- **SC-004**: If the external API is unavailable at startup validation or during a request, the system remains running and returns a graceful response — no unhandled exceptions reach the client.
- **SC-005**: An exercise found via search can be added to a training day in a single additional API call, using the search result payload directly.

## Assumptions

- The API Ninjas Exercises API returns a JSON array of exercise objects; the relevant fields are `name`, `muscle`, `type`, `equipment`, and `instructions`.
- The `muscle` field from API Ninjas maps to `muscleGroup` in the LoadUp domain using the following translation table. The mapping is applied before caching, so all stored and returned results are always in Portuguese:

  | API Ninjas (English) | LoadUp (Portuguese) |
  | -------------------- | ------------------- |
  | chest                | Peito               |
  | biceps               | Bíceps              |
  | triceps              | Tríceps             |
  | back                 | Costas              |
  | shoulders            | Ombros              |
  | abdominals           | Abdômen             |
  | quadriceps           | Perna               |
  | hamstrings           | Perna               |
  | glutes               | Glúteo              |
  | calves               | Perna               |
  | forearms             | Bíceps              |
  | middle_back          | Costas              |
  | lower_back           | Costas              |
  | lats                 | Costas              |
  | neck                 | Ombros              |

  Values not found in the mapping table are passed through as-is.

- The `type` field from API Ninjas maps to the `type` field in the LoadUp domain using the following translation table. The mapping is applied before caching, so all stored and returned results always contain Portuguese type values:

  | API Ninjas (English)  | LoadUp (Portuguese) |
  | --------------------- | ------------------- |
  | strength              | Força               |
  | cardio                | Cardio              |
  | stretching            | Alongamento         |
  | powerlifting          | Powerlifting        |
  | plyometrics           | Pliometria          |
  | olympic_weightlifting | Halterofilia        |
  | strongman             | Strongman           |

  Values not found in the mapping table are passed through as-is.

- Cache invalidation is time-based only (TTL = 7 days); there is no manual cache invalidation endpoint in this spec.
- The existing `POST /training-sheet/days/{dayOfWeek}/exercises` endpoint (spec 001) is not modified — the search-to-add flow reuses it as-is.
- Authentication uses the existing JWT guard — no new auth scope is needed.
- Pagination of search results is not required; the external API returns at most 10 results per call by default, which is sufficient for the MVP.
- Equipment filtering and difficulty filtering are explicitly out of scope.
