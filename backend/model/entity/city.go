package entity

type City struct {
	Name		string	`db:"name"`
	Province	string	`db:"province"`
	Island		string	`db:"island"`
	IsAbroad	bool	`db:"is_abroad"`
}

type CreateCity struct {
	Name		string	`db:"name"`
	Province	string	`db:"province"`
	Island		string	`db:"island"`
	IsAbroad	bool	`db:"is_abroad"`
	Longitude	float64	`db:"longitude"`
	Latitude	float64	`db:"latitude"`
}

type CityList struct {
	ID		int		`db:"id"`
	Name	string	`db:"name"`
}