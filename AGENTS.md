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
- `required_approving_review_count=0` — no requiere reviewer (solo-dev)
- `enforce_admins=true` — aplica incluso al owner
- Status checks no requeridos (el CI corre al mergear a main, no como gate en PR)

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
2. Deploy via SSH al VPS: `preflight sudo → pin imágenes → pull → up -d --no-deps → healthcheck loop → backend :3000 → fix routers.yaml → restart coolify-proxy → verify endpoints (12×5s)`

El workflow lleva `concurrency: deploy-production` con `cancel-in-progress: false`, así que los deploys se encolan en vez de competir por el mismo compose del VPS.

### Requisito: sudo sin contraseña para `dev@`

El script remoto usa `sudo` para `chmod`/`sed`/`tee` sobre `/data/coolify/...`. La sesión SSH **no es interactiva**, así que un sudo que pida contraseña aborta el deploy (pasó el 2026-07-25: `sudo: a password is required`, run 30136761436). El deploy ahora hace `sudo -n true` como primer paso y falla con un mensaje explícito si no está configurado. Si se reconstruye el VPS, hay que reponer la entrada NOPASSWD para `dev`.

### Gates del deploy (todos con rollback automático)

El script guarda el SHA actualmente desplegado (`PREV_SHA`) antes de pinear el nuevo. Si cualquiera de estos gates falla, revierte el compose a `PREV_SHA`, levanta de nuevo los contenedores y sale con error:

1. **Contenedores healthy** (30×3s) — antes el bucle no abortaba si nunca llegaban a healthy.
2. **Backend en `:3000`** — es el puerto de NestJS. Antes sondeaba `:5000`, que es **nginx**: respondía aunque NestJS estuviera caído.
3. **Endpoints externos** (12×5s) — `https://app.miposting.com/api/` debe devolver `App is running!` (RootController vía nginx). **No usar `/api/health`**: nginx lo sintetiza con un `return 200` fijo (`var/docker/nginx.conf`) y pasa siempre, backend vivo o no.

Si `PREV_SHA` no se puede determinar (p. ej. el compose tiene `:latest`), el rollback se desactiva y el log lo avisa en vez de fallar en silencio.

### Cambios en CI/CD (2026-07-18)

- **Readiness check sin curl**: La imagen postiz no tiene curl. Se usa `bash -c 'cat < /dev/null > /dev/tcp/127.0.0.1/<puerto>'` para verificar el puerto interno. (Corregido después: el puerto correcto es `3000`, no `5000` — ver "Gates del deploy" arriba.)
- **certResolver en Docker router**: `sudo sed` agrega `traefik.http.routers.postiz.tls.certResolver=letsencrypt` al compose. Sin esto, Traefik usa default cert (self-signed) aunque el ACME cert exista.
- **File provider routers**: `routers.yaml` se crea/verifica con `tls.certResolver: letsencrypt` y `priority: 101` (override del Docker router priority 100).
- **Reintentos aumentados**: Endpoint verification 5→12 intentos (60s) para dar tiempo a ACME post-restart.
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
- **No agregar `STORAGE_PROVIDER` o `UPLOAD_DIRECTORY`** — el contenedor usa Cloudflare R2, no storage local.

### Notas SSL (2026-07-18)
- **Siempre agregar `tls.certResolver=letsencrypt`** al Docker router `postiz` en compose. `tls=true` solo → Traefik sirve default cert self-signed, aunque el ACME cert exista en `acme.json`.
- **File provider**: `tls.certResolver: letsencrypt` + `priority: 101` > Docker's 100. Ambos routers (Docker y file) deben tener certResolver.
- CI/CD ahora agrega el label automáticamente vía `sudo sed` en cada deploy.

## Security

### Secret Scanning + Push Protection
Activado vía GitHub API. Bloquea commits que contengan credenciales/tokens.

### Branch Protection (main)
- `required_approving_review_count=0` (solo-dev)
- `dismiss_stale_reviews=true`
- `enforce_admins=true`
- Force push y deletions: deshabilitados
- Status checks no requeridos (el workflow `build-push.yml` solo corre en push a main, no en PRs)

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
2. **File provider** — carga `/data/coolify/proxy/dynamic/routers.yaml` (nombre: `postiz-app`, `landing-web`, `coolify-web`)

**Regla**: el **file provider gana** — el CI/CD lo escribe con `priority: 101`, por encima del 100 del Docker provider. Los labels del compose son el **fallback** para cuando Coolify regenera o borra `routers.yaml`; por eso el deploy sigue inyectándoles `certResolver`.

### Configuración de `/data/coolify/proxy/dynamic/routers.yaml`

**El CI/CD sobrescribe este archivo en cada deploy** (`build-push.yml`, paso "Verifying routers.yaml integrity"). No editarlo a mano en el VPS: el siguiente deploy lo pisa. La fuente de verdad es el heredoc `YAML` dentro del workflow.

```yaml
http:
  routers:
    postiz-app:                    # app.miposting.com  → http://postiz:5000
    landing-web:                   # miposting.com      → http://postiz-landing:80
    coolify-web:                   # coolify.insiterd.com → http://coolify:8080
    # los tres con: entryPoints [https], tls.certResolver letsencrypt,
    # priority 101, middlewares [gzip]
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

**Fix**: File-provider router renombrado de `postiz-api` a `postiz-app`, y el CI/CD reescribe `routers.yaml` entero en cada deploy con `priority: 101` para que gane siempre al Docker provider (100). Se acabó el empate que dejaba el TLS handshake OK pero sin respuesta HTTP.

**CI/CD ahora verifica**:
1. Que el YAML resultante parsea (`python3 -c "yaml.safe_load"`) antes de reiniciar Traefik
2. Que los endpoints responden tras el deploy, con rollback al SHA anterior si no
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
- [ ] Coolify API autoloader bug — solo afecta API deploys
- [ ] Terminate AWS EC2 `18.218.99.94` (pendiente confirmación)
- [ ] Fork PR approval toggle en Settings > Actions > General (UI manual)
- [ ] Configure Postiz PostgreSQL backup
- [ ] Verify Google OAuth login with YOUTUBE_CLIENT_ID/YOUTUBE_CLIENT_SECRET

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
| 20. Readiness check con /dev/tcp (PR10) | ✅ |
| 21. certResolver en file provider + priority 101 (PR11) | ✅ |
| 22. certResolver label en Docker router (PR12) | ✅ |
| 23. CI/CD verde — endpoint verification pasa | ✅ |
| 24. SSL Let's Encrypt para app.miposting.com | ✅ |

## Incidente: restart real vía Coolify tumbó producción ~15 min (2026-09-13)

**Contexto**: tras arreglar el bug de `private_key` null (arriba), se probó un restart real disparado desde Coolify (redeploy `#216`) para confirmar el fix end-to-end. El fix de `private_key` funcionó — el deploy avanzó sin ese error — pero el redeploy completo falló por una cadena de problemas de infraestructura no relacionados, nunca vistos antes porque el stack `temporal`/`postiz` no se recreaba desde hacía mucho tiempo. **`postiz` quedó caído en producción (`502`) durante el proceso de diagnóstico y fix**, no solo en la prueba.

**Cadena de fallos, en orden**:

1. **`temporal` con permisos de bind-mount rotos**: `/data/coolify/applications/flofb07yh5gfcgxhw0ko0m1j/dynamicconfig` en el host es propiedad de `coolify` (uid 1001, modo 750/640), pero el proceso dentro del contenedor `temporalio/auto-setup` corre como uid 1000 (`temporal`) — ni dueño ni grupo coinciden, "other" sin permisos → `permission denied` leyendo `development-sql.yaml`. `temporal` quedó en crash-loop, y como `postiz` depende de `temporal` healthy, nunca arrancó. **Fix temporal aplicado en su momento**: `chmod o+rx` en el directorio y `chmod o+r` en el archivo.

   **Causa raíz identificada el 2026-09-13** (se creía "nunca identificada" — sí se identificó): Coolify reaplica permisos restrictivos (750/640) sobre todo el árbol de `/data/coolify/applications/<uuid>/` en **cada deploy**, como parte de su propia rutina interna (no es un cron ni algo externo; el `mtime` del archivo no cambia entre deploys, así que no es un re-checkout de git, es un `chmod` explícito de Coolify). Por eso cualquier chmod manual en el VPS dura solo hasta el siguiente deploy — se confirmó en vivo con dos deploys consecutivos el mismo día, cada uno revirtiendo el chmod anterior.

   **Primer intento de fix definitivo (NO funcionó)**: reemplazar el bind-mount por un [Compose `config` de archivo](https://docs.docker.com/reference/compose-file/configs/) con `mode: 0444` explícito. Se descartó tras probarlo en un deploy real: fuera de modo Swarm, `docker compose` (Docker 29.6.1 / Compose usado por Coolify) implementa los `configs` de archivo como un bind-mount normal por debajo e **ignora `mode` por completo** (`"config uid, gid and mode are not supported, they will be ignored"`), y además falló resolviendo el path fuente (`bind source path does not exist`). No usar `configs:` para este caso en este entorno.

   **Fix definitivo real**: se mantiene el bind-mount original (`volumes: - ./dynamicconfig:/etc/temporal/config/dynamicconfig`) pero se fuerza `user: "0:0"` en el servicio `temporal`. El proceso de `temporalio/auto-setup` corre por defecto como el usuario no-root `temporal` de la imagen, que nunca va a coincidir con el dueño (`coolify`) del archivo en el host; con el contenedor corriendo como root, los bits de permisos Unix del archivo dejan de importar sin importar qué le haga Coolify al host en cada deploy.
2. **Coolify regeneró `docker-compose.yaml` con `:latest`**: al fallar su propio redeploy, Coolify reescribió el compose file revirtiendo el pineo por SHA de `postiz` y `landing` a `:latest` — el riesgo ya documentado más abajo en este archivo ("Coolify sobreescribe routers.yaml") también aplica a `docker-compose.yaml` completo, no solo a routers. **Fix**: re-pinear a mano con el mismo `sed` que usa `build-push.yml` antes de cualquier `docker compose up` manual.
3. **Falta la red externa `flofb07yh5gfcgxhw0ko0m1j`**: el compose declara esa red como `external: true` (Coolify normalmente la crea como parte de su propio flujo de deploy antes de invocar `docker compose up`); al quedar eliminada durante la limpieza del redeploy fallido, cualquier `docker compose up` manual falla con `network ... declared as external, but could not be found`. **Fix**: `docker network create flofb07yh5gfcgxhw0ko0m1j`.
4. **`coolify-proxy` (Traefik) perdió la conexión a la red de la app**: tras recrear la red (punto 3) como un objeto nuevo, Traefik seguía conectado a la red vieja (ya destruida) y nunca se reconectó a la nueva — resultado: `502` en `app.miposting.com` incluso con todos los contenedores `healthy` y `routers.yaml` correcto. Normalmente Coolify conecta el proxy a la red de la app como parte de su propio flujo de deploy; al traer el stack arriba a mano, ese paso no ocurre. **Fix**: `docker network connect flofb07yh5gfcgxhw0ko0m1j coolify-proxy`.

**Lección para la próxima vez que se dispare un restart/redeploy real desde Coolify (UI o API)**: si falla a medio camino, no asumir que solo hay que resolver el error visible en el log — verificar en orden: (a) contenedores realmente `healthy` y no solo `Created`, (b) imagen pineada al SHA correcto en `docker-compose.yaml`, (c) la red externa `flofb07yh5gfcgxhw0ko0m1j` existe, (d) `coolify-proxy` está conectado a esa red (`docker inspect coolify-proxy --format '{{json .NetworkSettings.Networks}}'`), y solo entonces confirmar `curl https://app.miposting.com/api/`.

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

## Coolify restart/redeploy roto — GitHub App `private_key` null (2026-09-12, RESUELTO)

**Descubierto durante**: la puesta en marcha de PayPal en producción. Al intentar reiniciar el contenedor `postiz` vía el propio mecanismo de deploy de Coolify (UI o `POST /api/v1/applications/{uuid}/restart`, que internamente redepliega) para que tomara las nuevas env vars de `PAYMENT_GATEWAY`/`PAYPAL_*`, Coolify falló al generar el token de la GitHub App (`generateGithubToken()` lanza sobre un `private_key` null).

**Impacto (mientras estuvo roto)**: cualquier acción que disparara el flujo de deploy propio de Coolify (restart desde su UI, restart vía API, o redeploy manual) fallaba. **No afectaba** al pipeline de CI/CD propio (`build-push.yml`), que despliega vía SSH directo sin pasar por Coolify.

**Workaround usado en su momento**: se escribieron las env vars directamente en el `.env` del VPS (`sudo tee -a`, con aprobación explícita) y se recreó el contenedor `postiz` a mano (`docker compose up -d --no-deps postiz`), evitando el mecanismo de deploy de Coolify por completo.

**Causa raíz real** (investigada 2026-09-12 vía `docker exec coolify-db psql` + lectura del código fuente de Coolify 4.1.2): la fila de `github_apps` (`id=1`, `name='miposting'`, `app_id=4277174`, `installation_id=146003184`) tenía `private_key_id=5`, pero esa fila **no existía** en `private_keys` (solo quedaban `id=6` y `id=7`) — una foreign key colgante, no un bug genérico de Coolify. `app/Models/GithubApp.php::privateKey()` es un `belongsTo` normal; al no existir la fila, devolvía `null`, y `bootstrap/helpers/github.php::generateGithubToken()` hacía `$source->privateKey->private_key` sin chequear null. No quedaba ninguna copia recuperable del `.pem` original en ningún lado (el campo usa cast `'encrypted'` de Laravel).

**Fix aplicado**:
1. Se generó una nueva private key para la GitHub App desde GitHub (Settings → Developer settings → GitHub Apps → `miposting` → Private keys → Generate) — no invalida el `installation_id` ni las keys previas.
2. Se creó el registro en Coolify vía `docker exec coolify php artisan tinker` usando `App\Models\PrivateKey::create([...])` (nunca por `INSERT` SQL directo — el campo está cifrado con el cast `encrypted` de Laravel, y solo Eloquent lo maneja bien). Quedó como `private_keys.id=8`.
3. Se re-vinculó la GitHub App: `App\Models\GithubApp::find(1)->update(['private_key_id' => 8])`.
4. Verificado en caliente: `generateGithubJwt()` y `generateGithubInstallationToken()` (esta última hace la llamada real a la API de GitHub) ambas funcionan — GitHub aceptó el JWT firmado con la key nueva y devolvió un installation token real.

**Nota operativa**: al copiar cualquier archivo de secretos a un contenedor de Coolify vía `docker cp`, el proceso PHP corre como `www-data` (uid 9999), no como el usuario por defecto de `docker exec` — si el archivo queda con permisos `600` de otro uid, `file_get_contents()` falla en silencio (retorna vacío) en vez de tirar un error claro. Hace falta `docker exec -u root <container> chown www-data:www-data <archivo>` antes de que la app lo pueda leer.
