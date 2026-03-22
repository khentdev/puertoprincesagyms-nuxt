---
description: Planning feature
---

# Feature Plan Prompt
**Feature:** [Feature Name]

---

## Instructions

Create a detailed implementation plan for the feature described below.

**Output:** `docs/features/{FEATURE_NAME}_PLAN.md`

---

## Plan Structure

```markdown
# {FEATURE_NAME} Implementation Plan

**Feature:** [Name]
**Priority:** [High/Medium/Low]
**Estimated Time:** [Hours/Days]

---

## 1. Overview
[2-3 sentences describing what this feature does and why]

---

## 2. Requirements

**Functional:**
- [ ] Requirement 1
- [ ] Requirement 2
- [ ] Requirement 3

**Non-Functional:**
- [ ] Performance target
- [ ] Security requirements
- [ ] Accessibility needs

---

## 3. Technical Design

**Architecture:**
- Feature location: `src/features/{name}/`
- Dependencies: [List features/libs needed]
- External APIs: [If any]

**Database Changes:**
- [ ] New tables/columns
- [ ] Migrations needed
- [ ] Schema changes

**API Endpoints:**
| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/{resource}` | Create |
| GET | `/api/{resource}` | List |
| GET | `/api/{resource}/:id` | Get one |
| PUT | `/api/{resource}/:id` | Update |
| DELETE | `/api/{resource}/:id` | Delete |

---

## 4. Implementation Checklist

**Backend:**
- [ ] Create feature folder structure
- [ ] Implement service layer
- [ ] Implement controller
- [ ] Add validation schemas
- [ ] Create types/interfaces
- [ ] Add error handling
- [ ] Write unit tests
- [ ] Add integration tests

**Frontend:**
- [ ] Create feature folder structure
- [ ] Create UI components
- [ ] Implement composables/hooks
- [ ] Add API client functions
- [ ] Create types/interfaces
- [ ] Add form validation
- [ ] Write component tests
- [ ] Update router

**Shared:**
- [ ] Update shared types (if needed)
- [ ] Add to documentation
- [ ] Update README

---

## 5. File Structure

**Backend:**
```
src/features/{name}/
  controller.ts
  service.ts
  repository.ts
  schema.ts
  types.ts
  errors.ts
  __tests__/
  index.ts
```

**Frontend:**
```
src/features/{name}/
  components/
    ComponentName.vue
  composables/
    useName.ts
  views/
    NameView.vue
  types.ts
  routes.ts
  service.ts
  index.ts
```

---

## 6. Acceptance Criteria

- [ ] User can [action]
- [ ] System validates [input]
- [ ] Error messages are clear
- [ ] UI is responsive
- [ ] All tests pass
- [ ] No console errors
- [ ] Performance acceptable (<2s load)

---

## 7. Testing Plan

**Unit Tests:**
- Service logic
- Validation schemas
- Utility functions

**Integration Tests:**
- API endpoints
- Database operations
- Authentication flow

**E2E Tests:**
- User workflow
- Edge cases
- Error scenarios

---

## 8. Data Flow

```
User Action
  → Frontend Component
    → Composable/Hook
      → API Client
        → Backend Route
          → Controller
            → Service
              → Repository
                → Database

Database
  → Repository
    → Service
      → Controller
        → API Response
          → Frontend State
            → UI Update
```

---

## 9. Dependencies

**Install:**
- Backend: [List npm packages]
- Frontend: [List npm packages]

**Configure:**
- Environment variables needed
- Config files to update

---

## 10. Risks & Mitigation

| Risk | Impact | Mitigation |
|------|--------|------------|
| [Risk 1] | High | [How to handle] |
| [Risk 2] | Medium | [How to handle] |

---

## 11. Rollout Plan

1. **Phase 1:** Backend implementation + tests
2. **Phase 2:** Frontend implementation + tests
3. **Phase 3:** Integration testing
4. **Phase 4:** Code review
5. **Phase 5:** Deploy to staging
6. **Phase 6:** QA testing
7. **Phase 7:** Production deploy

---

## Notes

[Any additional context, decisions, or considerations]
```

---

## Usage

1. Fill in feature description
2. Run this prompt
3. Get detailed plan in `docs/features/{FEATURE_NAME}_PLAN.md`
4. Review and adjust plan
5. Use plan for implementation
6. Use plan for code review reference