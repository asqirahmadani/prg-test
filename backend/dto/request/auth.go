package request

type RegisterRequest struct {
	Name		string	`binding:"required" json:"name"`
	Username	string	`binding:"required" json:"username"`
	Password	string	`binding:"required,min=8" json:"password"`
	Role		string	`binding:"required,oneof=user sdm"`
}

type LoginRequest struct {
	Username	string	`binding:"required" json:"username"`
	Password	string	`binding:"required" json:"password"`
}