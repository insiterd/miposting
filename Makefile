.PHONY: help check setup infra install db dev dev-all dev-backend dev-frontend dev-orchestrator dev-landing clean

help:           ## Muestra esta ayuda
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | \
	awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

check:          ## Verifica requisitos Node.js >=22 y watch limit
	@node_version=$$(node -v | cut -d'v' -f2 | cut -d'.' -f1); \
	if [ "$$node_version" -lt 22 ]; then \
		echo "❌ Node.js $$(node -v) — requiere >=22.12.0"; \
		exit 1; \
	fi; \
	echo "✅ Node.js $$(node -v)"
	@watches=$$(cat /proc/sys/fs/inotify/max_user_watches 2>/dev/null || echo 0); \
	if [ "$$watches" -lt 524288 ]; then \
		echo "⚠️  Watch limit: $$watches (recomendado: 524288)"; \
		echo "   Solución: sudo sysctl fs.inotify.max_user_watches=524288"; \
	else \
		echo "✅ Watch limit: $$watches"; \
	fi

setup:          ## Crea .env desde .env.developer (solo si no existe)
	@if [ ! -f .env ]; then \
		cp .env.developer .env; \
		echo "✅ .env creado desde .env.developer"; \
	else \
		echo "⚠️  .env ya existe, omítido"; \
	fi

infra:          ## Levanta PostgreSQL, Redis y Temporal con Docker
	pnpm dev:docker

install:        ## Instala dependencias y genera Prisma Client
	pnpm install

db:             ## Crea/actualiza esquema de base de datos
	pnpm prisma-db-push

dev: check      ## Corre backend + frontend en paralelo (hot-reload)
	pnpm dev-backend

dev-all: check setup infra install db     ## Setup completo: .env → Docker → deps → DB → backend + frontend + landing
	pnpm dev:all

dev-backend:    ## Corre solo el backend (puerto 3000)
	pnpm dev:backend

dev-frontend:   ## Corre solo el frontend (puerto 4200)
	pnpm dev:frontend

dev-orchestrator: ## Corre solo el orquestador Temporal
	pnpm dev:orchestrator

dev-landing:    ## Corre la landing page (puerto 8030)
	cd landing && pnpm dev

clean:          ## Baja servicios Docker de desarrollo
	docker compose -f docker-compose.dev.yaml down
