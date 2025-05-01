package controllers

import (
	"net/http"

	"github.com/brainDensed/stock-tracker/service"
	"github.com/gin-gonic/gin"
)

func GetNews(c *gin.Context) {
	res, err := service.FetchNews([]string{"AAPL", "GOOGL", "MSFT"})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to fetch news",
		})
		return
	}
	c.JSON(http.StatusOK, res)
}
