package handler

type Handlers struct {
	Auth	AuthHandler
}

func NewHandlers(auth AuthHandler) *Handlers {
	return &Handlers{
		Auth: auth,
	}
}