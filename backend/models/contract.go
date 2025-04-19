package models

import (
	"time"

	"gorm.io/gorm"
)

type Contract struct {
	ID          uint           `gorm:"primaryKey" json:"id"`
	Title       string         `gorm:"not null" json:"title"`
	Description string         `json:"description"`
	ParentID    uint          `gorm:"not null" json:"parent_id"`
	Parent      User          `gorm:"foreignKey:ParentID" json:"parent"`
	ChildID     uint          `gorm:"not null" json:"child_id"`
	Child       User          `gorm:"foreignKey:ChildID" json:"child"`
	Tasks       []Task        `gorm:"foreignKey:ContractID" json:"tasks"`
	Rewards     []Reward      `gorm:"foreignKey:ContractID" json:"rewards"`
	Status      string        `gorm:"not null" json:"status"` // active, completed, terminated
	StartDate   time.Time     `gorm:"not null" json:"start_date"`
	EndDate     time.Time     `gorm:"not null" json:"end_date"`
	CreatedAt   time.Time     `json:"created_at"`
	UpdatedAt   time.Time     `json:"updated_at"`
	DeletedAt   gorm.DeletedAt `gorm:"index" json:"-"`
} 