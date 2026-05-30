package postgres

import (
	"context"
	"perdin-backend/model/entity"
	"perdin-backend/utils"

	"github.com/jmoiron/sqlx"
)

type CityRepository struct {
	db	*sqlx.DB
}

func NewCityRepository(db *sqlx.DB) *CityRepository {
	return &CityRepository{
		db: db,
	}
}

func(r *CityRepository) ExistsByName(c context.Context, cityName string) (bool, error) {
	query := "SELECT EXISTS(SELECT 1 FROM cities WHERE name = $1)"

	var exists bool
	if err := r.db.QueryRowContext(c, query, cityName).Scan(&exists); err != nil {
		return false, err
	}

	return exists, nil
}

func(r *CityRepository) CreateCity(c context.Context, data entity.CreateCity) (error) {
	query := `
		INSERT INTO cities(
			name,
			province,
			island,
			is_abroad,
			location
		) VALUES (
			:name,
			:province,
			:island,
			:is_abroad,
			ST_SetSRID(ST_MakePoint(:longitude, :latitude), 4326)
		);
	`

	rows, err := r.db.NamedExecContext(c, query, data)

	return utils.CheckRowsAffected(rows, err, "failed to create city")
}