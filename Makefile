COMPOSE = docker compose

# DEPENDENCIES
install:
	npm install

# ==============================
# DEV
# ==============================

# DOCKER
docker-up:
	$(COMPOSE) up -d

docker-down:
	$(COMPOSE) down

# REDIS
wait-redis: docker-up
	@echo "Waiting for Redis..."
	@until $(COMPOSE) exec -T redis redis-cli ping 2>/dev/null | grep PONG > /dev/null; do \
		sleep 1; \
	done
	@echo "Redis ready 🚀"

# RUNTIME
dev: wait-redis install
	@echo "Starting development environment..."
	npm run dev


# ==============================
# BUILD
# ==============================

PACKAGES = ./packages
SHARED = $(PACKAGES)/shared
APPLICATION = $(PACKAGES)/application
INFRA = $(PACKAGES)/infra
SERVER = $(PACKAGES)/server
WEB = $(PACKAGES)/web

$(SHARED)/dist:
	npm run build --workspace $(SHARED)

$(APPLICATION)/dist: $(SHARED)/dist
	npm run build --workspace $(APPLICATION)

$(INFRA)/dist: $(SHARED)/dist $(APPLICATION)/dist
	npm run build --workspace $(INFRA)

$(SERVER)/dist: $(SHARED)/dist $(APPLICATION)/dist $(INFRA)/dist
	npm run build --workspace $(SERVER)

web-build: $(SHARED)/dist $(APPLICATION)/dist $(INFRA)/dist
	npm run build --workspace $(WEB)

# ==============================
# PRODUCTION
# ==============================

prod-server: install $(SERVER)/dist
	npm run start --workspace $(SERVER)

prod-web: install web-build
	npm run start --workspace $(WEB)

# ==============================
# CLEAN
# ==============================

clean:
	rm -rf node_modules
	rm -rf $(PACKAGES)/*/dist
	$(COMPOSE) down -v

# ==============================
# UTILS
# ==============================

logs:
	$(COMPOSE) logs -f

restart:
	$(COMPOSE) restart

.PHONY: dev docker-up docker-down install build prod clean logs restart wait-redis