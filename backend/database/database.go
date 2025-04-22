package database

import (
	"fmt"
	"log"

	"github.com/soulfeelings/parents-children-contracts/backend/config"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

// Connect устанавливает соединение с базой данных
func Connect(cfg *config.Config) (*gorm.DB, error) {
	dsn := fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=%s",
		cfg.DBHost,
		cfg.DBPort,
		cfg.DBUser,
		cfg.DBPassword,
		cfg.DBName,
		cfg.DBSSLMode,
	)

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		return nil, fmt.Errorf("ошибка подключения к базе данных: %w", err)
	}

	log.Println("Успешное подключение к базе данных")
	return db, nil
} 