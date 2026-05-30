package utils

import (
	"perdin-backend/config"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"

	"crypto/rand"
	"crypto/sha256"
	"encoding/hex"
)

type PasswordHasher struct{}
type TokenIssuer struct{}

func (h *PasswordHasher) Hash(password string, cost int) (string, error) {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), cost)
	if err != nil {
		return "", err
	}

	return string(hashedPassword), nil
}

func (h *PasswordHasher) Compare(hashedPassword string, password string) error {
	err := bcrypt.CompareHashAndPassword([]byte(hashedPassword), []byte(password))
	if err != nil {
		return err
	}

	return nil
}

func (i *TokenIssuer) IssueJWT(userID int, role string, isVerified bool, cfg config.JWTConfig) (string, error) {
	jwtDuration := time.Duration(cfg.ExpireDuration)
	claims := jwt.MapClaims{
		"sub":         userID,
		"iat":         jwt.NewNumericDate(time.Now()),
		"exp":         jwt.NewNumericDate(time.Now().Add(jwtDuration * time.Hour)),
		"role":        role,
		"is_verified": isVerified,
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	ss, err := token.SignedString([]byte(cfg.SecretKey))
	if err != nil {
		return "", err
	}

	return ss, nil
}

func (i *TokenIssuer) IssueOneTimeToken() (string, error) {
	b := make([]byte, 32)
	_, err := rand.Read(b)
	if err != nil {
		return "", err
	}
	return hex.EncodeToString(b), nil
}

func (i *TokenIssuer) HashOneTimeToken(token string) string {
	h := sha256.Sum256([]byte(token))
	return hex.EncodeToString(h[:])
}
