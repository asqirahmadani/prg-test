package response

type JSONResponse struct {
	Message string `json:"message"`
	Data    any    `json:"data"`
}

type InfoResponse struct {
	Info string `json:"info"`
}

type PaginationResponse struct {
	CurrentPage int	`json:"current_page"`
	LastPage	int	`json:"last_page"`
	PerPage		int	`json:"per_page"`
	Total		int	`json:"total"`
}