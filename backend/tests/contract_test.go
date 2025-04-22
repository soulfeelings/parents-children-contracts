package tests

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/soulfeelings/parents-children-contracts/backend/config"
	"github.com/soulfeelings/parents-children-contracts/backend/database"
	"github.com/soulfeelings/parents-children-contracts/backend/handlers"
	"github.com/soulfeelings/parents-children-contracts/backend/middleware"
	"github.com/stretchr/testify/assert"
)

func setupContractTestRouter() *gin.Engine {
	gin.SetMode(gin.TestMode)
	router := gin.Default()

	// Загружаем конфигурацию
	cfg, _ := config.LoadConfig()

	// Подключаемся к тестовой базе данных
	db, _ := database.Connect(cfg)

	// Инициализируем обработчики
	contractHandlers := handlers.NewContractHandlers(db)

	// Настраиваем маршруты
	api := router.Group("/api")
	{
		contracts := api.Group("/contracts")
		contracts.Use(middleware.AuthMiddleware())
		{
			contracts.GET("/", contractHandlers.List)
			contracts.POST("/", middleware.RoleMiddleware("parent"), contractHandlers.Create)
			contracts.GET("/:id", contractHandlers.Get)
			contracts.PUT("/:id", contractHandlers.Update)
			contracts.DELETE("/:id", middleware.RoleMiddleware("parent"), contractHandlers.Delete)
		}
	}

	return router
}

func TestCreateContract(t *testing.T) {
	router := setupContractTestRouter()

	// Сначала регистрируем пользователя и получаем токен
	registerPayload := map[string]interface{}{
		"email":    "contract_test@example.com",
		"password": "password123",
		"name":     "Contract Test User",
		"username": "contracttestuser",
		"role":     "parent",
	}
	registerData, _ := json.Marshal(registerPayload)
	registerReq, _ := http.NewRequest("POST", "/api/auth/register", bytes.NewBuffer(registerData))
	registerReq.Header.Set("Content-Type", "application/json")
	registerResp := httptest.NewRecorder()
	router.ServeHTTP(registerResp, registerReq)

	var registerResponse map[string]interface{}
	json.Unmarshal(registerResp.Body.Bytes(), &registerResponse)
	token := registerResponse["token"].(string)

	tests := []struct {
		name           string
		payload        map[string]interface{}
		expectedStatus int
		expectedError  string
	}{
		{
			name: "Успешное создание контракта",
			payload: map[string]interface{}{
				"title":        "Тестовый контракт",
				"description":  "Описание тестового контракта",
				"start_date":   "2024-04-22",
				"end_date":     "2024-05-22",
				"reward_amount": 1000,
			},
			expectedStatus: http.StatusOK,
			expectedError:  "",
		},
		{
			name: "Отсутствует обязательное поле",
			payload: map[string]interface{}{
				"description":  "Описание тестового контракта",
				"start_date":   "2024-04-22",
				"end_date":     "2024-05-22",
				"reward_amount": 1000,
			},
			expectedStatus: http.StatusBadRequest,
			expectedError:  "Название контракта обязательно",
		},
		{
			name: "Неверный формат даты",
			payload: map[string]interface{}{
				"title":        "Тестовый контракт",
				"description":  "Описание тестового контракта",
				"start_date":   "invalid-date",
				"end_date":     "2024-05-22",
				"reward_amount": 1000,
			},
			expectedStatus: http.StatusBadRequest,
			expectedError:  "Неверный формат даты",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			jsonData, _ := json.Marshal(tt.payload)
			req, _ := http.NewRequest("POST", "/api/contracts", bytes.NewBuffer(jsonData))
			req.Header.Set("Content-Type", "application/json")
			req.Header.Set("Authorization", "Bearer "+token)

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
				assert.NotEmpty(t, response["id"])
				assert.Equal(t, tt.payload["title"], response["title"])
			}
		})
	}
}

func TestGetContracts(t *testing.T) {
	router := setupContractTestRouter()

	// Регистрируем пользователя и получаем токен
	registerPayload := map[string]interface{}{
		"email":    "contract_list_test@example.com",
		"password": "password123",
		"name":     "Contract List Test User",
		"username": "contractlisttestuser",
		"role":     "parent",
	}
	registerData, _ := json.Marshal(registerPayload)
	registerReq, _ := http.NewRequest("POST", "/api/auth/register", bytes.NewBuffer(registerData))
	registerReq.Header.Set("Content-Type", "application/json")
	registerResp := httptest.NewRecorder()
	router.ServeHTTP(registerResp, registerReq)

	var registerResponse map[string]interface{}
	json.Unmarshal(registerResp.Body.Bytes(), &registerResponse)
	token := registerResponse["token"].(string)

	// Создаем тестовый контракт
	contractPayload := map[string]interface{}{
		"title":        "Тестовый контракт для списка",
		"description":  "Описание тестового контракта",
		"start_date":   "2024-04-22",
		"end_date":     "2024-05-22",
		"reward_amount": 1000,
	}
	contractData, _ := json.Marshal(contractPayload)
	contractReq, _ := http.NewRequest("POST", "/api/contracts", bytes.NewBuffer(contractData))
	contractReq.Header.Set("Content-Type", "application/json")
	contractReq.Header.Set("Authorization", "Bearer "+token)
	contractResp := httptest.NewRecorder()
	router.ServeHTTP(contractResp, contractReq)

	// Тестируем получение списка контрактов
	req, _ := http.NewRequest("GET", "/api/contracts", nil)
	req.Header.Set("Authorization", "Bearer "+token)

	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)

	var response map[string]interface{}
	err := json.Unmarshal(w.Body.Bytes(), &response)
	assert.Nil(t, err)
	assert.NotNil(t, response["contracts"])
	contracts := response["contracts"].([]interface{})
	assert.GreaterOrEqual(t, len(contracts), 1)
} 