---
description: Enforces UI/UX best practices, component design standards, accessibility, and performance guidelines for building clean, consistent, and user-friendly interfaces.
---

─── UI/UX & Design System ────────────────────────────────────────────
- Mobile-first always. Use Tailwind's responsive prefixes (sm:, md:, lg:).
- Use relative units (rem, em, %) — never fixed px for layout or typography.
- Maintain WCAG 2.1 AA contrast ratios. Legibility is non-negotiable.
- All interactive elements minimum 44x44px touch target.
- Use semantic HTML — proper heading hierarchy, landmarks, aria where needed.
- Every async operation must have a loading state, error state, and empty state.
- Never leave the user without feedback — use skeletons over spinners where possible.

─── Component Design ─────────────────────────────────────────────────
- Follow a consistent design system — spacing, color, and type scales via Tailwind config.
- Components must handle all states: default, hover, focus, disabled, loading, error.
- Use progressive disclosure — don't show everything at once, reveal on demand.
- Forms must have inline validation, clear error messages, and accessible labels.

─── Performance (Frontend) ───────────────────────────────────────────
- Lazy load images using <NuxtImage> with built-in optimization.
- Use lazy: true in useFetch/useAsyncData for below-the-fold data.
- Avoid layout shift (CLS) — always reserve space for dynamic content.
- Prefer CSS transitions over JS animations for performance.

─── Navigation & Information Architecture ────────────────────────────
- Keep navigation predictable and consistent across pages.
- Use sticky headers for long-scroll pages.
- Always provide a clear visual indicator for the active route.