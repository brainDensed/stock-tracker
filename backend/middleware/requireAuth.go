package middleware

import (
	"fmt"
	"net/http"
	"os"
	"time"

	"github.com/brainDensed/stock-tracker/initializers"
	"github.com/brainDensed/stock-tracker/models"
	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"github.com/redis/go-redis/v9"
)

func RequireAuth(c *gin.Context) {
	tokenString, err := c.Cookie("Authorization")
	if err != nil {
		c.AbortWithStatus(http.StatusUnauthorized)
		return
	}
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		return []byte(os.Getenv("SECRET")), nil
	}, jwt.WithValidMethods([]string{jwt.SigningMethodHS256.Alg()}))
	if err != nil {
		c.AbortWithStatus(http.StatusUnauthorized)
		return
	}
	if claims, ok := token.Claims.(jwt.MapClaims); ok {
		if float64(time.Now().Unix()) > claims["exp"].(float64) {
			c.AbortWithStatus(http.StatusUnauthorized)
			return
		}
		userId := int(claims["id"].(float64))
		sessionID := claims["sessionID"].(string)
		sessionKey := fmt.Sprintf("session:%d:%s", userId, sessionID)
		val, err := initializers.Rdb.Get(initializers.Ctx, sessionKey).Result()
		if err == redis.Nil || val != tokenString {
			c.AbortWithStatus(http.StatusUnauthorized)
			return
		} else if err != nil {
			c.AbortWithStatus(http.StatusInternalServerError)
			return
		}
		var user models.User
		initializers.DB.Find(&user, claims["id"])
		if user.ID == 0 {
			c.AbortWithStatus(http.StatusUnauthorized)
			return
		}
		c.Set("user", user)
		c.Next()
	} else {
		c.AbortWithStatus(http.StatusUnauthorized)
		return
	}
}
