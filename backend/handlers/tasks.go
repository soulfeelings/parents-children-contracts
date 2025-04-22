package handlers

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/soulfeelings/parents-children-contracts/backend/models"
	"gorm.io/gorm"
)

type CreateTaskRequest struct {
	Title       string    `json:"title" binding:"required"`
	Description string    `json:"description"`
	ContractID  string    `json:"contract_id" binding:"required"`
	Points      int       `json:"points" binding:"required,min=0"`
	DueDate     time.Time `json:"due_date" binding:"required"`
}

type UpdateTaskRequest struct {
	Title       string    `json:"title"`
	Description string    `json:"description"`
	Status      string    `json:"status" binding:"omitempty,oneof=pending completed failed"`
	Points      int       `json:"points" binding:"omitempty,min=0"`
	DueDate     time.Time `json:"due_date"`
}

type TaskResponse struct {
	Task models.Task `json:"task"`
}

type TasksResponse struct {
	Tasks []models.Task `json:"tasks"`
	Total int64        `json:"total"`
}

func NewTaskHandlers(db *gorm.DB) *TaskHandlers {
	return &TaskHandlers{db: db}
}

type TaskHandlers struct {
	db *gorm.DB
}

// Создание новой задачи
func (h *TaskHandlers) Create(c *gin.Context) {
	var req CreateTaskRequest
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
		c.JSON(http.StatusBadRequest, gin.H{"error": "Нельзя добавлять задачи в неактивный контракт"})
		return
	}

	task := models.Task{
		Title:       req.Title,
		Description: req.Description,
		ContractID:  req.ContractID,
		Points:      req.Points,
		Status:      "pending",
		DueDate:     req.DueDate,
		CreatedAt:   time.Now(),
		UpdatedAt:   time.Now(),
	}

	if result := h.db.Create(&task); result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Ошибка при создании задачи"})
		return
	}

	// Загружаем связанные данные
	h.db.Preload("Contract").First(&task, task.ID)

	c.JSON(http.StatusCreated, TaskResponse{Task: task})
}

// Получение списка задач
func (h *TaskHandlers) List(c *gin.Context) {
	userID, _ := c.Get("user_id")
	role, _ := c.Get("role")
	status := c.Query("status")

	query := h.db.Model(&models.Task{}).
		Joins("Contract").
		Where("Contract.deleted_at IS NULL")

	// Фильтруем задачи в зависимости от роли пользователя
	if role == "parent" {
		query = query.Where("Contract.parent_id = ?", userID)
	} else {
		query = query.Where("Contract.child_id = ?", userID)
	}

	// Фильтруем по статусу, если указан
	if status != "" {
		query = query.Where("tasks.status = ?", status)
	}

	var total int64
	query.Count(&total)

	var tasks []models.Task
	result := query.Preload("Contract").
		Order("due_date asc").
		Find(&tasks)

	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Ошибка при получении задач"})
		return
	}

	c.JSON(http.StatusOK, TasksResponse{
		Tasks: tasks,
		Total: total,
	})
}

// Получение задачи по ID
func (h *TaskHandlers) Get(c *gin.Context) {
	id := c.Param("id")
	userID, _ := c.Get("user_id")
	role, _ := c.Get("role")

	var task models.Task
	query := h.db.Preload("Contract").
		Joins("Contract").
		Where("tasks.id = ?", id)

	if role == "parent" {
		query = query.Where("Contract.parent_id = ?", userID)
	} else {
		query = query.Where("Contract.child_id = ?", userID)
	}

	if err := query.First(&task).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Задача не найдена"})
		return
	}

	c.JSON(http.StatusOK, TaskResponse{Task: task})
}

// Обновление задачи
func (h *TaskHandlers) Update(c *gin.Context) {
	id := c.Param("id")
	userID, _ := c.Get("user_id")
	role, _ := c.Get("role")

	var task models.Task
	query := h.db.Preload("Contract").
		Joins("Contract").
		Where("tasks.id = ?", id)

	if role == "parent" {
		query = query.Where("Contract.parent_id = ?", userID)
	} else {
		query = query.Where("Contract.child_id = ?", userID)
	}

	if err := query.First(&task).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Задача не найдена"})
		return
	}

	var req UpdateTaskRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Проверяем, что контракт активен
	if task.Contract.Status != "active" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Нельзя изменять задачи в неактивном контракте"})
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
		if !req.DueDate.IsZero() {
			updates["due_date"] = req.DueDate
		}
	}

	// Статус могут менять оба (и родитель, и ребенок)
	if req.Status != "" {
		// Ребенок может только отмечать задачи как выполненные
		if role == "child" && req.Status != "completed" {
			c.JSON(http.StatusForbidden, gin.H{"error": "Ребенок может только отмечать задачи как выполненные"})
			return
		}
		updates["status"] = req.Status
	}

	updates["updated_at"] = time.Now()

	if err := h.db.Model(&task).Updates(updates).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Ошибка при обновлении задачи"})
		return
	}

	// Перезагружаем данные задачи
	h.db.Preload("Contract").First(&task, task.ID)

	c.JSON(http.StatusOK, TaskResponse{Task: task})
}

// Удаление задачи
func (h *TaskHandlers) Delete(c *gin.Context) {
	id := c.Param("id")
	userID, _ := c.Get("user_id")

	var task models.Task
	if err := h.db.Preload("Contract").
		Joins("Contract").
		Where("tasks.id = ? AND Contract.parent_id = ?", id, userID).
		First(&task).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Задача не найдена"})
		return
	}

	// Проверяем, что контракт активен
	if task.Contract.Status != "active" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Нельзя удалять задачи из неактивного контракта"})
		return
	}

	// Используем soft delete (благодаря gorm.DeletedAt в модели)
	if err := h.db.Delete(&task).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Ошибка при удалении задачи"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Задача успешно удалена"})
} 