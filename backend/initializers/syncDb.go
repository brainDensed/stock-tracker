package initializers

import "github.com/brainDensed/stock-tracker/models"

func SyncDb() {
	DB.AutoMigrate(&models.User{})
}
