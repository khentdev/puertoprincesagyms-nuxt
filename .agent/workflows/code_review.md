---
description: 
---

# Code Review Workflow
**Review Mode:** Post-implementation, correctness-first. 

---

## Review Checklist

### 1. Plan Compliance
- [ ] All requirements implemented
- [ ] Acceptance criteria met
- [ ] No missing features

### 2. Bugs & Logic
- [ ] No obvious bugs or errors
- [ ] Edge cases handled
- [ ] Proper error handling
- [ ] Security issues checked (auth, injection, XSS)

### 3. Data Alignment
- [ ] **Naming:** No snake_case/camelCase mismatches
- [ ] **Structure:** No unexpected nesting (`{data: {}}` vs flat)
- [ ] **Types:** String/number/boolean types match expectations
- [ ] **API contracts:** Request/response shapes align
- [ ] **DB schema:** ORM models match actual columns

### 4. Code Quality
- [ ] No files > 300 lines
- [ ] No over-engineering or unnecessary abstractions
- [ ] No duplicate logic (extract to shared utils)
- [ ] Proper separation of concerns

### 5. Consistency
- [ ] Code style matches existing codebase
- [ ] Naming conventions consistent
- [ ] Import organization standard
- [ ] No weird syntax or patterns

### 6. Architecture
- [ ] Feature-based structure followed
- [ ] No circular dependencies
- [ ] Barrel files used correctly
- [ ] No direct cross-feature imports

### 7. Testing & Performance
- [ ] Critical paths have tests
- [ ] No N+1 queries
- [ ] No memory leaks (unclosed connections)
- [ ] Performance optimized (caching, pagination)

---

## Output

**Document in:** `docs/features/{FEATURE_NAME}_REVIEW.md`

**Template:**

```markdown
# {FEATURE_NAME} Review

**Date:** [Date]
**Status:** ✅ Ready / ⚠️ Needs Fixes / 🔴 Critical Issues

---

## Summary
[2-3 sentence overview]

---

## 🔴 Critical (Must Fix)
1. **[Issue]** - `path/file.ts:line`
   - Problem: [What's wrong]
   - Fix: [How to fix]

## 🟡 Warnings (Should Fix)
1. **[Issue]** - `path/file.ts:line`
   - Problem: [What's wrong]
   - Fix: [How to fix]

## 🟢 Suggestions (Nice to Have)
1. **[Improvement]** - `path/file.ts:line`
   - Suggestion: [What to improve]

---

## Data Alignment
- ✅ All naming consistent
- ❌ Issue: [Specific mismatch found]

---

## Recommendations
**Priority 1:** [Fix this first]
**Priority 2:** [Then this]
**Priority 3:** [Then this]

**Estimated Fix Time:** [Hours/Days]
```

---

## Common Data Issues

**Watch for:**

```typescript
// ❌ Naming mismatch
Backend: { user_id: "123" }
Frontend: interface { userId: string }

// ❌ Unexpected nesting
API: { data: { users: [] } }
Code: response.users // undefined

// ❌ Type mismatch
API: { id: "123" }
Code: interface { id: number }

// ❌ Array vs Object
API: { users: [{ id: 1 }] }
Code: const user = response.users // Gets array
```

---

## Severity Guide

| Tag | Meaning | Action |
|-----|---------|--------|
| 🔴 | Critical - Breaks functionality, security risk | Must fix before deploy |
| 🟡 | Warning - Technical debt, minor bugs | Fix soon |
| 🟢 | Suggestion - Optimization, style | Nice to have |