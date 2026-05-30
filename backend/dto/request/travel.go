package request

import "time"

type CreateTripRequest struct {
	DepartureDate		time.Time	`binding:"required" json:"departure_date" time_format:"2006-01-02"`
	ReturnDate			time.Time	`binding:"required" json:"return_date" time_format:"2006-01-02"`
	OriginCityID		int			`binding:"required" json:"origin_city_id"`
	DestinationCityID	int			`binding:"required" json:"destination_city_id"`
	Description			string		`json:"description"`
	UserID				*int
}

type TravelListQueryRequest struct {
	Page   int     `form:"page,default=1"  binding:"min=1"`
    Limit  int     `form:"limit,default=10" binding:"min=1,max=100"`
}