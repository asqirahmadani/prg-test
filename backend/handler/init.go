package handler

type Handlers struct {
	Auth	AuthHandler
	Travel	TravelHandler
	City	CityHandler
}

func NewHandlers(auth AuthHandler, travel TravelHandler, city CityHandler) *Handlers {
	return &Handlers{
		Auth: auth,
		Travel: travel,
		City: city,
	}
}