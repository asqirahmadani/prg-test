package request

type CreateTripRequest struct {
	DepartureDate		string	`binding:"required" json:"departure_date"`
	ReturnDate			string	`binding:"required" json:"return_date"`
	OriginCityID		int		`binding:"required" json:"origin_city_id"`
	DestinationCityID	int		`binding:"required" json:"destination_city_id"`
	Description			string	`json:"description"`
	UserID				*int
}

type TravelListQueryRequest struct {
	Page   	int     `form:"page,default=1"  binding:"min=1"`
    Limit  	int     `form:"limit,default=10" binding:"min=1,max=100"`
	Status	*string	`form:"status" binding:"omitempty,oneof=pending history"`
}