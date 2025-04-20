package database

import (
	"database/sql"
	"fmt"
	"log"
	"os"
	"path/filepath"

	_ "github.com/lib/pq"
)

// Connect устанавливает соединение с базой данных
func Connect(config *Config) (*sql.DB, error) {
	db, err := sql.Open("postgres", config.URL())
	if err != nil {
		return nil, fmt.Errorf("ошибка подключения к базе данных: %v", err)
	}

	if err := db.Ping(); err != nil {
		return nil, fmt.Errorf("ошибка проверки подключения к базе данных: %v", err)
	}

	return db, nil
}

// ConnectWithoutDB устанавливает соединение с PostgreSQL без указания базы данных
func ConnectWithoutDB(config *Config) (*sql.DB, error) {
	db, err := sql.Open("postgres", config.URLWithoutDB())
	if err != nil {
		return nil, fmt.Errorf("ошибка подключения к PostgreSQL: %v", err)
	}

	if err := db.Ping(); err != nil {
		return nil, fmt.Errorf("ошибка проверки подключения к PostgreSQL: %v", err)
	}

	return db, nil
}

// CreateDatabase создает базу данных, если она не существует
func CreateDatabase(config *Config) error {
	db, err := ConnectWithoutDB(config)
	if err != nil {
		return err
	}
	defer db.Close()

	_, err = db.Exec(fmt.Sprintf("CREATE DATABASE %s", config.DBName))
	if err != nil {
		log.Printf("База данных %s уже существует или произошла ошибка: %v", config.DBName, err)
	} else {
		log.Printf("База данных %s успешно создана", config.DBName)
	}

	return nil
}

// CreateUUIDExtension создает расширение для UUID
func CreateUUIDExtension(db *sql.DB) error {
	_, err := db.Exec("CREATE EXTENSION IF NOT EXISTS \"uuid-ossp\"")
	if err != nil {
		return fmt.Errorf("ошибка создания расширения uuid-ossp: %v", err)
	}
	log.Println("Расширение uuid-ossp успешно создано")
	return nil
}

// ExecuteSQLFile выполняет SQL-запросы из файла
func ExecuteSQLFile(db *sql.DB, filePath string) error {
	content, err := os.ReadFile(filePath)
	if err != nil {
		return fmt.Errorf("ошибка чтения файла %s: %v", filePath, err)
	}

	_, err = db.Exec(string(content))
	if err != nil {
		return fmt.Errorf("ошибка выполнения SQL-запросов из файла %s: %v", filePath, err)
	}

	return nil
}

// ExecuteSQLFiles выполняет SQL-запросы из всех .sql файлов в директории
func ExecuteSQLFiles(db *sql.DB, dirPath string) error {
	files, err := os.ReadDir(dirPath)
	if err != nil {
		return fmt.Errorf("ошибка чтения директории %s: %v", dirPath, err)
	}

	for _, file := range files {
		if filepath.Ext(file.Name()) != ".sql" {
			continue
		}

		log.Printf("Применение миграции: %s", file.Name())
		
		err := ExecuteSQLFile(db, filepath.Join(dirPath, file.Name()))
		if err != nil {
			return fmt.Errorf("ошибка выполнения миграции %s: %v", file.Name(), err)
		}

		log.Printf("Миграция %s успешно применена", file.Name())
	}

	return nil
} 