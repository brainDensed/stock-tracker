package controllers

import (
	"net/http"
	"strconv"

	"github.com/brainDensed/stock-tracker/service"
	"github.com/gin-gonic/gin"
)

func GetNews(c *gin.Context) {
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "10"))
	res, err := service.FetchNews([]string{"AAPL", "GOOGL", "MSFT"}, int64(page), int64(limit))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to fetch news",
		})
		return
	}
	c.JSON(http.StatusOK, res)
}
