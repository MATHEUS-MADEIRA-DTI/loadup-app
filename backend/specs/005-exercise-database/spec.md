# Feature Specification: Exercise Database

**Feature Branch**: `005-exercise-database`  
**Created**: 2026-05-13  
**Status**: Draft

## User Scenarios & Testing _(mandatory)_

### User Story 1 — Search Exercises from Local Database (Priority: P1)

When a user searches for exercises by name or muscle group, the system searches a local JSON database instead of calling an external API. Results are returned instantly without network latency or external dependencies. Exercise data is already in Portuguese (pt-BR) and includes video URLs for learning exercise execution.

**Why this priority**: Eliminates dependency on external API (API Ninjas), reduces latency, ensures consistent data quality, and improves user experience with faster search results.

**Independent Test**: Call `GET /exercises/search?name=supino&muscle=Peito` and verify that results are returned from local database with Portuguese names and video URLs included.

**Acceptance Scenarios**:

1. **Given** a user calls the exercises search endpoint with `name` parameter, **When** the local exercises database is queried, **Then** exercises matching the query (case-insensitive partial match) are returned in the same response format as before.
2. **Given** a user calls the exercises search endpoint with `muscle` filter, **When** the query is performed, **Then** only exercises matching the specified muscle group are returned.
3. **Given** both `name` and `muscle` parameters are provided, **When** the search is performed, **Then** exercises matching BOTH filters are returned (AND logic).
4. **Given** no exercises match the query, **When** the search is performed, **Then** an empty results array is returned (no error).

### User Story 2 — Add Video Execution URLs and Tips to Exercises (Priority: P2)

When viewing an exercise, users can see a YouTube video URL showing proper execution technique, and optional tips (text or video) for performing the exercise correctly.

**Why this priority**: Improves exercise quality and user learning by providing visual guidance for proper form.

**Independent Test**: Retrieve exercise data and verify that `videoUrl` field contains a YouTube URL and `tip` field is either text or a video URL.

**Acceptance Scenarios**:

1. **Given** an exercise is returned from the database, **When** the response is parsed, **Then** the `videoUrl` field contains a valid YouTube URL for exercise execution.
2. **Given** a frontend receives exercise data with a `tip` field, **When** the tip starts with "https://", **Then** the frontend renders it as a video link (clickable).
3. **Given** a frontend receives exercise data with a `tip` field, **When** the tip does not start with "https://", **Then** the frontend renders it as plain text.

### User Story 3 — Bulk Import Exercises via CSV (Priority: P2)

When adding multiple exercises to a training day, users can download a CSV template, fill it with exercise data, and upload it to add all exercises at once instead of adding them one-by-one.

**Why this priority**: Improves bulk data entry workflow for power users and coaches.

**Independent Test**: Download CSV template, fill with exercise data, upload to `/training-sheet/days/{dayOfWeek}/exercises/import`, and verify exercises are added to the training day.

**Acceptance Scenarios**:

1. **Given** a user requests the CSV template via `GET /exercises/csv-template`, **When** the request is successful, **Then** a CSV file (semicolon-separated) with headers and 2 example rows is returned.
2. **Given** a user uploads a filled CSV to `/training-sheet/days/{dayOfWeek}/exercises/import`, **When** the format is valid, **Then** all exercises in the CSV are added to the specified training day.
3. **Given** a CSV with invalid rows (missing required fields), **When** the upload is performed, **Then** validation errors are returned listing the specific row numbers and field issues.
4. **Given** video_url and dica (tip) fields in CSV are optional, **When** they are left blank, **Then** the exercise is still added with only required fields.
5. **Given** an exercise is imported via CSV, **When** it is added to the training day, **Then** it has an empty series array and the user configures series manually (same workflow as search).

---

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: The system MUST maintain a static JSON file (`src/assets/exercises.json`) containing all LoadUp exercises organized by muscle group. Each exercise object MUST include: `name` (string, PT-BR), `muscleGroup` (MuscleGroup enum), `videoUrl` (string, YouTube URL), and optional `tip` (string, text or YouTube URL).

- **FR-002**: The MuscleGroup enum MUST be updated to include 11 groups: Peito, Tríceps, Costas, Bíceps, Ombros, Abdômen, Perna, Glúteo, **Trapézio, Antebraço, Panturrilha** (3 new groups added).

- **FR-003**: Exercise search endpoint `GET /exercises/search?name={query}&muscle={muscle}` MUST search the local JSON database instead of external API. Searches MUST be case-insensitive partial name match (substring search). The `muscle` parameter is optional and filters by `muscleGroup`. Both parameters use AND logic if both provided.

- **FR-004**: Search response format MUST match the existing format from spec 003 (same DTO structure), ensuring frontend compatibility.

- **FR-005**: No external API calls MUST be made from the exercises search endpoint. All data MUST come from the local JSON database.

- **FR-006**: The Exercise entity (spec 001) MUST be updated with two optional fields: `videoUrl?: string` (YouTube execution URL) and `tip?: string` (text tip OR YouTube URL).

- **FR-007**: CSV template endpoint `GET /exercises/csv-template` MUST return a semicolon-separated CSV file with headers: `nome;grupo_muscular;video_url;dica` and 2 example rows. The file MUST include comments explaining required vs. optional fields. Series (tipo_serie, repeticoes) are NOT included in CSV import; user configures series manually after importing exercise metadata (same workflow as search).

- **FR-008**: CSV import endpoint `POST /training-sheet/days/:dayOfWeek/exercises/import` MUST accept a CSV file upload, validate format, parse the data, and add exercises to the specified training day.

- **FR-009**: CSV validation MUST check: (1) required fields present (`nome`, `grupo_muscular`), (2) `grupo_muscular` is a valid MuscleGroup enum value, (3) optional field `video_url` if provided must be valid URL format. Optional fields (`video_url`, `dica`) are not required. Series (tipo_serie, repeticoes) are NOT validated or imported; user configures them manually.

- **FR-010**: CSV import validation errors MUST list specific row numbers and field issues (e.g., "Row 3: grupo_muscular 'Peitão' is not valid").

- **FR-011**: CSV import response MUST return the updated training day object on success.

- **FR-012**: The Exercise entity MUST include a `database` flag (boolean, default `true`) to distinguish local database exercises from user-submitted exercises (future spec).

### Key Entities

- **Exercise** (updated):
  - `id`: string
  - `name`: string (PT-BR)
  - `muscleGroup`: MuscleGroup enum (updated with 3 new groups)
  - `videoUrl`: string (YouTube URL)
  - `tip?`: string (optional, text or video URL)
  - `database`: boolean (default true, marks local database exercises)

- **ExerciseSearchRequest**:
  - `name?`: string (optional, partial match)
  - `muscle?`: string (optional, filter by MuscleGroup)

- **TrainingDay** (updated):
  - Existing fields unchanged
  - `exercises`: Exercise[] (can now include exercises from local database)

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: Exercise search returns results in < 100ms (local JSON search, no network calls).
- **SC-002**: All exercises in the database are in Brazilian Portuguese (pt-BR).
- **SC-003**: CSV import successfully adds 10+ exercises to a training day in < 500ms.
- **SC-004**: CSV template is downloadable in standard UTF-8 semicolon-separated format.
- **SC-005**: Exercise search returns consistent results regardless of case (`"Supino"`, `"SUPINO"`, `"supino"` all match).
- **SC-006**: All 11 muscle groups are available in the MuscleGroup enum.
- **SC-007**: No HTTP requests to external exercise APIs are made during search.

## Assumptions

- The local exercises database (`src/assets/exercises.json`) is maintained manually or via a separate admin tool (not in scope for this feature).
- Initial database contains at least 50 exercises across all muscle groups.
- YouTube URLs for video content are provided by the database maintainer and verified to be valid.
- The CSV import feature is used by authenticated users only (authentication enforced at endpoint level).
- Semicolon (`;`) is chosen as CSV delimiter to avoid conflicts with exercise names that may contain commas.
- Frontend is responsible for detecting tip format (if starts with "https://", render as video link; otherwise render as text).

## Out of Scope

- User-submitted exercises to the database (future feature).
- Exercise difficulty levels or progression systems.
- Equipment-based filtering for search (muscle group filtering only).
- Exercise modification history or versioning.
- Batch upload of exercises to the database (database is static, manually maintained).
- Translation of exercise data (already in PT-BR in database).
- Multiple language support for exercise names/instructions.

## Integration with Spec 001

The Exercise entity defined in spec 001 is extended with two optional fields:

- `videoUrl?: string` — YouTube URL for exercise execution
- `tip?: string` — Optional tip text or video URL

These fields are populated from the local exercises.json database and propagated through the training sheet workflow.

## Integration with Spec 003

This feature **replaces** the external API dependency from spec 003. The exercises search now queries a local JSON database instead of API Ninjas. The response format remains identical, ensuring frontend compatibility.

```
flowchart LR
    A["GET /exercises/search"] -->|Local JSON| B["Exercises Service"]
    B --> C["Filter & Transform"]
    C --> D["Return to Caller"]
```
