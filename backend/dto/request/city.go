package request

type CreateCityRequest struct {
	Name		string	`binding:"required" json:"name"`
	Province	string	`binding:"required" json:"province"`
	Island		string	`binding:"required" json:"island"`
	IsAbroad	bool	`json:"is_abroad"`
	Latitude	float64	`binding:"required" json:"latitude"`
	Longitude	float64	`binding:"required" json:"longitude"`
}

type CityListQueryRequest struct {
	Page   	int     `form:"page,default=1"  binding:"min=1"`
    Limit  	int     `form:"limit,default=10" binding:"min=1,max=100"`
}