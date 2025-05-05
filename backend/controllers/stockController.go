package controllers

import (
	"net/http"

	"github.com/brainDensed/stock-tracker/service"
	"github.com/gin-gonic/gin"
)

func GetStockData(c *gin.Context) {
	symbol := c.DefaultQuery("symbol", "IBM")
	timeSeries := c.DefaultQuery("timeSeries", "TIME_SERIES_DAILY")

	stockData := service.FetchStock(symbol, timeSeries)
	if stockData == nil {
		c.JSON(500, gin.H{"error": "Failed to fetch stock data"})
		return
	}
	c.JSON(http.StatusOK, stockData)
}

func GetTopMovers(c *gin.Context) {
	topMoversData, err := service.FetchTopMovers()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, topMoversData)
}

func GetStockOverview(c *gin.Context) {
	function := c.DefaultQuery("function", "OVERVIEW")
	symbol := c.DefaultQuery("symbol", "IBM")
	stockOverviewData, err := service.FetchStockOverview(function, symbol)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, stockOverviewData)
}
