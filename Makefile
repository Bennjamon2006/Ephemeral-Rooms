COMPOSE = docker compose

# ==============================
# REDIS
# ==============================

wait-redis: docker-up
	@echo "Waiting for Redis..."
	@until $(COMPOSE) exec -T redis redis-cli ping 2>/dev/null | grep PONG > /dev/null; do \
		sleep 1; \
	done
	@echo "Redis ready 🚀"

# ==============================
# DEV
# ==============================

dev: wait-redis install
	@echo "Starting development environment..."
	npm run dev

# ==============================
# DOCKER
# ==============================

docker-up:
	$(COMPOSE) up -d

docker-down:
	$(COMPOSE) down

# ==============================
# BUILD / PROD
# ==============================

install:
	npm install

build: 
	@echo "Building all packages..."
	npm run build

prod: wait-redis install build
	@echo "Simulating production environment..."
	npm run start

# ==============================
# CLEAN
# ==============================

clean:
	rm -rf node_modules
	rm -rf packages/*/dist
	$(COMPOSE) down -v

# ==============================
# UTILS
# ==============================

logs:
	$(COMPOSE) logs -f

restart:
	$(COMPOSE) restart

.PHONY: dev docker-up docker-down install build prod clean logs restart wait-redis