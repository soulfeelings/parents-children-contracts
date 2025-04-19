package main

import (
	"log"

	"github.com/soulfeelings/parents-children-contracts/backend/internal/database"
)

func main() {
	config := database.DefaultConfig()

	// Создаем базу данных
	if err := database.CreateDatabase(config); err != nil {
		log.Fatalf("Ошибка создания базы данных: %v", err)
	}

	// Подключаемся к созданной базе данных
	db, err := database.Connect(config)
	if err != nil {
		log.Fatalf("Ошибка подключения к базе данных: %v", err)
	}
	defer db.Close()

	// Создаем расширение для UUID
	if err := database.CreateUUIDExtension(db); err != nil {
		log.Fatalf("Ошибка создания расширения UUID: %v", err)
	}

	log.Println("Настройка базы данных завершена")
} 