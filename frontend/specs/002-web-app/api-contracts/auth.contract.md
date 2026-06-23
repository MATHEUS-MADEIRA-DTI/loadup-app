# API Contract: Authentication Module

**Module**: `auth`  
**Responsibility**: User registration, login, and JWT token management

---

## Endpoint: POST /auth/register

Register a new user account.

**Request**:

```typescript
{
  email: string; // RFC 5322 format, must be unique
  password: string; // Minimum 8 characters
}
```

**Response (201 Created)**:

```typescript
{
  id: string; // User ID (ObjectId as string)
  email: string;
  token: string; // JWT access token (24h expiration)
  createdAt: string; // ISO 8601 date in America/Sao_Paulo
}
```

**Errors**:

- `400 Bad Request`: Invalid email format, password too short, missing fields
- `409 Conflict`: Email already registered

---

## Endpoint: POST /auth/login

Authenticate user and return JWT token.

**Request**:

```typescript
{
  email: string;
  password: string;
}
```

**Response (200 OK)**:

```typescript
{
  id: string;
  email: string;
  token: string; // JWT access token (24h expiration)
  expiresIn: number; // Seconds (86400 for 24 hours)
}
```

**Errors**:

- `400 Bad Request`: Missing fields
- `401 Unauthorized`: Email not found or password incorrect

---

## Token Format

**JWT Payload**:

```typescript
{
  sub: string; // Subject (userId)
  email: string;
  iat: number; // Issued at
  exp: number; // Expiration (iat + 86400)
}
```

**Usage**: Include in Authorization header: `Authorization: Bearer {token}`

---

## Security

- Passwords are never returned in responses
- Password hashing: bcrypt with salt rounds ≥ 10
- JWT signing: HS256 with server secret key
- Tokens are stateless (no database storage for validation)
