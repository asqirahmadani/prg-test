package handler

type Handlers struct {
	Auth	AuthHandler
	Travel	TravelHandler
}

func NewHandlers(auth AuthHandler, travel TravelHandler) *Handlers {
	return &Handlers{
		Auth: auth,
		Travel: travel,
	}
}