# Используем официальный образ Go
FROM golang:1.22-alpine

# Устанавливаем необходимые пакеты
RUN apk add --no-cache git

# Устанавливаем air для hot-reload (версия 1.49.0 совместима с Go 1.21)
RUN go install github.com/cosmtrek/air@v1.49.0

# Создаем рабочую директорию
WORKDIR /app

# Копируем файлы зависимостей
COPY go.mod go.sum ./

# Скачиваем зависимости
RUN go mod download

# Копируем исходный код
COPY . .

# Создаем конфигурацию для air
COPY .air.toml ./

# Открываем порт
EXPOSE 8080

# Запускаем приложение через air для hot-reload
CMD ["air", "-c", ".air.toml"] 