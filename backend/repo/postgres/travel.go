package postgres

import (
	"context"
	"perdin-backend/model/entity"
	"perdin-backend/utils"

	"github.com/jmoiron/sqlx"
)

type TravelRepository struct {
	db	*sqlx.DB
}

func NewTravelRepository(db *sqlx.DB) *TravelRepository {
	return &TravelRepository{
		db: db,
	}
}

func (r *TravelRepository) CreateTrip(c context.Context, data entity.OfficialTravel) error {
	query := `
		INSERT INTO official_travels (user_id, departure_date, return_date, origin_city_id, destination_city_id, trip_duration, allowance)
		VALUES (:user_id, :departure_date, :return_date, :origin_city_id, :destination_city_id, :trip_duration, :allowance);
	`

	rows, err := r.db.NamedExecContext(c, query, data)
	
	return utils.CheckRowsAffected(rows, err, "failed to create official travel")
}

func(r *TravelRepository) GetCityByID(c context.Context, cityID int) (entity.City, error) {
	query := `
		SELECT
			id,
			name,
			province,
			island,
			is_abroad
		FROM cities
		WHERE id = $1;
	`

	var city entity.City
	if err := r.db.GetContext(c, &city, query, cityID); err != nil {
		return entity.City{}, err
	}

	return city, nil
}

func(r *TravelRepository) GetCityDistance(c context.Context, originID, destinationID int) (int, error) {
	return 0, utils.ErrInternalServer("fix distance pls")
}