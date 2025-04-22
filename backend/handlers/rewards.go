package handlers

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/soulfeelings/parents-children-contracts/backend/models"
	"gorm.io/gorm"
)

type CreateRewardRequest struct {
	Title       string `json:"title" binding:"required"`
	Description string `json:"description"`
	ContractID  string `json:"contract_id" binding:"required"`
	Points      int    `json:"points" binding:"required,min=0"`
}

type UpdateRewardRequest struct {
	Title       string `json:"title"`
	Description string `json:"description"`
	Points      int    `json:"points" binding:"omitempty,min=0"`
	Status      string `json:"status" binding:"omitempty,oneof=available claimed completed"`
}

type RewardResponse struct {
	Reward models.Reward `json:"reward"`
}

type RewardsResponse struct {
	Rewards []models.Reward `json:"rewards"`
	Total   int64          `json:"total"`
}

func NewRewardHandlers(db *gorm.DB) *RewardHandlers {
	return &RewardHandlers{db: db}
}

type RewardHandlers struct {
	db *gorm.DB
}

// Создание новой награды
func (h *RewardHandlers) Create(c *gin.Context) {
	var req CreateRewardRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Проверяем существование контракта и права доступа
	var contract models.Contract
	userID, _ := c.Get("user_id")
	if err := h.db.Where("id = ? AND parent_id = ?", req.ContractID, userID).First(&contract).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Контракт не найден или недостаточно прав"})
		return
	}

	// Проверяем статус контракта
	if contract.Status != "active" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Нельзя добавлять награды в неактивный контракт"})
		return
	}

	reward := models.Reward{
		Title:       req.Title,
		Description: req.Description,
		ContractID:  req.ContractID,
		PointsCost:  req.Points,
		Status:      "available",
		CreatedAt:   time.Now(),
		UpdatedAt:   time.Now(),
	}

	if result := h.db.Create(&reward); result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Ошибка при создании награды"})
		return
	}

	// Загружаем связанные данные
	h.db.Preload("Contract").First(&reward, reward.ID)

	c.JSON(http.StatusCreated, RewardResponse{Reward: reward})
}

// Получение списка наград
func (h *RewardHandlers) List(c *gin.Context) {
	userID, _ := c.Get("user_id")
	role, _ := c.Get("role")
	status := c.Query("status")

	query := h.db.Model(&models.Reward{}).
		Joins("Contract").
		Where("Contract.deleted_at IS NULL")

	// Фильтруем награды в зависимости от роли пользователя
	if role == "parent" {
		query = query.Where("Contract.parent_id = ?", userID)
	} else {
		query = query.Where("Contract.child_id = ?", userID)
	}

	// Фильтруем по статусу, если указан
	if status != "" {
		query = query.Where("rewards.status = ?", status)
	}

	var total int64
	query.Count(&total)

	var rewards []models.Reward
	result := query.Preload("Contract").
		Order("created_at desc").
		Find(&rewards)

	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Ошибка при получении наград"})
		return
	}

	c.JSON(http.StatusOK, RewardsResponse{
		Rewards: rewards,
		Total:   total,
	})
}

// Получение награды по ID
func (h *RewardHandlers) Get(c *gin.Context) {
	id := c.Param("id")
	userID, _ := c.Get("user_id")
	role, _ := c.Get("role")

	var reward models.Reward
	query := h.db.Preload("Contract").
		Joins("Contract").
		Where("rewards.id = ?", id)

	if role == "parent" {
		query = query.Where("Contract.parent_id = ?", userID)
	} else {
		query = query.Where("Contract.child_id = ?", userID)
	}

	if err := query.First(&reward).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Награда не найдена"})
		return
	}

	c.JSON(http.StatusOK, RewardResponse{Reward: reward})
}

// Обновление награды
func (h *RewardHandlers) Update(c *gin.Context) {
	id := c.Param("id")
	userID, _ := c.Get("user_id")
	role, _ := c.Get("role")

	var reward models.Reward
	query := h.db.Preload("Contract").
		Joins("Contract").
		Where("rewards.id = ?", id)

	if role == "parent" {
		query = query.Where("Contract.parent_id = ?", userID)
	} else {
		query = query.Where("Contract.child_id = ?", userID)
	}

	if err := query.First(&reward).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Награда не найдена"})
		return
	}

	var req UpdateRewardRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Проверяем, что контракт активен
	if reward.Contract.Status != "active" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Нельзя изменять награды в неактивном контракте"})
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
		if req.Points > 0 {
			updates["points"] = req.Points
		}
	}

	// Статус могут менять оба (и родитель, и ребенок)
	if req.Status != "" {
		// Ребенок может только запрашивать награды
		if role == "child" && req.Status != "claimed" {
			c.JSON(http.StatusForbidden, gin.H{"error": "Ребенок может только запрашивать награды"})
			return
		}
		// Родитель может только подтверждать или отклонять запросы
		if role == "parent" && req.Status != "completed" {
			c.JSON(http.StatusForbidden, gin.H{"error": "Родитель может только подтверждать награды"})
			return
		}
		updates["status"] = req.Status
	}

	updates["updated_at"] = time.Now()

	if err := h.db.Model(&reward).Updates(updates).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Ошибка при обновлении награды"})
		return
	}

	// Перезагружаем данные награды
	h.db.Preload("Contract").First(&reward, reward.ID)

	c.JSON(http.StatusOK, RewardResponse{Reward: reward})
}

// Удаление награды
func (h *RewardHandlers) Delete(c *gin.Context) {
	id := c.Param("id")
	userID, _ := c.Get("user_id")

	var reward models.Reward
	if err := h.db.Preload("Contract").
		Joins("Contract").
		Where("rewards.id = ? AND Contract.parent_id = ?", id, userID).
		First(&reward).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Награда не найдена"})
		return
	}

	// Проверяем, что контракт активен
	if reward.Contract.Status != "active" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Нельзя удалять награды из неактивного контракта"})
		return
	}

	// Используем soft delete (благодаря gorm.DeletedAt в модели)
	if err := h.db.Delete(&reward).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Ошибка при удалении награды"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Награда успешно удалена"})
} 