package main

import (
	"log"
	"time"

	"github.com/google/uuid"
	"github.com/soulfeelings/parents-children-contracts/backend/internal/database"
	"golang.org/x/crypto/bcrypt"
)

func main() {
	config := database.DefaultConfig()

	// Подключаемся к базе данных
	db, err := database.Connect(config)
	if err != nil {
		log.Fatalf("Ошибка подключения к базе данных: %v", err)
	}
	defer db.Close()

	// Создаем тестовых пользователей
	parentID := uuid.New()
	childID := uuid.New()

	// Хешируем пароли
	parentPassword, _ := bcrypt.GenerateFromPassword([]byte("parent123"), bcrypt.DefaultCost)
	childPassword, _ := bcrypt.GenerateFromPassword([]byte("child123"), bcrypt.DefaultCost)

	// Вставляем родителя
	_, err = db.Exec(`
		INSERT INTO users (id, email, password_hash, role, created_at, updated_at)
		VALUES ($1, $2, $3, $4, $5, $6)
		ON CONFLICT (email) DO NOTHING
	`, parentID, "parent@example.com", parentPassword, "parent", time.Now(), time.Now())
	if err != nil {
		log.Printf("Ошибка создания родителя: %v", err)
	}

	// Вставляем ребенка
	_, err = db.Exec(`
		INSERT INTO users (id, email, password_hash, role, created_at, updated_at)
		VALUES ($1, $2, $3, $4, $5, $6)
		ON CONFLICT (email) DO NOTHING
	`, childID, "child@example.com", childPassword, "child", time.Now(), time.Now())
	if err != nil {
		log.Printf("Ошибка создания ребенка: %v", err)
	}

	// Создаем тестовый контракт
	contractID := uuid.New()
	_, err = db.Exec(`
		INSERT INTO contracts (id, parent_id, child_id, title, description, status, created_at, updated_at)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
		ON CONFLICT DO NOTHING
	`, contractID, parentID, childID, "Тестовый контракт", "Описание тестового контракта", "active", time.Now(), time.Now())
	if err != nil {
		log.Printf("Ошибка создания контракта: %v", err)
	}

	// Создаем тестовые задачи
	taskIDs := []uuid.UUID{
		uuid.New(),
		uuid.New(),
		uuid.New(),
	}

	tasks := []struct {
		id          uuid.UUID
		title       string
		description string
		status      string
		reward      float64
	}{
		{taskIDs[0], "Убрать комнату", "Пропылесосить и протереть пыль", "pending", 100},
		{taskIDs[1], "Сделать домашнее задание", "Математика и русский язык", "completed", 200},
		{taskIDs[2], "Помыть посуду", "Помыть всю посуду после ужина", "failed", 50},
	}

	for _, task := range tasks {
		_, err = db.Exec(`
			INSERT INTO tasks (id, contract_id, title, description, status, reward, created_at, updated_at)
			VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
		`, task.id, contractID, task.title, task.description, task.status, task.reward, time.Now(), time.Now())
		if err != nil {
			log.Printf("Ошибка создания задачи %s: %v", task.title, err)
		}
	}

	log.Println("База данных успешно заполнена тестовыми данными")
} 