package response

type LoginResponse struct {
	Token	string	`json:"token"`
}

type ProfileUserResponse struct {
	Name		string	`json:"name"`
	Username	string	`json:"username"`
}