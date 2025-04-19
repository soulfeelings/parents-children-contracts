# Руководство по установке и запуску проекта

## Предварительные требования

- Go 1.21 или выше
- Node.js 18 или выше
- PostgreSQL 14 или выше
- Make

## Установка и настройка

1. Клонируйте репозиторий:

```bash
git clone https://github.com/your-username/parents-children-contracts.git
cd parents-children-contracts
```

2. Установите все зависимости:

```bash
make install
```

3. Создайте файл `.env.development` в директории `backend`:

```bash
cp backend/.env.example backend/.env.development
```

4. Настройте переменные окружения в файле `.env.development`:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=parents_children_dev
JWT_SECRET=your_secret_key
```

5. Настройте базу данных:

```bash
make setup-db
```

6. Запустите миграции:

```bash
make migrate
```

7. Заполните базу данных тестовыми данными:

```bash
make seed-db
```

## Запуск проекта

### Запуск всего проекта (бэкенд + фронтенд)

```bash
make run
```

### Запуск только бэкенда

```bash
make dev
```

### Запуск только фронтенда

```bash
make frontend
```

## Полезные команды

- `make test` - запуск тестов
- `make create-migration name=имя_миграции` - создание новой миграции
- `make rollback-migration` - откат последней миграции
- `make clean` - очистка базы данных
- `make seed-db` - заполнение базы данных тестовыми данными

## Структура проекта

```
.
├── backend/           # Бэкенд на Go
│   ├── cmd/          # Точки входа приложения
│   ├── internal/     # Внутренний код приложения
│   ├── migrations/   # Миграции базы данных
│   └── scripts/      # Скрипты для работы с БД
├── frontend/         # Фронтенд на React
│   ├── src/          # Исходный код
│   └── public/       # Статические файлы
└── Makefile         # Команды для управления проектом
```

## Разработка

1. Создайте новую ветку для ваших изменений:

```bash
git checkout -b feature/your-feature-name
```

2. Внесите изменения и создайте коммит:

```bash
git add .
git commit -m "Описание ваших изменений"
```

3. Отправьте изменения в репозиторий:

```bash
git push origin feature/your-feature-name
```

4. Создайте Pull Request для ваших изменений.

## Тестирование

Перед отправкой Pull Request убедитесь, что:

1. Все тесты проходят успешно (`make test`)
2. Код соответствует стандартам форматирования
3. Все миграции применены (`make migrate`)
4. Приложение успешно запускается (`make run`)

## Получение помощи

Если у вас возникли проблемы или вопросы:

1. Проверьте раздел Issues в репозитории
2. Создайте новый Issue с описанием проблемы
3. Обратитесь к команде разработки через соответствующие каналы связи
