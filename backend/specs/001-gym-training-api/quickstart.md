# Quick Start Guide: LoadUp Development

**Created**: May 8, 2026  
**Purpose**: Get developers up and running with LoadUp backend development

---

## Prerequisites

- **Node.js**: LTS version (18.x or higher recommended)
- **npm**: Latest stable version
- **MongoDB**: Local instance or connection string to remote MongoDB
- **Git**: Version control

---

## Project Setup

### 1. Clone and Install Dependencies

```bash
git clone <repository-url>
cd backend
npm install
```

### 2. Environment Configuration

Create `.env` file in the project root:

```bash
# Database
MONGODB_URI=mongodb://localhost:27017/loadup
# or for remote: mongodb+srv://user:pass@cluster.mongodb.net/loadup?retryWrites=true&w=majority

# JWT Authentication
JWT_SECRET=your-secure-random-secret-key-here
JWT_EXPIRATION=86400  # 24 hours in seconds

# Application
NODE_ENV=development
PORT=3000
LOG_LEVEL=debug

# Timezone (fixed to Brazilian timezone)
TZ=America/Sao_Paulo
```

### 3. TypeScript Configuration

Ensure `tsconfig.json` has `strict: true`:

```json
{
  "compilerOptions": {
    "strict": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "noImplicitAny": true
    // ... other options
  }
}
```

### 4. Initialize Database

```bash
# MongoDB must be running
# If using local MongoDB:
mongod --dbpath ./data

# Create initial collections (optional - Mongoose will auto-create):
# This is handled by Mongoose schemas on first write
```

---

## Running the Application

### Development Mode

```bash
npm run start:dev
```

This starts the NestJS development server with hot-reload. Server runs on `http://localhost:3000`.

### Production Build

```bash
npm run build
npm run start:prod
```

---

## Project Structure at a Glance

```
src/
├── main.ts                    # App entry point
├── app.module.ts              # Root module
├── common/                    # Shared infrastructure (guards, filters, utils)
├── auth/                      # Authentication module
├── users/                     # User management
├── training-sheet/            # Training sheet CRUD
├── exercises/                 # Exercise management
├── training-session/          # Session recording
├── calendar/                  # Calendar views
└── progression/               # Progression tracking
```

Each module follows NestJS convention:

- `*.module.ts` - Module definition
- `*.service.ts` - Business logic
- `*.controller.ts` - HTTP endpoints
- `dto/` - Request/response data structures
- `schemas/` - Mongoose schemas

---

## Development Workflow

### 1. Creating a New Endpoint

1. Add a method to the **controller**:

   ```typescript
   @Post('resource')
   create(@Body() dto: CreateResourceDto) {
     return this.service.create(dto);
   }
   ```

2. Implement the logic in the **service**:

   ```typescript
   create(dto: CreateResourceDto) {
     // Business logic here
     return this.repository.create(dto);
   }
   ```

3. Create DTOs in `dto/` folder for validation:

   ```typescript
   export class CreateResourceDto {
     @IsString()
     @IsNotEmpty()
     name: string;
   }
   ```

4. Define Mongoose schema in `schemas/` if needed:
   ```typescript
   @Schema()
   export class Resource {
     @Prop({ required: true })
     name: string;
   }
   ```

### 2. Using Dependency Injection

All services are injected via NestJS DI:

```typescript
export class ExercisesService {
  constructor(
    @InjectModel(Exercise.name)
    private exerciseModel: Model<Exercise>,
  ) {}
}
```

### 3. Accessing Current User

Use the `@CurrentUser()` decorator (defined in `common/decorators/`):

```typescript
@Get('my-sheet')
getMySheet(@CurrentUser() userId: string) {
  return this.trainingSheetService.getByUserId(userId);
}
```

Protected endpoints automatically use JWT guard; unauthenticated requests return 401.

### 4. Error Handling

Use NestJS `HttpException` for consistent error responses:

```typescript
throw new HttpException(
  { message: "Training sheet not found" },
  HttpStatus.NOT_FOUND,
);
```

Exception filter in `common/filters/` automatically catches and formats errors.

---

## Code Quality Standards (Constitution Compliance)

### TypeScript

- ✅ Use `strict: true` mode (enforced by tsconfig)
- ✅ No implicit `any` types
- ✅ Export types explicitly

### Code Style

- **Linting**: `npm run lint` (runs ESLint)
- **Formatting**: `npm run format` (runs Prettier)
- Both are configured in `.eslintrc.json` and `.prettierrc`

```bash
npm run lint           # Check for linting issues
npm run lint:fix       # Auto-fix linting issues
npm run format         # Format code with Prettier
```

### Naming Conventions

- **Classes**: PascalCase (`UserService`, `TrainingSessionController`)
- **Functions/Variables**: camelCase (`getUserById`, `trainingSheetData`)
- **Constants**: UPPER_SNAKE_CASE (`MAX_SERIES_PER_EXERCISE = 10`)
- **Files**: kebab-case or match exported class name (`user.service.ts`, `training-sheet.controller.ts`)

### Function Design

- Keep functions short (~20 lines ideally)
- One responsibility per function
- Clear, descriptive names that explain intent
- Add JSDoc comments for public methods

---

## API Endpoints Summary

**Authentication**:

- `POST /auth/register` - Create account
- `POST /auth/login` - Get JWT token

**Training Sheet**:

- `POST /training-sheet` - Create sheet
- `GET /training-sheet` - Retrieve full sheet
- `PATCH /training-sheet/days/:day` - Update day status

**Exercises**:

- `POST /training-sheet/days/:day/exercises` - Add exercise
- `GET /training-sheet/days/:day/exercises` - List exercises
- `PATCH /training-sheet/days/:day/exercises/:id` - Update exercise
- `DELETE /training-sheet/days/:day/exercises/:id` - Delete exercise

**Training Sessions**:

- `POST /training-sessions` - Create session
- `POST /training-sessions/:id/records` - Record set metrics
- `PATCH /training-sessions/:id/complete` - Mark session done
- `GET /training-sessions/:id` - Get session details

**Calendar**:

- `GET /calendar/today` - Today's workout
- `GET /calendar` - Monthly view
- `GET /calendar/:date` - Specific day
- `PATCH /calendar/:date/mark` - Mark day completed/skipped

**Progression**:

- `GET /progression/exercise/:name` - Exercise progression
- `GET /progression/summary` - Overall stats
- `GET /progression/chart/:name` - Data for charts

See `/specs/001-gym-training-api/contracts/` for detailed request/response formats.

---

## Testing (Out of Scope)

Per project Constitution: **No tests** (unit, integration, or e2e) are included in this project. Manual testing or external test suites can be added by other developers if needed.

---

## Useful Commands

```bash
npm run start:dev       # Start dev server with hot-reload
npm run build           # Build TypeScript to JavaScript
npm start               # Start production server
npm run lint            # Check code style
npm run lint:fix        # Auto-fix code style
npm run format          # Format code with Prettier
```

---

## Common Issues & Solutions

### Issue: MongoDB Connection Error

**Solution**:

- Verify MongoDB is running: `mongod --version`
- Check MONGODB_URI in `.env` is correct
- Ensure MongoDB service is started: `mongod` or `mongod --dbpath ./data`

### Issue: PORT 3000 Already in Use

**Solution**:

- Change PORT in `.env` to a different port
- Or kill the process using port 3000: `lsof -ti :3000 | xargs kill -9`

### Issue: JWT Token Expires Too Quickly

**Solution**:

- Adjust JWT_EXPIRATION in `.env` (value in seconds)
- Current default: 86400 (24 hours)

### Issue: Timezone Not Applied

**Solution**:

- Ensure `TZ=America/Sao_Paulo` in `.env`
- Restart dev server for env changes to take effect
- Check that interceptor is converting dates (see `src/common/middleware/timezone.middleware.ts`)

---

## Next Steps

1. **Create training sheet**: Register and login, then create your first training sheet
2. **Add exercises**: Define your training plan with exercises and series
3. **Record sessions**: Start logging workouts and track your progression
4. **Check calendar**: View your training schedule and session history

---

## References

- **NestJS Documentation**: https://docs.nestjs.com
- **Mongoose Documentation**: https://mongoosejs.com
- **JWT Best Practices**: https://tools.ietf.org/html/rfc7519
- **date-fns-tz**: https://github.com/marnusw/date-fns-tz
- **LoadUp Spec**: [spec.md](spec.md)
- **Data Model**: [data-model.md](data-model.md)
- **API Contracts**: [contracts/](contracts/)
