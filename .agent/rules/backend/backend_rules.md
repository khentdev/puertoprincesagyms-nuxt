---
trigger: always_on
---

**Backend Engineering Rules Template**
**Version:** 1.0 | **Enforcement:** STRICT – All patterns are mandatory

> **📝 CUSTOMIZATION:** Search for `TODO:` to replace with project values.

---

## Tech Stack
- **Runtime:** Node.js 20+
- **Framework:** Hono
- **Language:** TypeScript (strict mode)
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Auth:** JWT (HTTP-only)
- **Testing:** Vitest
- **Logging:** Pino

---

## 1. Feature Module Architecture
### RULE: Feature-Based Directory Structure (MANDATORY)
Every feature MUST follow this structure:
```
Backend/src/features/<feature>/
  ├── route.ts         # HTTP routes
  ├── controller.ts    # Request/response mapping
  ├── service.ts       # Business logic
  ├── data.ts          # Database queries (REQUIRED)
  ├── middleware.ts    # Validation, auth
  ├── types.ts         # TS types
  ├── errors.ts        # Error definitions
  └── __tests__/       # Integration tests
```
**Enforcement:**
- ✅ All features have `data.ts` layer.
- ❌ NO database queries directly in `service.ts`.

**Example:**
```ts
// features/users/data.ts
export const findUserByEmail = async (email: string) => prisma.user.findUnique({ where: { email } })

// features/users/service.ts
import { findUserByEmail } from "./data.js"
export const createUserService = async ({ email }) => {
  if (await findUserByEmail(email)) throw new AppError("USER_EXISTS")
  // ...
}
```

---

## 2. Layer Separation
### RULE: Controller → Service → Data Flow (MANDATORY)
**Controllers (HTTP Only):** Extract params, call service, format response. NO business logic/DB.
**Services (Business Logic):** Orchestrate logic, handle errors. NO HTTP/DB imports.
**Data Layer (DB Only):** Pure DB queries. NO business logic.

```ts
// ✅ CORRECT
export const createItemController = async (c: Context) => {
  const params = c.get("validParams")
  const item = await createItemService(params)
  return c.json({ message: "Success", item }, 201)
}

export const createItemService = async (params) => {
  try { return await createItem(params) }
  catch (err) {
    logger.error({ err }, "Create failed")
    throw new AppError("CREATE_FAILED")
  }
}

export const createItem = async (data) => prisma.item.create({ data })
```

---

## 3. Error Handling
### RULE: AppError for All Business Errors (MANDATORY)
Use `AppError` with structured codes defined in `errors.ts`.
```ts
throw new AppError("USER_NOT_FOUND", { field: "userId" })
```

**Logging:** Log with context BEFORE throwing.
```ts
catch (err) {
  logger.error({ err, context: "op_name" }, "Failed")
  throw new AppError("OP_FAILED", { cause: err })
}
```

---

## 4. Validation
### RULE: Middleware-Based Validation (MANDATORY)
**All user input MUST be validated in middleware before reaching controllers.**
```ts
export const validateCreate = async (c: Context, next: Next) => {
  const body = await c.req.json()
  if (!isValid(body.name)) throw new AppError("INVALID_NAME")
  
  // Sanitize and store
  c.set("validParams", { name: body.name.trim() })
  await next()
}
```

---

## 5. Rate Limiting
### RULE: Multi-Layer Rate Limiting (MANDATORY)
**Every mutation endpoint MUST have rate limiting.**
```ts
// Layer 1: IP-based
await enforceRateLimit(c, { identifier: ip, max: 30, window: "1m" })
// Layer 2: User-based
await enforceRateLimit(c, { identifier: user.id, max: 10, window: "1h" })
```

---

## 6. Authentication
### RULE: Middleware-Based Auth (MANDATORY)
Protect routes with middleware.
```ts
itemRoutes.use(verifyToken).post("/create", createController)
```
**Access User:** `const { user } = c.get("verifyTokenVariables")`

### 🔴 SECURITY: NO Auto-Login After Password Reset
Password reset MUST NOT log users in. Require manual login after reset to verify access.

---

## 7. Database Patterns
### RULE: Transaction Usage (MANDATORY)
Use transactions for atomic multi-step operations.
```ts
const result = await prisma.$transaction(async (tx) => {
  const order = await tx.order.create({ ... })
  await tx.item.createMany({ ... })
  return order
})
```
**Data Layer:** All functions must accept optional `tx` client.

### RULE: Cursor-Based Pagination (MANDATORY)
**NEVER use offset (skip/take). ALWAYS use cursors.**
```ts
// ✅ CORRECT
const items = await prisma.item.findMany({
  cursor: cursor ? { id: cursor } : undefined,
  skip: cursor ? 1 : 0,
  take: limit + 1
})
```

### RULE: Selective Queries (MANDATORY)
**Always use `select` to fetch only needed fields.**
```ts
const user = await prisma.user.findUnique({
  where: { id },
  select: { id: true, name: true } // No passwords/metadata
})
```

---

## 8. API Responses
### RULE: Consistent Format (MANDATORY)
**Success:** `return c.json({ message: "Success", data: item }, 200)`
**Error:** Handled globally via AppError.
**Codes:** 200 (OK), 201 (Created), 400 (Bad Req), 401 (Unauth), 403 (Forbidden), 404 (Not Found), 429 (Rate Limit), 500 (Server Error).

---

## 9. Testing
### RULE: Integration Tests for All Features (MANDATORY)
Structure: `features/<feature>/__tests__/<op>.integration.test.ts`
**Coverage:** Happy path, validation errors, rate limits, auth failures, DB state.

---

## 10. TypeScript
### RULE: Strict Type Safety (MANDATORY)
- **No `any`**.
- **Typed Context:** `Context<{ Variables: MyVars }>`
- **Strict Params:** No `unknown` in internal logic.

---

## 11. Constants
### RULE: No Magic Numbers (MANDATORY)
Extract constants to `env.ts` or config.
```ts
// ❌ const limit = 20
// ✅ const limit = env.DEFAULT_LIMIT
```

---

## 12. Logging
### RULE: Structured Logging (MANDATORY)
Use structured loggers (Pino) with context.
```ts
logger.info({ userId, action: "create" }, "Success")
```

---

## Summary Checklist
- [ ] Feature structure (route/controller/service/data)
- [ ] Data layer exists & pure
- [ ] Controllers = HTTP only
- [ ] Services = Business logic
- [ ] AppError used
- [ ] Input validated in middleware
- [ ] Rate limiting on mutations
- [ ] Auth middleware used
- [ ] No auto-login after reset
- [ ] Transactions for multi-step
- [ ] Cursor pagination
- [ ] Selective queries
- [ ] Integration tests
- [ ] Strict TS (no any)
- [ ] No magic numbers
- [ ] Structured logging