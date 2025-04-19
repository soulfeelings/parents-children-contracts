.PHONY: dev test migrate create-migration rollback-migration setup-db seed-db clean install run frontend

# Переменные окружения
export GO_ENV=development
export NODE_ENV=development

# Запуск бэкенда в режиме разработки
dev:
	@echo "Запуск бэкенда в режиме разработки..."
	cd backend && go run cmd/main.go

# Запуск тестов
test:
	@echo "Запуск тестов..."
	cd backend && go test ./...

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
	@echo "Очистка базы данных..."
	cd backend && go run scripts/clean_db.go

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
frontend:
	@echo "Запуск фронтенда..."
	cd frontend && npm start 