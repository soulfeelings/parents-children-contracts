# Руководство по разработке

## Требования

- Docker и Docker Compose
- Go 1.22 или выше
- Make (опционально, для использования Makefile)

## Быстрый старт

1. Клонируйте репозиторий:

```bash
git clone https://github.com/soulfeelings/parents-children-contracts.git
cd parents-children-contracts
```

2. Запустите проект:

```bash
make setup
```

Эта команда:

- Создаст необходимые директории
- Создаст файлы конфигурации (.env.development, .env.test, .env.production)
- Запустит базу данных PostgreSQL
- Запустит бэкенд с hot-reload
- Применит миграции базы данных

## Конфигурация

Проект использует следующие конфигурационные файлы:

- `.env.development` - для разработки
- `.env.test` - для тестирования
- `.env.production` - для продакшена

Файлы создаются автоматически при выполнении `make setup`. Проверьте и настройте параметры в этих файлах если необходимо.

Основные параметры:

```env
# Настройки приложения
APP_ENV=development
PORT=8080

# Настройки базы данных
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=parents_children_dev
DB_SSL_MODE=disable

# Настройки JWT
JWT_SECRET=your_secret_key_here
JWT_EXPIRATION=24h

# Путь к миграциям
MIGRATION_PATH=/app/migrations
```

## Структура проекта

```
.
├── backend/                 # Бэкенд на Go
│   ├── config/             # Конфигурация
│   ├── database/           # Работа с базой данных
│   ├── handlers/           # Обработчики HTTP
│   ├── middleware/         # Middleware
│   ├── migrations/         # SQL миграции
│   └── main.go            # Точка входа
├── frontend/               # Фронтенд на React
│   ├── src/               # Исходный код
│   └── public/            # Статические файлы
└── docker-compose.yml     # Конфигурация Docker
```

## Разработка

### Бэкенд

Бэкенд запускается на порту 8080 с поддержкой hot-reload. При изменении кода сервер автоматически перезапускается.

### База данных

PostgreSQL запускается на порту 5432. Данные сохраняются в Docker volume.

Параметры подключения:

- Host: localhost
- Port: 5432
- User: postgres
- Password: postgres
- Database: parents_children_dev

### Миграции

Миграции применяются автоматически при запуске. Для создания новой миграции:

```bash
make migration name=migration_name
```

## Полезные команды

```bash
make setup          # Первоначальная настройка проекта
make start         # Запуск всех сервисов
make stop          # Остановка всех сервисов
make restart       # Перезапуск всех сервисов
make logs          # Просмотр логов
make clean         # Очистка всех данных
make migration     # Создание новой миграции
```

## Тестирование

```bash
make test          # Запуск всех тестов
make test-backend  # Запуск тестов бэкенда
make test-frontend # Запуск тестов фронтенда
```

## Стиль кода

- Бэкенд: следуем стандартному стилю Go
- Фронтенд: используем ESLint и Prettier

## Git Flow

1. Создайте ветку для новой функции:

```bash
git checkout -b feature/name-of-feature
```

2. Внесите изменения и закоммитьте:

```bash
git add .
git commit -m "feat: описание изменений"
```

3. Отправьте изменения:

```bash
git push origin feature/name-of-feature
```

4. Создайте Pull Request

## Лицензия

MIT
