# AGENTS.md — miposting (rebranded Postiz)

## Dev workflow

```sh
# First-time setup
make dev-all          # .env → Docker → deps → DB → backend + frontend + landing

# Per-component dev servers
make dev              # backend (3000) + frontend (4200), no landing
make dev-all          # all three including landing (8030)
make dev-landing      # landing only (8030, static export)
make dev-backend      # backend only (3000)
make dev-frontend     # frontend only (4200)
make dev-orchestrator # Temporal orchestrator
pnpm dev              # extension + orchestrator + backend + frontend (from root)

# Other
pnpm test             # jest --coverage (root only)
pnpm lint             # ESLint flat config — runs only from root
make infra            # docker compose -f docker-compose.dev.yaml up -d
make clean            # docker compose down
```

## Git workflow

Branch protection activo en `main`:
- No push directo — siempre vía PR
- Status check `Build & Push Images` debe pasar para mergear
- `required_approving_review_count=0` — no requiere reviewer (solo-dev)
- `enforce_admins=true` — aplica incluso al owner

Flujo:
```bash
git checkout -b feat/mi-cambio
git add .
git commit -m "feat: descripcion"
git push -u origin feat/mi-cambio
# GH UI: crear PR → esperar CI verde → Merge pull request
```

Al mergear se dispara `build-push.yml` que deploya al VPS automáticamente.

## Architecture

- **Monorepo** — pnpm workspaces: `apps/*`, `libraries/*`, `landing`
- **Root** pnpm@10.6.1, Node >=22.12.0 <23.0.0
- **Backend** — NestJS, entry: `apps/backend/src/main.ts`
- **Frontend** — Next.js 16 (Vite-based), port 4200
- **Orchestrator** — NestJS + Temporal for background jobs/activities
- **Landing** — Next.js 15, static export (`output: "export"`), Tailwind v4, AOS via `await import("aos")`
- **Extension** — Chrome extension via crxjs + Vite
- **Commands** — NestJS CLI commands

## ENV loading

All apps load root `.env` explicitly: `dotenv -e ../../.env`. No auto-detection.
- `.env` is gitignored; `.env.developer` is the tracked template (copy to `.env`)
- `NOT_SECURED=true` needed for HTTP localhost (sameSite cookie restriction)
- `IS_GENERAL="true"` required

## Key conventions (from CLAUDE.md)

- **Backend**: Controller → Service → Repository (3 layers). No shortcuts.
- **Frontend UI**: Always SWR via `useFetch` hook from `@gitroom/helpers/utils/custom.fetch`
- **SWR rules**: Each endpoint in a separate hook file, never nest `useSWR` inside objects
- **UI components**: `apps/frontend/src/components/ui/`
- **No npm frontend components**: Write native components; avoid npm for UI
- **Tailwind**: Main app v3.4.17, landing v4.2.1 — different config files!
- **Deprecated**: `--color-custom*` CSS vars — don't use
- **ESLint**: runs from root only (flat config, `next/core-web-vitals` + `next/typescript`)
- **Prettier**: singleQuote only
- **Commits**: Spanish with detailed descriptions

## Prisma

- Schema: `libraries/nestjs-libraries/src/database/prisma/schema.prisma`
- Version pinned to 6.5.0
- Commands (from root):
  ```sh
  pnpm prisma-generate           # Generate Prisma Client (runs on postinstall)
  pnpm prisma-db-push            # Push schema to DB (--accept-data-loss)
  pnpm prisma-db-pull            # Introspect DB → schema
  pnpm prisma-reset              # Force-reset DB
  ```

## Docker services (dev)

| Service | Port | Image |
|---------|------|-------|
| PostgreSQL 17 | 5432 | postgres:17-alpine |
| Redis 7 | 6379 | redis:7-alpine |
| Temporal | 7233 | temporalio/auto-setup:1.28.1 |
| Temporal UI | 8080 | temporalio/ui:2.34.0 |
| pgAdmin | 8015 | dpage/pgadmin4 |
| RedisInsight | 5540 | redis/redisinsight |

## TS path aliases (`tsconfig.base.json`)

```
@gitroom/backend/*         → apps/backend/src/*
@gitroom/frontend/*        → apps/frontend/src/*
@gitroom/helpers/*         → libraries/helpers/src/*
@gitroom/nestjs-libraries/*→ libraries/nestjs-libraries/src/*
@gitroom/react/*           → libraries/react-shared-libraries/src/*
@gitroom/plugins/*         → libraries/plugins/src/*
@gitroom/orchestrator/*    → apps/orchestrator/src/*
@gitroom/extension/*       → apps/extension/src/*
```

## Pricing & currency

- Currency: DOP (RD$) — `currency: 'dop'` in `stripe.service.ts`, `setCurrency('DOP')` in track service
- Prices defined in `libraries/nestjs-libraries/src/database/prisma/subscriptions/pricing.ts`
- Yearly = monthly × 12 × 0.8 (20% discount)
- 7-day free trial built-in (Stripe `trial_period_days: 7`)

## i18n

- Library: i18next with `react-i18next`
- Fallback chain: `['es', 'en']` — Spanish first, English fallback
- Config: `libraries/react-shared-libraries/src/translation/i18n.config.ts` and `i18next.ts`

## Domain

- Production app runs at `app.miposting.com`
- Landing login/register links point to `https://app.miposting.com/login` and `/register`

## Important gotchas

- Watch limit (`fs.inotify.max_user_watches`) should be >= 524288 for Turbopack
- `node-linker=hoisted` in `.npmrc` — all deps hoisted to root `node_modules`
- `postinstall` runs `prisma-generate` — requires DB config even for install
- `NOT_SECURED=true` — uncomment in `.env` before local dev; browser blocks `secure: true, sameSite: 'none'` on HTTP
- `apps/frontend/public/g.js` is generated by `scripts/fetch-gtm.mjs` on postinstall
- `libraries/plugins/src/plugins.ts` is gitignored (generated)
- Sentry import: `import * as Sentry from "@sentry/nextjs"` / `"@sentry/nestjs"`

## Existing instruction files (preserved)

- `CLAUDE.md` — detailed component/fetch/backend conventions
- `.github/copilot-instructions.md` — architecture overview + Sentry patterns

## CI/CD pipeline

El CI/CD build-push.yml hace:
1. Build + push a GHCR (dos jobs paralelos: postiz, landing)
2. Deploy via SSH al VPS: `pull → up -d --no-deps → healthcheck loop → fix routers.yaml → restart coolify-proxy → verify endpoints (3 reintentos)`

### Cambios en CI/CD (2026-07-14)

- **known_hosts dinámico**: Ya no usa clave ECDSA hardcodeada. El deploy job ejecuta `ssh-keyscan -H ${{ secrets.VPS_HOST }} >> ~/.ssh/known_hosts` para obtener la host key automáticamente.
- **Image pinning**: El deploy job ahora ejecuta `sed` sobre el docker-compose.yaml del VPS para reemplazar `:latest` con `:${{ github.sha }}` antes de hacer `pull` y `up -d`. Esto hace que cada deploy quede pineado a una imagen específica.

### Errores conocidos

- **`Error response from daemon: No such container`** — no usar `--wait` en `docker compose up -d`. Docker Compose referencea container IDs viejos que ya no existen. Usar loop manual de healthcheck con `docker ps -q -f "label=com.docker.compose.service=..."`.
- **Los nombres de container cambian en cada recreate** — el sufijo numérico (e.g. `-022131340838`) varía. Usar labels (`com.docker.compose.service`) para identificar containers, no nombres estáticos.
- **Traefik no refresca rutas automáticamente** — siempre ejecutar `docker restart coolify-proxy` al final del deploy. Docker provider no siempre actualiza routers cuando cambia el container ID.
- **Coolify sobreescribe `routers.yaml`** — el CI/CD verifica y corrige automáticamente si Coolify regenera el archivo con el nombre viejo `postiz-api`.

### Healthcheck loop

Usar labels estables para encontrar containers post recreate:
```bash
POSTIZ_ID=$(docker ps -q -f 'label=com.docker.compose.service=postiz')
docker inspect --format '{{.State.Health.Status}}' "$POSTIZ_ID"
```

### Entries to never add
- **No agregar `miposting.com` al `certificates.yaml`** — el landing obtiene su cert vía ACME automático de Traefik. Agregar una entrada file-based rompe todo el ruteo HTTPS.
- **No usar `certResolver=letsencrypt` en labels de router** — usar `tls=true` para que Traefik matchee con file-based certs.
- **No agregar `STORAGE_PROVIDER` o `UPLOAD_DIRECTORY`** — el contenedor usa Cloudflare R2, no storage local.

## Security

### Secret Scanning + Push Protection
Activado vía GitHub API. Bloquea commits que contengan credenciales/tokens.

### Branch Protection (main)
- Status check requerido: `Build & Push Images`
- `required_approving_review_count=0` (solo-dev)
- `dismiss_stale_reviews=true`, `require_last_push_approval=true`
- `enforce_admins=true`
- Force push y deletions: deshabilitados

### Action pinning (SHA)
Todas las GitHub Actions en `.github/workflows/*` están pineadas por SHA commit en vez de tags semver (`@v4` → `@34e114... # v4`). 28 actions en 8 workflows.

Para actualizar una action:
```bash
gh api repos/{owner}/{repo}/git/refs/tags/{tag} --jq '.object.sha'
```

### Fork PR defense
- `default_workflow_permissions=read` — workflows de forks solo lectura
- `can_approve_pull_request_reviews=false` — workflows no pueden aprobar PRs

### Dependabot
- Alertas + security updates: activados
- `.github/dependabot.yml`: npm (grouped patches), docker, github-actions
- Schedule: lunes 9am AST

## SSL / Traefik (2026-07-14 — definitivo)

### Arquitectura de routing

```
Browser → Traefik:443 → postiz:5000 (nginx) → localhost:4200 (frontend Next.js)
                                             → localhost:3000 (backend NestJS)
Browser → Traefik:443 → postiz-landing:80 (Next.js estático)
```

### Providers de routing (IMPORTANTE: conflicto resuelto)

Coolify genera **dos providers** de Traefik:
1. **Docker provider** — crea routers desde labels del compose (nombre: `postiz`, `landing`, prioridad: 100)
2. **File provider** — carga `/data/coolify/proxy/dynamic/routers.yaml` (nombre: `postiz-app`, `landing-web`)

**Regla**: Docker provider tiene prioridad. File-provider es fallback (priority: 1).

### Configuración actual de `/data/coolify/proxy/dynamic/routers.yaml`
```yaml
http:
  routers:
    postiz-app:          # ← fallback (priority 1)
      rule: "Host(`app.miposting.com`)"
      entryPoints: [https]
      service: postiz-app
      tls: true
      priority: 1        # ← prioridad baja (fallback)
    landing-web:
      rule: "Host(`miposting.com`)"
      entryPoints: [https]
      service: landing-web
      tls: true
      priority: 100
  services:
    postiz-app:
      loadBalancer:
        servers: [{url: "http://postiz:5000"}]
        passHostHeader: true
    landing-web:
      loadBalancer:
        servers: [{url: "http://postiz-landing:80"}]
        passHostHeader: true
  middlewares:
    gzip:
      compress: {}
```

### Variables de entorno críticas (Postiz docs)
| Variable | Valor | Notas |
|---|---|---|
| `FRONTEND_URL` | `https://app.miposting.com` | OAuth redirect base |
| `NEXT_PUBLIC_BACKEND_URL` | `https://app.miposting.com/api` | URL del browser al backend |
| `BACKEND_INTERNAL_URL` | `http://localhost:3000` | URL interna SSR→Backend |
| `MAIN_URL` | `https://miposting.com` | URLs absolutas emails/SEO |
| `IS_GENERAL` | `true` | Build open-source |
| `RUN_CRON` | `true` | **Requerido** para scheduled posts |
| `RESEND_API_KEY` | `re_...` | Transactional emails (Resend) |
| `EMAIL_FROM_ADDRESS` | `noreply@miposting.com` | Remitente emails |
| `EMAIL_FROM_NAME` | `Miposting` | Nombre del remitente |
| `EMAIL_PROVIDER` | `resend` | **Obligatorio** — sin esto Postiz cae a `EmptyProvider` |

### Solución definitiva al conflicto de routers (2026-07-14)
**Problema**: Coolify creaba un router Docker `postiz` con `Host(\`app.miposting.com\`)` en entrypoint HTTPS, que competía con nuestro file-provider router `postiz-api` (misma regla, misma prioridad). Resultado: TLS handshake OK pero sin respuesta HTTP.

**Fix**: File-provider router renombrado a `postiz-app` con `priority: 1` (fallback). Docker provider (priority 100) tiene prioridad.

**CI/CD ahora verifica**:
1. Que `routers.yaml` no tenga el nombre viejo `postiz-api`
2. Que `postiz-app` tenga `priority: 1`
3. Reintenta verificación de endpoints 3 veces con 5s de espera

### Monitoreo implementado

| Script | Trigger | Qué hace |
|---|---|---|
| `/usr/local/bin/miposting-healthcheck.sh` | cron cada 5 min | Verifica endpoints, restart Traefik si falla 3 veces |
| `/usr/local/bin/miposting-recovery.sh` | systemd timer (2 min post-reboot) | Verifica sshd, Docker, Traefik, containers, routers.yaml |
| `/usr/local/bin/coolify-ssh-backup.sh` | cron diario 3am | Verifica SSH key de Coolify existe y está en DB |

### Errores conocidos
- **Coolify Docker labels bogus**: `Host(\`\`) && PathPrefix(...)` en HTTP entrypoint. Causa errores en logs pero no rompe HTTPS. Solución: file-provider routers.
- **Traefik estado corrupto post-reboot**: `docker restart coolify-proxy` lo resuelve.
- **`miposting.com` gateway timeout**: Traefik acumula estado interno corrupto. Solución: restart.

### Remaining items
- [ ] Coolify API autoloader bug (`Class "App\Models\User" not found`) - solo afecta API deploys
- [ ] Terminate AWS EC2 `18.218.99.94` (pendiente confirmación)
- [ ] Fork PR approval toggle en Settings > Actions > General (UI manual)
- [ ] `dev` user sudo NOPASSWD para CI/CD automation
- [ ] pin-action script (`make pin-action`) opcional

### Items completados (2026-07-14)

| Ítem | Estado |
|------|--------|
| 1. Recrear postiz para RUN_CRON | ✅ |
| 2. depends_on condition: service_healthy en postiz→temporal | ✅ |
| 3. Healthchecks en temporal, temporal-postgresql, temporal-elasticsearch | ✅ |
| 4. temporal-ui agregado | ✅ |
| 5. CORS Cloudflare R2 verificado | ✅ |
| 6. HOST=0.0.0.0 eliminado de Coolify DB | ✅ |
| 7. NEXT_PUBLIC_VERSION en CI/CD | ✅ |
| 8. known_hosts dinámico con ssh-keyscan | ✅ |
| 9. Image tags pineados con commit SHA | ✅ |
| 10. Secret Scanning + Push Protection | ✅ |
| 11. Branch Protection (main) | ✅ |
| 12. Action pinning por SHA (28 actions, 8 workflows) | ✅ |
| 13. Fork PR defense | ✅ |
| 14. Dependabot alerts + dependabot.yml | ✅ |
| 15. Resend env vars (API key, from, provider) | ✅ |
| 16. Coolify FQDN (coolify.insiterd.com) | ✅ |
| 17. SSH hardening (no root, no password) | ✅ |
| 18. iptables DOCKER-USER (bloqueo 8081,6001,6002) | ✅ |
| 19. Port 8000 bloqueado (raw PREROUTING) | ✅ |

## Coolify API & .env persistence (2026-07-13)

### Coolify API autoloader bug fixed
**Issue**: `Class "App\Models\User" not found` in `getTeamIdFromToken()` when calling API with Bearer token.

**Root causes (3 compounding issues)**:
1. **Missing autoloader optimization** - `composer dump-autoload -o` not run after container start
2. **Team ID = 0 in database** - Personal access tokens had `team_id: 0` and `tokenable_id: 0` (invalid foreign keys)
3. **Token format** - Client must send `id|plaintext_token` (e.g. `8|cp_abc...`), not just plaintext

**Fix applied**:
```bash
# In coolify container:
php artisan optimize:clear
composer dump-autoload -o

# Fix database:
# - Delete team_id=0, create team_id=1
# - Update all foreign keys from team_id=0 → 1
# - Create new personal access token with correct tokenable_id=1, team_id=1
# - Use format: {token_id}|{plain_text_token} in Authorization header
```

### .env variables persisted in Coolify DB
All 25 environment variables from `/data/coolify/applications/flofb07yh5gfcgxhw0ko0m1j/.env` now stored in Coolify's database via API:
- **Secrets**: JWT_SECRET, Cloudflare R2 (account_id, access_key, secret_key, bucket, url, region)
- **Social auth**: Facebook (app_id, secret), Instagram (app_id, secret)
- **Runtime config**: HOST=0.0.0.0, STORAGE_PROVIDER=cloudflare
- **Service discovery**: SERVICE_URL_*, SERVICE_NAME_*

**Method**: `PATCH /api/v1/applications/{uuid}/envs/bulk` with `data` array of `{key, value, is_runtime: true, ...}`

**Result**: Variables survive fresh Coolify deployments; no manual `.env` file needed.
