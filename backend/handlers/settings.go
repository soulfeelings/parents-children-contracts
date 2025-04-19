package handlers

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/soulfeelings/parents-children-contracts/models"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

type UpdateProfileRequest struct {
	FirstName string `json:"first_name"`
	LastName  string `json:"last_name"`
	Email     string `json:"email" binding:"omitempty,email"`
	Phone     string `json:"phone"`
}

type UpdatePasswordRequest struct {
	CurrentPassword string `json:"current_password" binding:"required"`
	NewPassword     string `json:"new_password" binding:"required,min=6"`
}

type UpdateNotificationSettingsRequest struct {
	EmailNotifications bool `json:"email_notifications"`
	PushNotifications  bool `json:"push_notifications"`
}

type UserSettingsResponse struct {
	User models.User `json:"user"`
}

func NewSettingsHandlers(db *gorm.DB) *SettingsHandlers {
	return &SettingsHandlers{db: db}
}

type SettingsHandlers struct {
	db *gorm.DB
}

// Получение настроек пользователя
func (h *SettingsHandlers) GetProfile(c *gin.Context) {
	userID, _ := c.Get("user_id")

	var user models.User
	if err := h.db.First(&user, userID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Пользователь не найден"})
		return
	}

	c.JSON(http.StatusOK, UserSettingsResponse{User: user})
}

// Обновление профиля пользователя
func (h *SettingsHandlers) UpdateProfile(c *gin.Context) {
	userID, _ := c.Get("user_id")

	var user models.User
	if err := h.db.First(&user, userID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Пользователь не найден"})
		return
	}

	var req UpdateProfileRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Проверяем, не занят ли email другим пользователем
	if req.Email != "" && req.Email != user.Email {
		var count int64
		h.db.Model(&models.User{}).Where("email = ? AND id != ?", req.Email, userID).Count(&count)
		if count > 0 {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Email уже используется"})
			return
		}
	}

	updates := make(map[string]interface{})
	if req.FirstName != "" {
		updates["first_name"] = req.FirstName
	}
	if req.LastName != "" {
		updates["last_name"] = req.LastName
	}
	if req.Email != "" {
		updates["email"] = req.Email
	}
	if req.Phone != "" {
		updates["phone"] = req.Phone
	}
	updates["updated_at"] = time.Now()

	if err := h.db.Model(&user).Updates(updates).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Ошибка при обновлении профиля"})
		return
	}

	// Перезагружаем данные пользователя
	h.db.First(&user, userID)
	c.JSON(http.StatusOK, UserSettingsResponse{User: user})
}

// Обновление пароля пользователя
func (h *SettingsHandlers) UpdatePassword(c *gin.Context) {
	userID, _ := c.Get("user_id")

	var user models.User
	if err := h.db.First(&user, userID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Пользователь не найден"})
		return
	}

	var req UpdatePasswordRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Проверяем текущий пароль
	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(req.CurrentPassword)); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Неверный текущий пароль"})
		return
	}

	// Хешируем новый пароль
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.NewPassword), bcrypt.DefaultCost)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Ошибка при хешировании пароля"})
		return
	}

	// Обновляем пароль
	if err := h.db.Model(&user).Updates(map[string]interface{}{
		"password":    string(hashedPassword),
		"updated_at": time.Now(),
	}).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Ошибка при обновлении пароля"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Пароль успешно обновлен"})
}

// Обновление настроек уведомлений
func (h *SettingsHandlers) UpdateNotificationSettings(c *gin.Context) {
	userID, _ := c.Get("user_id")

	var user models.User
	if err := h.db.First(&user, userID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Пользователь не найден"})
		return
	}

	var req UpdateNotificationSettingsRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := h.db.Model(&user).Updates(map[string]interface{}{
		"email_notifications": req.EmailNotifications,
		"push_notifications":  req.PushNotifications,
		"updated_at":         time.Now(),
	}).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Ошибка при обновлении настроек уведомлений"})
		return
	}

	// Перезагружаем данные пользователя
	h.db.First(&user, userID)
	c.JSON(http.StatusOK, UserSettingsResponse{User: user})
}

// Удаление аккаунта пользователя
func (h *SettingsHandlers) DeleteAccount(c *gin.Context) {
	userID, _ := c.Get("user_id")

	var user models.User
	if err := h.db.First(&user, userID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Пользователь не найден"})
		return
	}

	// Начинаем транзакцию
	tx := h.db.Begin()

	// Мягкое удаление всех связанных контрактов
	if err := tx.Where("parent_id = ? OR child_id = ?", userID, userID).Delete(&models.Contract{}).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Ошибка при удалении контрактов"})
		return
	}

	// Мягкое удаление пользователя
	if err := tx.Delete(&user).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Ошибка при удалении аккаунта"})
		return
	}

	// Подтверждаем транзакцию
	if err := tx.Commit().Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Ошибка при завершении операции"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Аккаунт успешно удален"})
} 