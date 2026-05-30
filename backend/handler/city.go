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

type CityUsecase interface {
	CreateCity(c context.Context, data request.CreateCityRequest) error
}

type CityHandler struct {
	usecase	CityUsecase
}

func NewCityHandler(uc CityUsecase) *CityHandler {
	return &CityHandler{
		usecase: uc,
	}
}

func(h *CityHandler) CreateCity(c *gin.Context) {
	var reqBody request.CreateCityRequest

	if err := c.ShouldBindJSON(&reqBody); err != nil {
		c.Error(utils.ErrBadRequest(fmt.Sprintf("binding error: %v", err)))

		return
	}

	if err := h.usecase.CreateCity(c.Request.Context(), reqBody); err != nil {
		c.Error(err)

		return
	}

	c.JSON(http.StatusCreated, response.JSONResponse{
		Message: "success",
		Data: response.InfoResponse{
			Info: "city created successfully",
		},
	})
}