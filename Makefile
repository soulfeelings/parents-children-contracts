.PHONY: dev test migrate create-migration rollback-migration setup-db seed-db clean install run frontend setup start stop restart logs migration test test-backend test-frontend help

# Переменные окружения
export GO_ENV=development
export NODE_ENV=development

# Переменные
DOCKER_COMPOSE = docker-compose
BACKEND_DIR = backend
FRONTEND_DIR = frontend

# Запуск бэкенда в режиме разработки
dev:
	@echo "Запуск бэкенда в режиме разработки..."
	cd backend && go run cmd/main.go

# Запуск тестов
test: test-backend test-frontend

# Запуск тестов бэкенда
test-backend:
	@echo "🧪 Запуск тестов бэкенда..."
	@cd backend && go test ./...

# Запуск тестов фронтенда
test-frontend:
	@echo "🧪 Запуск тестов фронтенда..."
	@cd frontend && npm test

# Запуск миграций
migrate:
	@echo "Применение миграций..."
	cd backend && go run cmd/migrate/main.go up

# Создание новой миграции
create-migration:
	@if [ "$(name)" = "" ]; then \
		echo "Ошибка: Укажите имя миграции (make create-migration name=имя_миграции)"; \
		exit 1; \
	fi
	@echo "Создание миграции $(name)..."
	cd backend && go run cmd/migrate/main.go create $(name)

# Откат последней миграции
rollback-migration:
	@echo "Откат последней миграции..."
	cd backend && go run cmd/migrate/main.go down

# Настройка базы данных
setup-db:
	@echo "Настройка базы данных..."
	cd backend && go run scripts/setup_db.go

# Заполнение базы данных тестовыми данными
seed-db:
	@echo "Заполнение базы данных тестовыми данными..."
	cd backend && go run scripts/seed_db.go

# Очистка базы данных
clean:
	@echo "🧹 Очистка всех данных..."
	cd backend && go run scripts/clean_db.go
	@$(DOCKER_COMPOSE) down -v
	@rm -rf $(BACKEND_DIR)/migrations/*.sql
	@echo "✅ Данные успешно очищены!"

# Установка зависимостей
install:
	@echo "Установка зависимостей бэкенда..."
	cd backend && go mod download
	@echo "Установка зависимостей фронтенда..."
	cd frontend && npm install

# Запуск всего проекта
run:
	@echo "Запуск проекта..."
	make -j2 dev frontend

# Запуск фронтенда
frontend-dev:
	@echo "Запуск фронтенда..."
	cd frontend && npm run dev

# Настройка проекта
setup:
	@echo "🚀 Настройка проекта..."
	@mkdir -p $(BACKEND_DIR)/migrations
	@if [ ! -f $(BACKEND_DIR)/.env.development ]; then \
		echo "📝 Создание .env.development..."; \
		cp $(BACKEND_DIR)/.env.example $(BACKEND_DIR)/.env.development; \
		echo "✅ .env.development создан"; \
	else \
		echo "ℹ️ .env.development уже существует"; \
	fi
	@if [ ! -f $(BACKEND_DIR)/.env.test ]; then \
		echo "📝 Создание .env.test..."; \
		cp $(BACKEND_DIR)/.env.example $(BACKEND_DIR)/.env.test; \
		echo "✅ .env.test создан"; \
	else \
		echo "ℹ️ .env.test уже существует"; \
	fi
	@if [ ! -f $(BACKEND_DIR)/.env.production ]; then \
		echo "📝 Создание .env.production..."; \
		cp $(BACKEND_DIR)/.env.example $(BACKEND_DIR)/.env.production; \
		echo "✅ .env.production создан"; \
	else \
		echo "ℹ️ .env.production уже существует"; \
	fi
	@echo "🚀 Запуск сервисов..."
	@$(DOCKER_COMPOSE) up postgres
	@echo "⏳ Ожидание запуска базы данных..."
	@sleep 5
	@$(DOCKER_COMPOSE) up backend
	@echo "✅ Проект успешно настроен!"
	@echo "📝 Проверьте и настройте параметры в файлах .env.* если необходимо"

# Запуск всех сервисов
start:
	@echo "🚀 Запуск всех сервисов..."
	@$(DOCKER_COMPOSE) up

# Запуск всех сервисов
build:
	@echo "🚀 Запуск всех сервисов..."
	@$(DOCKER_COMPOSE) up --build

# Остановка всех сервисов
stop:
	@echo "🛑 Остановка всех сервисов..."
	@$(DOCKER_COMPOSE) down

# Перезапуск всех сервисов
restart: stop start

# Просмотр логов
logs:
	@$(DOCKER_COMPOSE) logs -f

# Создание новой миграции
migration:
	@if [ -z "$(name)" ]; then \
		echo "❌ Ошибка: укажите имя миграции (make migration name=имя_миграции)"; \
		exit 1; \
	fi
	@echo "📝 Создание миграции $(name)..."
	@cd $(BACKEND_DIR) && go run cmd/migrate/create.go $(name)
	@echo "✅ Миграция успешно создана!"

# Помощь
help:
	@echo "Доступные команды:"
	@echo "  make setup          - Первоначальная настройка проекта"
	@echo "  make start         - Запуск всех сервисов"
	@echo "  make stop          - Остановка всех сервисов"
	@echo "  make restart       - Перезапуск всех сервисов"
	@echo "  make logs          - Просмотр логов"
	@echo "  make clean         - Очистка всех данных"
	@echo "  make migration     - Создание новой миграции"
	@echo "  make test          - Запуск всех тестов"
	@echo "  make test-backend  - Запуск тестов бэкенда"
	@echo "  make test-frontend - Запуск тестов фронтенда"
	@echo "  make help          - Показать эту справку" 