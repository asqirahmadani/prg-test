package usecase

import (
	"context"
	"perdin-backend/config"
	"perdin-backend/dto/request"
	"perdin-backend/utils"

	"golang.org/x/crypto/bcrypt"
)

type AuthRepository interface {
	CreateUser(c context.Context, data request.RegisterRequest) (error)
	ExistsByUsername(c context.Context, username string) (bool, error)
}

type PasswordHasher interface {
	Hash(password string, cost int) (string, error)
	Compare(hashedPassword string, password string) error
}

type TokenIssuer interface {
	IssueJWT(userID int, role string, isVerified bool, cfg config.JWTConfig) (string, error)
	IssueOneTimeToken() (string, error)
}

type AuthUsecase struct {
	repo		AuthRepository
	hasher		PasswordHasher
	tokenIssuer	TokenIssuer
}

func NewAuthUsecase(r AuthRepository, hasher PasswordHasher, tokenIssuer TokenIssuer) *AuthUsecase {
	return &AuthUsecase{
		repo: r,
		hasher: hasher,
		tokenIssuer: tokenIssuer,
	}
}

func (u *AuthUsecase) Register(c context.Context, data request.RegisterRequest) error {
	exists, err := u.repo.ExistsByUsername(c, data.Username)
	if err != nil {
		return err
	}
	if exists {
		return utils.ErrUnprocessableEntity("user already exists")
	}

	hashed, err := u.hasher.Hash(data.Password, bcrypt.DefaultCost)
	if err != nil {
		return utils.ErrInternalServer("failed to hash password")
	}

	data.Password = hashed
	if err := u.repo.CreateUser(c, data); err != nil {
		return err
	}
	
	return nil
}