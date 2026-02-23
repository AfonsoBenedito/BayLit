package middleware

import (
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

type Claims struct {
	UserID string `json:"user_id"`
	Tipo   string `json:"tipo"`
	jwt.RegisteredClaims
}

func jwtSecret() []byte {
	s := os.Getenv("TOKEN_SECRET")
	if s == "" {
		s = "local-dev-secret-change-in-prod"
	}
	return []byte(s)
}

// SignToken creates a JWT for the given user.
func SignToken(userID, tipo string) (string, error) {
	claims := Claims{
		UserID: userID,
		Tipo:   tipo,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(120 * time.Minute)),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
		},
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(jwtSecret())
}

// ParseToken validates a Bearer token and returns claims.
func ParseToken(tokenStr string) (*Claims, error) {
	claims := &Claims{}
	_, err := jwt.ParseWithClaims(tokenStr, claims, func(t *jwt.Token) (any, error) {
		if _, ok := t.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, jwt.ErrSignatureInvalid
		}
		return jwtSecret(), nil
	})
	return claims, err
}

// Auth is a Gin middleware that requires a valid JWT.
func Auth() gin.HandlerFunc {
	return func(c *gin.Context) {
		header := c.GetHeader("Authorization")
		if !strings.HasPrefix(header, "Bearer ") {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"code": 401, "message": "Token não fornecido"})
			return
		}
		tokenStr := strings.TrimPrefix(header, "Bearer ")
		claims, err := ParseToken(tokenStr)
		if err != nil {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"code": 401, "message": "Token inválido ou expirado"})
			return
		}
		c.Set("userID", claims.UserID)
		c.Set("tipo", claims.Tipo)
		c.Next()
	}
}

// Require checks that the authenticated user has one of the given tipos.
func Require(tipos ...string) gin.HandlerFunc {
	set := make(map[string]bool, len(tipos))
	for _, t := range tipos {
		set[t] = true
	}
	return func(c *gin.Context) {
		tipo := c.GetString("tipo")
		if !set[tipo] {
			c.AbortWithStatusJSON(http.StatusForbidden, gin.H{"code": 403, "message": "Sem permissão"})
			return
		}
		c.Next()
	}
}

func respondError(c *gin.Context, status int, msg string) {
	c.JSON(status, gin.H{"code": status, "message": msg})
}

// UserID returns the authenticated user's ID from the context.
func UserID(c *gin.Context) string {
	return c.GetString("userID")
}

// UserTipo returns the authenticated user's type from the context.
func UserTipo(c *gin.Context) string {
	return c.GetString("tipo")
}

// noop to avoid unused import warning
var _ = respondError
