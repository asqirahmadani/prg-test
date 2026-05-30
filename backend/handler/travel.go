package handler

import (
	"context"
	"fmt"
	"net/http"
	"perdin-backend/dto/request"
	"perdin-backend/dto/response"
	"perdin-backend/utils"

	"github.com/gin-gonic/gin"
)

type TravelUsecase interface {
	CreateTrip(c context.Context, data request.CreateTripRequest) error
}

type TravelHandler struct {
	usecase	TravelUsecase
}

func NewTravelHandler(uc TravelUsecase) *TravelHandler {
	return &TravelHandler{
		usecase: uc,
	}
}

func (h *TravelHandler) CreateTrip(c *gin.Context) {
	var reqBody request.CreateTripRequest

	if err := c.ShouldBindJSON(&reqBody); err != nil {
		c.Error(utils.ErrBadRequest(fmt.Sprintf("binding error: %v", err)))

		return
	}

	rawID := c.Value(utils.UserIDKey).(int64)
	userID := int(rawID)

	reqBody.UserID = &userID

	if err := h.usecase.CreateTrip(c.Request.Context(), reqBody); err != nil {
		c.Error(err)

		return
	}

	c.JSON(http.StatusCreated, response.JSONResponse{
		Message: "success",
		Data: response.InfoResponse{
			Info: "trip created successfully",
		},
	})
}