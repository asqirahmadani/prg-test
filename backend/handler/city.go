package handler

import (
	"context"
	"fmt"
	"net/http"
	"perdin-backend/dto/request"
	"perdin-backend/dto/response"
	"perdin-backend/utils"
	"strconv"

	"github.com/gin-gonic/gin"
)

type CityUsecase interface {
	CreateCity(c context.Context, data request.CreateCityRequest) error
	GetCities(c context.Context) ([]response.CityResponse, error)
	CityList(c context.Context, data request.CityListQueryRequest) (response.CityListResponse, error)
	DeleteCity(c context.Context, cityID int) error
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

func(h *CityHandler) GetCities(c *gin.Context) {
	cities, err := h.usecase.GetCities(c.Request.Context())
	if err != nil {
		c.Error(err)

		return
	}

	c.JSON(http.StatusOK, response.JSONResponse{
		Message: "success",
		Data: cities,
	})
}

func(h *CityHandler) CityList(c *gin.Context) {
	var query request.CityListQueryRequest

	if err := c.ShouldBindQuery(&query); err != nil {
		c.Error(utils.ErrBadRequest(fmt.Sprintf("binding error: %v", err)))

		return
	}

	cities, err := h.usecase.CityList(c.Request.Context(), query)
	if err != nil {
		c.Error(err)

		return
	}

	c.JSON(http.StatusOK, response.JSONResponse{
		Message: "success",
		Data: cities,
	})
}

func(h *CityHandler) DeleteCity(c *gin.Context) {
	cityIDStr := c.Param("city_id")
	cityID, err := strconv.Atoi(cityIDStr)
	if err != nil || cityID <= 0 {
		c.Error(utils.ErrBadRequest("invalid city_id"))
		return
	}

	if err := h.usecase.DeleteCity(c.Request.Context(), cityID); err != nil {
		c.Error(err)

		return
	}

	c.JSON(http.StatusOK, response.JSONResponse{
		Message: "success",
		Data: response.InfoResponse{
			Info: "City deleted successfully",
		},
	})
}