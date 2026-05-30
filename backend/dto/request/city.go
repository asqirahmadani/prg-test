package request

type CreateCityRequest struct {
	Name		string	`binding:"required" json:"name"`
	Province	string	`binding:"required" json:"province"`
	Island		string	`binding:"required" json:"island"`
	IsAbroad	bool	`json:"is_abroad"`
	Latitude	float64	`binding:"required" json:"latitude"`
	Longitude	float64	`binding:"required" json:"longitude"`
}