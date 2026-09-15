# ---------- Stage 1: builder ----------
FROM node:22.20-bookworm-slim AS builder

RUN apt-get update && apt-get install -y --no-install-recommends \
    g++ \
    make \
    python3-pip \
&& rm -rf /var/lib/apt/lists/*

RUN npm --no-update-notifier --no-fund --global install pnpm@10.6.1

WORKDIR /app

# Solo manifests + el unico archivo que el postinstall (prisma generate)
# necesita. Mientras esto no cambie, la capa de "pnpm install" de abajo
# queda cacheada sin importar que se edite en apps/**/src o libraries/**/src.
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
COPY apps/*/package.json apps/*/
COPY landing/package.json landing/
COPY libraries/nestjs-libraries/src/database/prisma/schema.prisma \
     libraries/nestjs-libraries/src/database/prisma/schema.prisma

RUN --mount=type=cache,id=pnpm-store,target=/root/.local/share/pnpm/store \
    pnpm install

COPY . .

ARG NEXT_PUBLIC_VERSION
ENV NEXT_PUBLIC_VERSION=$NEXT_PUBLIC_VERSION

RUN NODE_OPTIONS="--max-old-space-size=4096" pnpm run build

# ---------- Stage 2: runtime ----------
FROM node:22.20-bookworm-slim AS runtime

RUN apt-get update && apt-get install -y --no-install-recommends \
    bash \
    nginx \
    curl \
&& rm -rf /var/lib/apt/lists/*

RUN addgroup --system www \
 && adduser --system --ingroup www --home /www --shell /usr/sbin/nologin www \
 && mkdir -p /www \
 && chown -R www:www /www /var/lib/nginx

RUN npm --no-update-notifier --no-fund --global install pnpm@10.6.1 pm2

WORKDIR /app

COPY --from=builder /app /app
COPY var/docker/nginx.conf /etc/nginx/nginx.conf

EXPOSE 5000

HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD curl -f http://localhost:5000/ || exit 1

CMD ["sh", "-c", "nginx && pnpm run pm2"]
