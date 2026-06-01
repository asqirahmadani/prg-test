package response

type CityResponse struct {
	ID		int		`json:"id"`
	Name	string	`json:"name"`
}

type CityListResponse struct {
	Cities	[]City				`json:"cities"`
	Meta	PaginationResponse	`json:"meta"`
}

type City struct {
	ID			int		`json:"id"`
	Name		string	`json:"name"`
	Province	string	`json:"province"`
	Island		string	`json:"island"`
	IsAbroad	bool	`json:"is_abroad"`
	Latitude	float64	`json:"latitude"`
	Longitude	float64	`json:"longitude"`
}