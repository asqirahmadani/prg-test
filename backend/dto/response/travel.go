package response

import "time"

type TravelListResponse struct {
	Travels	[]Travel			`json:"travels"`
	Meta	PaginationResponse	`json:"meta"`
}

type Travel struct {
	ID				int			`json:"id"`
	OriginCity		string		`json:"origin_city"`
	DestinationCity	string		`json:"destination_city"`
	DepartureDate	time.Time	`json:"departure_date"`
	ReturnDate		time.Time	`json:"return_date"`
	Description		string		`json:"description"`
	TripDuration	int			`json:"trip_duration"`
	Allowance		float64		`json:"allowance"`
	Status			string		`json:"status"`
}