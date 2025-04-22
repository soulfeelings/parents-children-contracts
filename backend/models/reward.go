package models

import (
	"time"

	"gorm.io/gorm"
)

type Reward struct {
	ID          string         `gorm:"type:uuid;primaryKey;default:uuid_generate_v4()" json:"id"`
	Title       string         `gorm:"not null" json:"title"`
	Description string         `json:"description"`
	ContractID  string        `gorm:"type:uuid;not null" json:"contract_id"`
	Contract    Contract      `gorm:"foreignKey:ContractID" json:"contract"`
	Status      string        `gorm:"not null" json:"status"` // available, claimed, expired
	PointsCost  int           `gorm:"not null" json:"points_cost"`
	ExpiryDate  time.Time     `gorm:"not null" json:"expiry_date"`
	CreatedAt   time.Time     `json:"created_at"`
	UpdatedAt   time.Time     `json:"updated_at"`
	DeletedAt   gorm.DeletedAt `gorm:"index" json:"-"`
} 