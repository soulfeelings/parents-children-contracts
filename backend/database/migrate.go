package database

import (
	"fmt"
	"log"
	"os"
	"path/filepath"
	"strings"

	"github.com/golang-migrate/migrate/v4"
	_ "github.com/golang-migrate/migrate/v4/database/postgres"
	_ "github.com/golang-migrate/migrate/v4/source/file"
	"github.com/soulfeelings/parents-children-contracts/backend/config"
)

// RunMigrations выполняет миграции базы данных
func RunMigrations(cfg *config.Config) error {
	// Создаем директорию для миграций, если она не существует
	if err := os.MkdirAll(cfg.MigrationPath, 0755); err != nil {
		return fmt.Errorf("ошибка создания директории миграций: %v", err)
	}

	// Формируем путь к файлам миграций
	migrationPath := fmt.Sprintf("file://%s", cfg.MigrationPath)

	// Создаем экземпляр migrate
	m, err := migrate.New(migrationPath, cfg.GetDSN())
	if err != nil {
		return fmt.Errorf("ошибка создания экземпляра migrate: %v", err)
	}
	defer m.Close()

	// Выполняем миграции
	if err := m.Up(); err != nil && err != migrate.ErrNoChange {
		return fmt.Errorf("ошибка при применении миграций базы данных: %v", err)
	}

	log.Println("Миграции успешно выполнены")
	return nil
}

// CreateMigration создает новый файл миграции
func CreateMigration(cfg *config.Config, name string) error {
	// Форматируем имя файла
	name = strings.ToLower(name)
	name = strings.ReplaceAll(name, " ", "_")

	// Создаем временные файлы для up и down миграций
	upFile := filepath.Join(cfg.MigrationPath, fmt.Sprintf("%s.up.sql", name))
	downFile := filepath.Join(cfg.MigrationPath, fmt.Sprintf("%s.down.sql", name))

	// Создаем файлы
	if err := os.WriteFile(upFile, []byte("-- Write your up migration here\n"), 0644); err != nil {
		return fmt.Errorf("ошибка создания up миграции: %v", err)
	}

	if err := os.WriteFile(downFile, []byte("-- Write your down migration here\n"), 0644); err != nil {
		return fmt.Errorf("ошибка создания down миграции: %v", err)
	}

	log.Printf("Созданы файлы миграций: %s и %s\n", upFile, downFile)
	return nil
}

// RollbackMigration откатывает последнюю миграцию
func RollbackMigration(cfg *config.Config) error {
	m, err := migrate.New(fmt.Sprintf("file://%s", cfg.MigrationPath), cfg.GetDSN())
	if err != nil {
		return fmt.Errorf("ошибка создания экземпляра migrate: %v", err)
	}
	defer m.Close()

	if err := m.Steps(-1); err != nil {
		return fmt.Errorf("ошибка отката миграции: %v", err)
	}

	log.Println("Миграция успешно откачена")
	return nil
} 