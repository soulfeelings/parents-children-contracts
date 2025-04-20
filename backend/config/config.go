package config

import (
	"fmt"
	"os"
	"path/filepath"
	"time"

	"github.com/joho/godotenv"
)

type Config struct {
	DBHost         string
	DBPort         string
	DBUser         string
	DBPassword     string
	DBName         string
	DBSSLMode      string
	JWTSecret      string
	JWTExpiration  time.Duration
	ServerPort     string
	Environment    string
	MigrationPath  string
}

func LoadConfig() (*Config, error) {
	// Определяем окружение
	env := os.Getenv("APP_ENV")
	if env == "" {
		env = "development"
	}

	// Загружаем соответствующий .env файл
	envFile := fmt.Sprintf(".env.%s", env)
	if err := godotenv.Load(envFile); err != nil {
		// Если файл не найден, пробуем загрузить общий .env
		if err := godotenv.Load(); err != nil {
			return nil, fmt.Errorf("ошибка загрузки .env файла: %v", err)
		}
	}

	// Получаем путь к директории с миграциями
	migrationPath := os.Getenv("MIGRATION_PATH")
	if migrationPath == "" {
		// По умолчанию используем директорию migrations в корне проекта
		projectRoot, err := os.Getwd()
		if err != nil {
			return nil, fmt.Errorf("ошибка получения пути к проекту: %v", err)
		}
		migrationPath = filepath.Join(projectRoot, "migrations")
	}

	// Парсим время жизни JWT токена
	jwtExpiration := os.Getenv("JWT_EXPIRATION")
	if jwtExpiration == "" {
		jwtExpiration = "24h"
	}
	expiration, err := time.ParseDuration(jwtExpiration)
	if err != nil {
		return nil, fmt.Errorf("ошибка парсинга JWT_EXPIRATION: %v", err)
	}

	config := &Config{
		DBHost:        os.Getenv("DB_HOST"),
		DBPort:        os.Getenv("DB_PORT"),
		DBUser:        os.Getenv("DB_USER"),
		DBPassword:    os.Getenv("DB_PASSWORD"),
		DBName:        os.Getenv("DB_NAME"),
		DBSSLMode:     os.Getenv("DB_SSL_MODE"),
		JWTSecret:     os.Getenv("JWT_SECRET"),
		JWTExpiration: expiration,
		ServerPort:    os.Getenv("PORT"),
		Environment:   env,
		MigrationPath: migrationPath,
	}

	// Проверяем обязательные параметры
	if config.DBHost == "" || config.DBPort == "" || config.DBUser == "" || config.DBName == "" {
		return nil, fmt.Errorf("отсутствуют обязательные параметры конфигурации базы данных")
	}

	if config.JWTSecret == "" {
		return nil, fmt.Errorf("отсутствует JWT_SECRET")
	}

	if config.ServerPort == "" {
		config.ServerPort = "8080"
	}

	if config.DBSSLMode == "" {
		config.DBSSLMode = "disable"
	}

	return config, nil
}

// GetDSN возвращает строку подключения к базе данных
func (c *Config) GetDSN() string {
	return fmt.Sprintf("postgres://%s:%s@%s:%s/%s?sslmode=%s",
		c.DBUser, c.DBPassword, c.DBHost, c.DBPort, c.DBName, c.DBSSLMode)
} 