package response

type JSONResponse struct {
	Message string `json:"message"`
	Data    any    `json:"data"`
}

type InfoResponse struct {
	Info string `json:"info"`
}