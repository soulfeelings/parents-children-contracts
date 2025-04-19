package database

import (
	"fmt"
	"os"
)

// Config содержит конфигурацию подключения к базе данных
type Config struct {
	Host     string
	Port     string
	User     string
	Password string
	DBName   string
	SSLMode  string
}

// DefaultConfig возвращает конфигурацию по умолчанию
func DefaultConfig() *Config {
	return &Config{
		Host:     getEnv("DB_HOST", "localhost"),
		Port:     getEnv("DB_PORT", "5432"),
		User:     getEnv("DB_USER", "postgres"),
		Password: getEnv("DB_PASSWORD", "postgres"),
		DBName:   getEnv("DB_NAME", "parents_children_dev"),
		SSLMode:  "disable",
	}
}

// ConnectionString возвращает строку подключения к базе данных
func (c *Config) ConnectionString() string {
	return fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=%s",
		c.Host, c.Port, c.User, c.Password, c.DBName, c.SSLMode)
}

// ConnectionStringWithoutDB возвращает строку подключения без указания базы данных
func (c *Config) ConnectionStringWithoutDB() string {
	return fmt.Sprintf("host=%s port=%s user=%s password=%s sslmode=%s",
		c.Host, c.Port, c.User, c.Password, c.SSLMode)
}

// getEnv возвращает значение переменной окружения или значение по умолчанию
func getEnv(key, defaultValue string) string {
	value := os.Getenv(key)
	if value == "" {
		return defaultValue
	}
	return value
} 