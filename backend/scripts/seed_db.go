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

	// Хешируем пароль для всех пользователей
	password, _ := bcrypt.GenerateFromPassword([]byte("123456"), bcrypt.DefaultCost)

	// Создаем родителей
	parents := []struct {
		id        uuid.UUID
		email     string
		username  string
		firstName string
		lastName  string
		phone     string
	}{
		{uuid.New(), "parent1@test.com", "parent1", "Иван", "Петров", "+7900111111"},
		{uuid.New(), "parent2@test.com", "parent2", "Мария", "Сидорова", "+7900222222"},
		{uuid.New(), "parent3@test.com", "parent3", "Алексей", "Иванов", "+7900333333"},
	}

	for _, parent := range parents {
		_, err = db.Exec(`
			INSERT INTO users (id, email, password_hash, username, first_name, last_name, phone, role, email_notifications, push_notifications, created_at, updated_at)
			VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
			ON CONFLICT (email) DO NOTHING
		`, parent.id, parent.email, password, parent.username, parent.firstName, parent.lastName, parent.phone, "parent", true, true, time.Now(), time.Now())
		if err != nil {
			log.Printf("Ошибка создания родителя %s: %v", parent.email, err)
		}
	}

	// Создаем детей
	children := []struct {
		id        uuid.UUID
		email     string
		username  string
		firstName string
		lastName  string
		phone     string
		parentID  uuid.UUID
	}{
		{uuid.New(), "child1@test.com", "child1", "Анна", "Петрова", "+7911111111", parents[0].id},
		{uuid.New(), "child2@test.com", "child2", "Павел", "Петров", "+7911222222", parents[0].id},
		{uuid.New(), "child3@test.com", "child3", "София", "Сидорова", "+7911333333", parents[1].id},
		{uuid.New(), "child4@test.com", "child4", "Михаил", "Сидоров", "+7911444444", parents[1].id},
		{uuid.New(), "child5@test.com", "child5", "Дарья", "Иванова", "+7911555555", parents[2].id},
		{uuid.New(), "child6@test.com", "child6", "Артём", "Иванов", "+7911666666", parents[2].id},
	}

	for _, child := range children {
		_, err = db.Exec(`
			INSERT INTO users (id, email, password_hash, username, first_name, last_name, phone, role, email_notifications, push_notifications, created_at, updated_at)
			VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
			ON CONFLICT (email) DO NOTHING
		`, child.id, child.email, password, child.username, child.firstName, child.lastName, child.phone, "child", true, true, time.Now(), time.Now())
		if err != nil {
			log.Printf("Ошибка создания ребенка %s: %v", child.email, err)
		}

		// Создаем контракт для каждого ребенка
		contractID := uuid.New()
		_, err = db.Exec(`
			INSERT INTO contracts (id, parent_id, child_id, title, description, status, start_date, end_date, created_at, updated_at)
			VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
			ON CONFLICT DO NOTHING
		`, contractID, child.parentID, child.id, "Домашние обязанности", "Выполнение домашних обязанностей на неделю", "active", time.Now(), time.Now().AddDate(0, 1, 0), time.Now(), time.Now())
		if err != nil {
			log.Printf("Ошибка создания контракта для ребенка %s: %v", child.email, err)
		}

		// Создаем задачи для контракта
		tasks := []struct {
			title       string
			description string
			status      string
			points      int
		}{
			{"Помыть посуду", "Помыть всю посуду после ужина", "pending", 10},
			{"Сделать уроки", "Выполнить домашнее задание по математике", "completed", 20},
			{"Убрать комнату", "Провести полную уборку в своей комнате", "failed", 30},
		}

		for _, task := range tasks {
			_, err = db.Exec(`
				INSERT INTO tasks (id, contract_id, title, description, status, points, due_date, created_at, updated_at)
				VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
			`, uuid.New(), contractID, task.title, task.description, task.status, task.points, time.Now().AddDate(0, 0, 7), time.Now(), time.Now())
			if err != nil {
				log.Printf("Ошибка создания задачи %s: %v", task.title, err)
			}
		}

		// Создаем награды для контракта
		rewards := []struct {
			title       string
			description string
			points      int
			status      string
		}{
			{"Поход в кино", "Поход в кино на любой фильм", 50, "available"},
			{"Новая игра", "Любая игра на выбор до 2000р", 100, "claimed"},
			{"Карманные деньги", "Дополнительные карманные деньги на неделю", 150, "completed"},
		}

		for _, reward := range rewards {
			_, err = db.Exec(`
				INSERT INTO rewards (id, contract_id, title, description, points, status, created_at, updated_at)
				VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
			`, uuid.New(), contractID, reward.title, reward.description, reward.points, reward.status, time.Now(), time.Now())
			if err != nil {
				log.Printf("Ошибка создания награды %s: %v", reward.title, err)
			}
		}
	}

	log.Println("База данных успешно заполнена тестовыми данными")
} 