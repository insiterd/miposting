# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

This is **miposting**, a rebrand of [Postiz](https://postiz.com) — a tool to schedule social media and chat posts to 28+ channels (calendar-based scheduling, analytics, team collaboration, media library). The root `package.json` still calls it `"gitroom"` (Postiz's original project name) — that's expected, not a bug.

The system is **in production with real users**. Any change must not break existing users; add a migration when the data model changes.

## Commands

All commands run from the repo root unless noted. Package manager is **pnpm only** — never use npm or yarn (`node-linker=hoisted` in `.npmrc` hoists all deps to the root `node_modules`).

```bash
# First-time setup (creates .env, starts Docker infra, installs deps, pushes DB schema, starts everything)
make dev-all

# Day-to-day dev servers
make dev              # backend (3000) + frontend (4200)
make dev-backend      # backend only
make dev-frontend     # frontend only
make dev-orchestrator # Temporal orchestrator only
make dev-landing      # landing page only (8030, static export)
pnpm dev              # extension + orchestrator + backend + frontend together (no landing)

# Infra
make infra            # docker compose -f docker-compose.dev.yaml up -d (Postgres, Redis, Temporal)
make clean            # docker compose down

# Build
pnpm build                # frontend + backend + orchestrator
pnpm build:backend        # single app (also: build:frontend, build:orchestrator, build:extension)

# Lint & test — must run from the repo root, not from an app subfolder
pnpm lint
pnpm test                 # jest --coverage

# Prisma (schema at libraries/nestjs-libraries/src/database/prisma/schema.prisma, pinned to 6.5.0)
pnpm prisma-generate       # runs automatically on postinstall
pnpm prisma-db-push        # push schema to DB (--accept-data-loss)
pnpm prisma-db-pull        # introspect DB into schema
pnpm prisma-reset          # force-reset DB
```

There are currently no `*.spec.ts` test files in `apps/` or `libraries/`, so `pnpm test` has nothing to collect yet — don't assume test infra is exercised until you add a spec.

## Architecture

Pnpm-workspace monorepo (`apps/*`, `libraries/*`, `landing`), Node `>=22.12.0 <23.0.0`.

- **`apps/backend`** — NestJS API, entry `apps/backend/src/main.ts`. Split into `api/routes` (authenticated) and `public-api/routes` (public API).
- **`apps/orchestrator`** — NestJS + Temporal; holds all workflows and activities for background jobs (e.g. actually publishing scheduled posts).
- **`apps/frontend`** — Next.js app (the CLAUDE.md/AGENTS history calls it "Vite ReactJS" but it's Next.js 16 under the hood), port 4200.
- **`apps/extension`** — Chrome extension (crxjs + Vite).
- **`apps/commands`** — NestJS CLI commands.
- **`apps/sdk`** — published Node SDK for the public API.
- **`landing`** — separate Next.js 15 static-export site (Tailwind v4 — do not confuse with the main app's Tailwind v3 config).
- **`libraries/nestjs-libraries`** — shared server-side logic (database/Prisma, integrations, services, temporal, upload, email, etc.) consumed by both `backend` and `orchestrator`.
- **`libraries/helpers`** — shared utilities/hooks usable from both frontend and backend (e.g. `custom.fetch.tsx`).
- **`libraries/react-shared-libraries`** — shared React components/config (i18n setup lives here).

TS path aliases (`tsconfig.base.json`):
```
@gitroom/backend/*          → apps/backend/src/*
@gitroom/frontend/*         → apps/frontend/src/*
@gitroom/helpers/*          → libraries/helpers/src/*
@gitroom/nestjs-libraries/* → libraries/nestjs-libraries/src/*
@gitroom/react/*            → libraries/react-shared-libraries/src/*
@gitroom/plugins/*          → libraries/plugins/src/*
@gitroom/orchestrator/*     → apps/orchestrator/src/*
@gitroom/extension/*        → apps/extension/src/*
```

## Backend conventions

Always go through all layers — no shortcuts:
```
Controller → Service → Repository
```
(some flows add a Manager: `Controller → Manager → Service → Repository`)

Most server logic belongs in `libraries/nestjs-libraries` (referred to informally as "libs/server"), not in `apps/backend`. The backend app itself should mostly just define controllers and import from the shared libraries.

## Frontend conventions

- UI primitives live in `apps/frontend/src/components/ui`; feature components are organized by domain under `apps/frontend/src/components/<domain>` (e.g. `billing`, `analytics`, `launches`); routing is in `apps/frontend/src/app`.
- Never install frontend UI components from npm — write native components. Check existing components in the system first to match the design.
- Before writing any component, check the design source of truth:
  - `apps/frontend/src/app/colors.scss`
  - `apps/frontend/src/app/global.scss`
  - `apps/frontend/tailwind.config.js`
  - All `--color-custom*` CSS vars are **deprecated** — don't use them.
- Always fetch data with SWR via the `useFetch` hook from `@gitroom/helpers/utils/custom.fetch`.
- Each SWR call must live in its own hook function (never nested inside an object of lazy getters), to stay compliant with `react-hooks/rules-of-hooks`. Never add `eslint-disable-next-line` to work around this.

  Valid:
  ```ts
  const useCommunity = () => {
    return useSWR(...);
  };
  ```
  Invalid:
  ```ts
  const useCommunity = () => {
    return {
      communities: () => useSWR<CommunitiesListResponse>("communities", getCommunities),
      providers: () => useSWR<ProvidersListResponse>("providers", getProviders),
    };
  };
  ```

## Env loading

All apps load the **root** `.env` explicitly via `dotenv -e ../../.env` — there's no auto-detection per app.
- `.env` is gitignored; `.env.developer` is the tracked template (`make setup` copies it).
- `NOT_SECURED=true` must be set for local HTTP dev (otherwise the `secure`/`sameSite: 'none'` cookie config blocks login on `http://localhost`).
- `IS_GENERAL=true` is required.
- `postinstall` runs `prisma-generate`, so `pnpm install` needs a valid DB/schema config even before you run anything.

## Other gotchas

- `fs.inotify.max_user_watches` should be `>= 524288` locally, or Turbopack/watch mode misbehaves (`make check` verifies this).
- `apps/frontend/public/g.js` is generated by `scripts/fetch-gtm.mjs` on postinstall — don't hand-edit it.
- `libraries/plugins/src/plugins.ts` is gitignored (generated).
- Pricing: currency is DOP (`stripe.service.ts`), defined in `libraries/nestjs-libraries/src/database/prisma/subscriptions/pricing.ts`; yearly = monthly × 12 × 0.8; 7-day Stripe trial built in.
- i18n: `i18next` + `react-i18next`, fallback chain `['es', 'en']` (Spanish first), configured in `libraries/react-shared-libraries/src/translation/`.
- Sentry: import as `import * as Sentry from "@sentry/nextjs"` (frontend/landing) or `"@sentry/nestjs"` (backend/orchestrator).

## Git workflow

`main` is protected — no direct pushes, always via PR (even for the repo owner, `enforce_admins=true`). Commits are typically written in Spanish with detailed descriptions. Merging to `main` auto-deploys to the VPS via `build-push.yml`.

For CI/CD internals, Traefik/Coolify routing, and deployment troubleshooting history, see [AGENTS.md](AGENTS.md) — it has a detailed, dated runbook of infra fixes that aren't relevant to day-to-day app code but matter if you touch `docker-compose.yaml`, `.github/workflows/`, or deployment config.
