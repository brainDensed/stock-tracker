package main

import (
	"net/http"
	"os"

	"github.com/brainDensed/stock-tracker/controllers"
	"github.com/brainDensed/stock-tracker/initializers"
	"github.com/brainDensed/stock-tracker/middleware"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func init() {
	initializers.LoadEnv()
	initializers.ConnectToPg()
	initializers.ConnectToRedis()
	initializers.SyncDb()
}

func main() {
	router := gin.Default()
	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{os.Getenv("URL")}, // Frontend URL
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		AllowCredentials: true,
	}))
	router.GET("/ping", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"message": "pong",
		})
	})
	router.POST("/signup", controllers.Signup)
	router.GET("/verify-email", controllers.VerifyEmail)
	router.POST("/login", controllers.Login)
	router.POST("/logout", middleware.RequireAuth, controllers.Logout)
	router.POST("/logoutFromAllDevices", middleware.RequireAuth, controllers.LogoutFromAllDevices)
	router.GET("/profile", middleware.RequireAuth, controllers.Validator)
	router.Run() // listen and serve on 0.0.0.0:8080
}
