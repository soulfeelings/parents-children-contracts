# Используем официальный образ Go
FROM golang:1.22-alpine

# Устанавливаем необходимые пакеты
RUN apk add --no-cache git

# Устанавливаем air для hot-reload
RUN go install github.com/cosmtrek/air@v1.49.0

# Создаем рабочую директорию
WORKDIR /app

# Создаем пользователя с правами на запись
RUN adduser -D -g '' appuser && \
    chown -R appuser:appuser /app

# Копируем файлы зависимостей
COPY --chown=appuser:appuser go.mod go.sum ./

# Скачиваем зависимости
RUN go mod download

# Копируем исходный код
COPY --chown=appuser:appuser . .

# Создаем конфигурацию для air
COPY --chown=appuser:appuser .air.toml ./

# Создаем директорию для временных файлов
RUN mkdir -p tmp && chown -R appuser:appuser tmp

# Переключаемся на пользователя appuser
USER appuser

# Открываем порт
EXPOSE 8080

# Запускаем приложение через air для hot-reload
CMD ["air", "-c", ".air.toml"] 