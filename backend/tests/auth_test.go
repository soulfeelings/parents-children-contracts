package tests

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"os"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/soulfeelings/parents-children-contracts/backend/config"
	"github.com/soulfeelings/parents-children-contracts/backend/database"
	"github.com/soulfeelings/parents-children-contracts/backend/handlers"
	"github.com/stretchr/testify/assert"
)

func init() {
	// Устанавливаем тестовое окружение
	os.Setenv("APP_ENV", "test")
}

func setupTestRouter() *gin.Engine {
	gin.SetMode(gin.TestMode)
	router := gin.Default()

	// Загружаем конфигурацию
	cfg, err := config.LoadConfig()
	if err != nil {
		panic(err)
	}

	// Подключаемся к тестовой базе данных
	db, err := database.Connect(cfg)
	if err != nil {
		panic(err)
	}

	// Применяем миграции
	if err := database.RunMigrations(cfg); err != nil {
		panic(err)
	}

	// Инициализируем обработчики
	authHandlers := handlers.NewAuthHandlers(db)

	// Настраиваем маршруты
	api := router.Group("/api")
	{
		auth := api.Group("/auth")
		{
			auth.POST("/register", authHandlers.Register)
			auth.POST("/login", authHandlers.Login)
		}
	}

	return router
}

func TestRegister(t *testing.T) {
	router := setupTestRouter()

	tests := []struct {
		name           string
		payload        map[string]interface{}
		expectedStatus int
		expectedError  string
	}{
		{
			name: "Успешная регистрация",
			payload: map[string]interface{}{
				"email":    "test@example.com",
				"password": "password123",
				"name":     "Test User",
				"username": "testuser",
				"role":     "parent",
			},
			expectedStatus: http.StatusOK,
			expectedError:  "",
		},
		{
			name: "Дублирование email",
			payload: map[string]interface{}{
				"email":    "test@example.com",
				"password": "password123",
				"name":     "Test User 2",
				"username": "testuser2",
				"role":     "parent",
			},
			expectedStatus: http.StatusBadRequest,
			expectedError:  "Пользователь с таким email или username уже существует",
		},
		{
			name: "Неверный формат email",
			payload: map[string]interface{}{
				"email":    "invalid-email",
				"password": "password123",
				"name":     "Test User",
				"username": "testuser3",
				"role":     "parent",
			},
			expectedStatus: http.StatusBadRequest,
			expectedError:  "Неверный формат email",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			jsonData, _ := json.Marshal(tt.payload)
			req, _ := http.NewRequest("POST", "/api/auth/register", bytes.NewBuffer(jsonData))
			req.Header.Set("Content-Type", "application/json")

			w := httptest.NewRecorder()
			router.ServeHTTP(w, req)

			assert.Equal(t, tt.expectedStatus, w.Code)

			if tt.expectedError != "" {
				var response map[string]string
				err := json.Unmarshal(w.Body.Bytes(), &response)
				assert.Nil(t, err)
				assert.Equal(t, tt.expectedError, response["error"])
			} else {
				var response map[string]interface{}
				err := json.Unmarshal(w.Body.Bytes(), &response)
				assert.Nil(t, err)
				assert.NotEmpty(t, response["token"])
				assert.NotEmpty(t, response["user"])
			}
		})
	}
}

func TestLogin(t *testing.T) {
	router := setupTestRouter()

	tests := []struct {
		name           string
		payload        map[string]interface{}
		expectedStatus int
		expectedError  string
	}{
		{
			name: "Успешный вход",
			payload: map[string]interface{}{
				"email":    "test@example.com",
				"password": "password123",
			},
			expectedStatus: http.StatusOK,
			expectedError:  "",
		},
		{
			name: "Неверный пароль",
			payload: map[string]interface{}{
				"email":    "test@example.com",
				"password": "wrongpassword",
			},
			expectedStatus: http.StatusUnauthorized,
			expectedError:  "Неверный email или пароль",
		},
		{
			name: "Несуществующий пользователь",
			payload: map[string]interface{}{
				"email":    "nonexistent@example.com",
				"password": "password123",
			},
			expectedStatus: http.StatusUnauthorized,
			expectedError:  "Неверный email или пароль",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			jsonData, _ := json.Marshal(tt.payload)
			req, _ := http.NewRequest("POST", "/api/auth/login", bytes.NewBuffer(jsonData))
			req.Header.Set("Content-Type", "application/json")

			w := httptest.NewRecorder()
			router.ServeHTTP(w, req)

			assert.Equal(t, tt.expectedStatus, w.Code)

			if tt.expectedError != "" {
				var response map[string]string
				err := json.Unmarshal(w.Body.Bytes(), &response)
				assert.Nil(t, err)
				assert.Equal(t, tt.expectedError, response["error"])
			} else {
				var response map[string]interface{}
				err := json.Unmarshal(w.Body.Bytes(), &response)
				assert.Nil(t, err)
				assert.NotEmpty(t, response["token"])
				assert.NotEmpty(t, response["user"])
			}
		})
	}
} 