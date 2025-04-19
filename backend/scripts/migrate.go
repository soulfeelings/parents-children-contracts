package main

import (
	"log"
	"path/filepath"

	"github.com/soulfeelings/parents-children-contracts/backend/internal/database"
)

func main() {
	config := database.DefaultConfig()

	// Подключаемся к базе данных
	db, err := database.Connect(config)
	if err != nil {
		log.Fatalf("Ошибка подключения к базе данных: %v", err)
	}
	defer db.Close()

	// Применяем миграции
	migrationsDir := filepath.Join("..", "migrations")
	if err := database.ExecuteSQLFiles(db, migrationsDir); err != nil {
		log.Fatalf("Ошибка применения миграций: %v", err)
	}

	log.Println("Все миграции успешно применены")
} 