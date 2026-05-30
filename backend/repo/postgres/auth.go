package postgres

import (
	"context"
	"perdin-backend/dto/request"
	"perdin-backend/model/entity"
	"perdin-backend/utils"

	"github.com/jmoiron/sqlx"
)

type AuthRepository struct {
	db *sqlx.DB
}

func NewAuthRepository(db *sqlx.DB) *AuthRepository {
	return &AuthRepository{db: db}
}

func(r *AuthRepository) CreateUser(c context.Context, data request.RegisterRequest) (error) {
	query := `
		INSERT INTO users (name, username, password_hash, role)
		VALUES ($1, $2, $3, $4);
	`
	rows, err := r.db.ExecContext(c, query, data.Name, data.Username, data.Password, data.Role)
	
	return utils.CheckRowsAffected(rows, err, "failed to create user")
}

func(r *AuthRepository) ExistsByUsername(c context.Context, username string) (bool, error) {
	var exists bool
	query := "SELECT EXISTS(SELECT 1 FROM users WHERE username = $1)"
	
	if err := r.db.QueryRowContext(c, query, username).Scan(&exists); err != nil {
		return false, err
	}

	return exists, nil
}

func(r *AuthRepository) GetByUsername(c context.Context, username string) (entity.User, error) {
	query := `
		SELECT id, role, password_hash
		FROM users
		WHERE username = $1;
	`

	var user entity.User
	if err := r.db.GetContext(c, &user, query, username); err != nil {
		return entity.User{}, err
	}

	return user, nil
}