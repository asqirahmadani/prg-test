package usecase

import (
	"context"
	"database/sql"
	"errors"
	"perdin-backend/config"
	"perdin-backend/dto/request"
	"perdin-backend/model/entity"
	"perdin-backend/utils"

	"golang.org/x/crypto/bcrypt"
)

type AuthRepository interface {
	CreateUser(c context.Context, data request.RegisterRequest) (error)
	ExistsByUsername(c context.Context, username string) (bool, error)
	GetByUsername(c context.Context, username string) (entity.User, error)
}

type PasswordHasher interface {
	Hash(password string, cost int) (string, error)
	Compare(hashedPassword string, password string) error
}

type TokenIssuer interface {
	IssueJWT(userID int, role string, cfg config.JWTConfig) (string, error)
	IssueOneTimeToken() (string, error)
}

type AuthUsecase struct {
	repo		AuthRepository
	hasher		PasswordHasher
	tokenIssuer	TokenIssuer
	cfg			config.JWTConfig
}

func NewAuthUsecase(r AuthRepository, hasher PasswordHasher, tokenIssuer TokenIssuer, cfg config.JWTConfig) *AuthUsecase {
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

func (u *AuthUsecase) Login(c context.Context, data request.LoginRequest) (string, error) {
	user, err := u.repo.GetByUsername(c, data.Username)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return "", utils.ErrUnauthorize("invalid username or password")
		}
		return "", err
	}

	if err := u.hasher.Compare(user.PasswordHash, data.Password); err != nil {
		return "", utils.ErrUnauthorize("invalid username or password")
	}

	token, err := u.tokenIssuer.IssueJWT(user.ID, user.Role, u.cfg)
	if err != nil {
		return "", err
	}
	
	return token, nil
}