package controllers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"time"

	"github.com/brainDensed/stock-tracker/initializers"
	"github.com/brainDensed/stock-tracker/models"
	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
	"github.com/resend/resend-go/v2"
	"golang.org/x/crypto/bcrypt"
)

type CreateUser struct {
	Name        string    `json:"name" validate:"required"`
	Email       string    `json:"email" validate:"required,email"`
	Password    string    `json:"password" validate:"required,min=6"`
	DateOfBirth time.Time `json:"dateOfBirth" validate:"required"`
}

type loginUser struct {
	Email    string
	Password string
}

type UserResponse struct {
	Name        string    `json:"name"`
	Email       string    `json:"email"`
	DateOfBirth time.Time `json:"dateOfBirth"`
}

var validate = validator.New()

func Signup(c *gin.Context) {
	var body CreateUser
	err := c.BindJSON(&body)
	if err != nil {
		fmt.Println("Error binding request body:", err)
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Failed to read request body",
		})
		return
	}
	err = validate.Struct(body)
	if err != nil {
		if validationErrors, ok := err.(validator.ValidationErrors); ok {
			// Handle validation errors
			c.JSON(http.StatusBadRequest, gin.H{
				"error": validationErrors,
			})
			return
		} else {
			// If the error is not of type validator.ValidationErrors, handle it
			c.JSON(http.StatusInternalServerError, gin.H{
				"error": "Internal server error during validation",
			})
			return
		}
	}
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(body.Password), 10)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid email or password",
		})
		return
	}
	tempUser := models.User{Name: body.Name, Email: body.Email, Password: string(hashedPassword), DateOfBirth: body.DateOfBirth}
	token := uuid.New().String()
	key := fmt.Sprintf("tempUser:%s", token)
	user, err := json.Marshal(tempUser)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to serialize temp user",
		})
		return
	}
	err = initializers.Rdb.Set(initializers.Ctx, key, user, time.Minute*15).Err()

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "failed to store user",
		})
		return
	}

	client := resend.NewClient(os.Getenv("RESEND_API_KEY"))
	verificationURL := fmt.Sprintf("%s/verify?token=%s", os.Getenv("URL"), token)
	htmlContent := fmt.Sprintf(`
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 20px auto; padding: 20px; border: 1px solid #eee; border-radius: 5px;">
        <h2 style="color: #2c3e50; text-align: center;">Stock Tracker Email Verification</h2>
        <p>Please verify your email address by clicking the link below:</p>
        <a href="%s" style="display: block; text-align: center; background: #3498db; color: white; padding: 12px; text-decoration: none; border-radius: 4px; margin: 20px 0;">Verify Email</a>
    </div>
    `, verificationURL)

	params := &resend.SendEmailRequest{
		From:    os.Getenv("SENDER_EMAIL"),
		To:      []string{body.Email},
		Subject: "Verify you email",
		Html:    htmlContent,
	}

	_, err = client.Emails.Send(params)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to send verification email",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Verification email sent",
	})

	c.JSON(http.StatusOK, gin.H{
		"message": "Verification Link has been sent to your mail, please verify to complete signup.",
	})
}

func Login(c *gin.Context) {
	var body loginUser
	var err error
	err = c.Bind(&body)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Failed to read body",
		})
		return
	}
	var user models.User
	initializers.DB.First(&user, "email = ?", body.Email)
	if user.ID == 0 {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "invalid email or password",
		})
		return
	}
	err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(body.Password))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "invalid email or password",
		})
		return
	}
	sessionID := uuid.New().String()
	token := jwt.NewWithClaims(jwt.SigningMethodHS256,
		jwt.MapClaims{
			"id":        user.ID,
			"sessionID": sessionID,
			"exp":       time.Now().Add(time.Hour * 24 * 30).Unix(),
		})
	sessionKey := fmt.Sprintf("session:%d:%s", user.ID, sessionID)
	tokenString, err := token.SignedString([]byte(os.Getenv("SECRET")))
	if err != nil {
		fmt.Println(err)
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "couldn't generate token",
		})
		return
	}
	err = initializers.Rdb.Set(initializers.Ctx, sessionKey, tokenString, time.Hour*24*30).Err()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Error while logging in. Please try again.",
		})
		return
	}
	c.SetSameSite(http.SameSiteLaxMode)
	c.SetCookie("Authorization", tokenString, 60*60*24*30, "", "", false, true)
	c.JSON(http.StatusOK, gin.H{})
}

func Logout(c *gin.Context) {
	tokenString, err := c.Cookie("Authorization")
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error": "missing auth token",
		})
		return
	}
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		return []byte(os.Getenv("SECRET")), nil
	}, jwt.WithValidMethods([]string{jwt.SigningMethodHS256.Alg()}))
	if err != nil {
		c.AbortWithStatus(http.StatusUnauthorized)
		return
	}
	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok || claims["id"] == nil || claims["sessionID"] == nil {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error": "Invalid token claims",
		})
		return
	}
	userId := int(claims["id"].(float64))
	sessionID := claims["sessionID"].(string)
	sessionKey := fmt.Sprintf("session:%d:%s", userId, sessionID)
	err = initializers.Rdb.Del(initializers.Ctx, sessionKey).Err()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "error while logging out",
		})
		return
	}
	c.SetCookie("Authorization", "", -1, "", "", false, true)
	c.JSON(http.StatusOK, gin.H{
		"message": "Logged out successfully",
	})
}

func LogoutFromAllDevices(c *gin.Context) {
	tokenString, err := c.Cookie("Authorization")
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error": "missing auth token",
		})
	}
	token, err := jwt.Parse(tokenString, func(t *jwt.Token) (interface{}, error) {
		return []byte(os.Getenv("SECRET")), nil
	}, jwt.WithValidMethods([]string{jwt.SigningMethodHS256.Alg()}))
	if err != nil {
		c.AbortWithStatus(http.StatusUnauthorized)
		return
	}
	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok || claims["id"] == nil || claims["sessionID"] == nil {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error": "invalid token claims",
		})
		return
	}
	userId := int(claims["id"].(float64))
	sessionKey := fmt.Sprintf("session:%d:*", userId)

	sessionKeys, err := initializers.Rdb.Keys(initializers.Ctx, sessionKey).Result()
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "failed to find user session",
		})
		return
	}
	if len(sessionKeys) == 0 {
		c.JSON(http.StatusNotFound, gin.H{
			"error": "no session found",
		})
		return
	}

	err = initializers.Rdb.Del(initializers.Ctx, sessionKeys...).Err()
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "failed to delete sessions",
		})
		return
	}
	c.SetCookie("Authorization", "", -1, "", "", false, true)
	c.JSON(http.StatusOK, gin.H{
		"message": fmt.Sprintf("Successfully logged out from %d devices", len(sessionKeys)),
	})
}

func VerifyEmail(c *gin.Context) {
	token := c.Query("token")
	if token == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Missing token parameter",
		})
		return
	}
	key := fmt.Sprintf("tempUser:%s", token)
	userDataStr, err := initializers.Rdb.Get(initializers.Ctx, key).Result()
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"error": "User not found",
		})
		return
	}
	var userData models.User
	if err := json.Unmarshal([]byte(userDataStr), &userData); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to parse user data",
		})
		return
	}
	result := initializers.DB.Create(&userData)

	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to create user",
		})
		return
	}
	err = initializers.Rdb.Del(initializers.Ctx, key).Err()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to delete temp user",
		})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"message": "Email verified successfully",
	})
}

func Validator(c *gin.Context) {
	userInterface, exists := c.Get("user")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not found"})
		return
	}

	user, ok := userInterface.(models.User)
	if !ok {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Invalid user type"})
		return
	}

	// Only return safe fields
	resp := UserResponse{
		Name:        user.Name,
		Email:       user.Email,
		DateOfBirth: user.DateOfBirth,
	}

	c.JSON(http.StatusOK, gin.H{"user": resp})
}
