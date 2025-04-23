package models

import (
	"time"

	"gorm.io/gorm"
)

type User struct {
	gorm.Model
	Name        string    `json:"name"`
	Email       string    `json:"email" gorm:"unique"`
	DateOfBirth time.Time `json:"dateOfBirth" gorm:"type:date"`
	Password    string    `json:"password"`
}
