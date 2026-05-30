package entity

import "time"

type OfficialTravel struct {
	UserID				int			`db:"user_id"`
	DepartureDate		time.Time	`db:"departure_date"`
	ReturnDate			time.Time	`db:"return_date"`
	OriginCityID		int			`db:"origin_city_id"`
	DestinationCityID	int			`db:"destination_city_id"`
	TripDuration		int			`db:"trip_duration"`
	Allowance			float64		`db:"allowance"`
}