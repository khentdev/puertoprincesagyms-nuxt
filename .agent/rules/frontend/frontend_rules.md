---
trigger: always_on
description: Vue 3 + TypeScript stack: Composition API, Pinia, Vue Router, VueUse, Headless UI,  Tailwind CSS. Enforces clean code, proper typing, performance optimization, and  production-ready patterns.
---

You have extensive expertise in Vue 3, Nuxt 4, TypeScript, Node.js, Vite, Nuxt Router,
Pinia, VueUse, TanStack Vue Query, and Tailwind CSS.

─── Code Style ───────────────────────────────────────────────────────
- Write clean, maintainable TypeScript. Prefer interfaces over types.
- Use Composition API <script setup> exclusively. No Options API.
- Follow DRY principles via composables and modular components.
- Avoid classes; favor functional and declarative patterns.
- Avoid enums; use const maps with `as const` for type safety.
- Favor named exports for composables and utilities.

─── Nuxt 4 Specifics ─────────────────────────────────────────────────
- Rely on Nuxt's auto-imports (ref, useState, useRouter, etc. need no manual import).
- Use useRuntimeConfig() for environment-specific variables.
- Use useHead() and useSeoMeta() for SEO.
- Use <NuxtImage> / <NuxtPicture> for images; Nuxt Icons for icons.
- Use app.config.ts for theme/app-level configuration.
- IMPORTANT: This project uses a separate Hono + Prisma + PostgreSQL backend.
  Do NOT suggest server/api/ routes. All API calls go to the external backend.

─── Data Fetching ────────────────────────────────────────────────────
- PRIMARY: Use TanStack Vue Query (useQuery, useMutation) for all server state.
  This handles caching, background refetching, and optimistic updates.
- Use a dedicated `api/` folder for $fetch wrapper functions (not raw in components).
- Use useFetch or useAsyncData only for SSR-critical data that benefits from
  Nuxt's hydration (e.g., SEO-important page data).
- Use $fetch directly only inside event handlers or one-off mutations not
  covered by useMutation.
- Set `server: false` for client-only fetches; `lazy: true` for non-critical data.

─── State Management ─────────────────────────────────────────────────
- TanStack Vue Query → server/remote state (API data, caching, sync)
- Pinia → client/UI state (auth tokens, modals, theme, user preferences)
- useState (Nuxt) → SSR-safe shared state when Pinia is overkill

─── File & Folder Structure ──────────────────────────────────────────
- Feature-based structure under the Nuxt 4 `app/` directory:
  app/
  ├── components/
  │   ├── auth/         → AuthLoginForm.vue, AuthRegisterCard.vue
  │   ├── dashboard/    → DashboardSidebar.vue, DashboardStats.vue
  │   └── shared/       → SharedButton.vue, SharedModal.vue
  ├── pages/
  │   ├── auth/         → login.vue, register.vue
  │   └── dashboard/    → index.vue, settings.vue
  ├── composables/      → useAuth.ts, useGyms.ts
  ├── stores/           → auth.store.ts, ui.store.ts
  ├── api/              → auth.api.ts, gyms.api.ts ($fetch wrappers)
  └── types/            → auth.types.ts, gym.types.ts
- PascalCase for component files; kebab-case for pages (Nuxt convention).
- Name composables as use<Feature><Action> (e.g., useAuthSession, useGymList).

─── Styling ──────────────────────────────────────────────────────────
- Tailwind CSS only. Mobile-first, responsive.
- No inline styles. Use Tailwind utilities; extract to components if repeated.