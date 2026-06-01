package postgres

import (
	"context"
	"perdin-backend/model/entity"
	"perdin-backend/utils"
	"strings"

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

func(r *CityRepository) GetCities(c context.Context) ([]entity.CityList, error) {
	query := `
		SELECT
			id,
			name
		FROM cities;
	`

	var cities []entity.CityList
	if err := r.db.SelectContext(c, &cities, query); err != nil {
		return nil, err
	}
	
	return cities, nil
}

func(r *CityRepository) CityList(c context.Context, queryPagination string, values []any) ([]entity.CityData, error) {
	var query strings.Builder

	query.WriteString(`
		SELECT
			id,
			name,
			province,
			island,
			is_abroad,
			ST_X(ST_Transform(location, 4326)) AS longitude,
    		ST_Y(ST_Transform(location, 4326)) AS latitude
		FROM cities
	`)

	query.WriteString(queryPagination)

	var cities []entity.CityData
	if err := r.db.SelectContext(c, &cities, query.String(), values...); err != nil {
		return nil, err
	}

	return cities, nil
}

func(r *CityRepository) CityListMetadata(c context.Context) (int, error) {
	query := "SELECT COUNT(DISTINCT c.id) FROM cities c"

	var total int
	if err := r.db.GetContext(c, &total, query); err != nil {
		return 0, err
	}

	return total, nil
}