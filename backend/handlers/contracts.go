package handlers

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/soulfeelings/parents-children-contracts/backend/models"
	"gorm.io/gorm"
)

type CreateContractRequest struct {
	Title       string    `json:"title" binding:"required"`
	Description string    `json:"description"`
	ChildID     uint      `json:"child_id" binding:"required"`
	StartDate   time.Time `json:"start_date" binding:"required"`
	EndDate     time.Time `json:"end_date" binding:"required"`
}

type UpdateContractRequest struct {
	Title       string    `json:"title"`
	Description string    `json:"description"`
	Status      string    `json:"status" binding:"omitempty,oneof=active completed terminated"`
	StartDate   time.Time `json:"start_date"`
	EndDate     time.Time `json:"end_date"`
}

type ContractResponse struct {
	Contract models.Contract `json:"contract"`
}

type ContractsResponse struct {
	Contracts []models.Contract `json:"contracts"`
	Total     int64            `json:"total"`
}

func NewContractHandlers(db *gorm.DB) *ContractHandlers {
	return &ContractHandlers{db: db}
}

type ContractHandlers struct {
	db *gorm.DB
}

// Создание нового контракта
func (h *ContractHandlers) Create(c *gin.Context) {
	var req CreateContractRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Получаем ID родителя из контекста (установленного middleware)
	parentID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Пользователь не авторизован"})
		return
	}

	// Проверяем существование ребенка
	var child models.User
	if err := h.db.Where("id = ? AND role = ?", req.ChildID, "child").First(&child).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Ребенок не найден"})
		return
	}

	contract := models.Contract{
		Title:       req.Title,
		Description: req.Description,
		ParentID:    parentID.(uint),
		ChildID:     req.ChildID,
		Status:      "active",
		StartDate:   req.StartDate,
		EndDate:     req.EndDate,
		CreatedAt:   time.Now(),
		UpdatedAt:   time.Now(),
	}

	if result := h.db.Create(&contract); result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Ошибка при создании контракта"})
		return
	}

	// Загружаем связанные данные
	h.db.Preload("Parent").Preload("Child").First(&contract, contract.ID)

	c.JSON(http.StatusCreated, ContractResponse{Contract: contract})
}

// Получение списка контрактов
func (h *ContractHandlers) List(c *gin.Context) {
	userID, _ := c.Get("user_id")
	role, _ := c.Get("role")

	query := h.db.Model(&models.Contract{})

	// Фильтруем контракты в зависимости от роли пользователя
	if role == "parent" {
		query = query.Where("parent_id = ?", userID)
	} else {
		query = query.Where("child_id = ?", userID)
	}

	var total int64
	query.Count(&total)

	var contracts []models.Contract
	result := query.Preload("Parent").Preload("Child").
		Preload("Tasks").Preload("Rewards").
		Order("created_at desc").
		Find(&contracts)

	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Ошибка при получении контрактов"})
		return
	}

	c.JSON(http.StatusOK, ContractsResponse{
		Contracts: contracts,
		Total:     total,
	})
}

// Получение контракта по ID
func (h *ContractHandlers) Get(c *gin.Context) {
	id := c.Param("id")
	userID, _ := c.Get("user_id")
	role, _ := c.Get("role")

	var contract models.Contract
	query := h.db.Preload("Parent").Preload("Child").
		Preload("Tasks").Preload("Rewards")

	if role == "parent" {
		query = query.Where("id = ? AND parent_id = ?", id, userID)
	} else {
		query = query.Where("id = ? AND child_id = ?", id, userID)
	}

	if err := query.First(&contract).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Контракт не найден"})
		return
	}

	c.JSON(http.StatusOK, ContractResponse{Contract: contract})
}

// Обновление контракта
func (h *ContractHandlers) Update(c *gin.Context) {
	id := c.Param("id")
	userID, _ := c.Get("user_id")
	role, _ := c.Get("role")

	var contract models.Contract
	query := h.db

	if role == "parent" {
		query = query.Where("id = ? AND parent_id = ?", id, userID)
	} else {
		query = query.Where("id = ? AND child_id = ?", id, userID)
	}

	if err := query.First(&contract).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Контракт не найден"})
		return
	}

	var req UpdateContractRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Обновляем только разрешенные поля в зависимости от роли
	updates := make(map[string]interface{})
	if role == "parent" {
		if req.Title != "" {
			updates["title"] = req.Title
		}
		if req.Description != "" {
			updates["description"] = req.Description
		}
		if !req.StartDate.IsZero() {
			updates["start_date"] = req.StartDate
		}
		if !req.EndDate.IsZero() {
			updates["end_date"] = req.EndDate
		}
	}
	
	// Статус могут менять оба (и родитель, и ребенок)
	if req.Status != "" {
		updates["status"] = req.Status
	}

	updates["updated_at"] = time.Now()

	if err := h.db.Model(&contract).Updates(updates).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Ошибка при обновлении контракта"})
		return
	}

	// Загружаем обновленные данные
	h.db.Preload("Parent").Preload("Child").
		Preload("Tasks").Preload("Rewards").
		First(&contract, contract.ID)

	c.JSON(http.StatusOK, ContractResponse{Contract: contract})
}

// Удаление контракта
func (h *ContractHandlers) Delete(c *gin.Context) {
	id := c.Param("id")
	userID, _ := c.Get("user_id")
	role, _ := c.Get("role")

	if role != "parent" {
		c.JSON(http.StatusForbidden, gin.H{"error": "Только родитель может удалять контракты"})
		return
	}

	var contract models.Contract
	if err := h.db.Where("id = ? AND parent_id = ?", id, userID).First(&contract).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Контракт не найден"})
		return
	}

	// Используем soft delete (благодаря gorm.DeletedAt в модели)
	if err := h.db.Delete(&contract).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Ошибка при удалении контракта"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Контракт успешно удален"})
} 