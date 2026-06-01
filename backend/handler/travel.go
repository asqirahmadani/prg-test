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

type TravelUsecase interface {
	CreateTrip(c context.Context, data request.CreateTripRequest) error
	UserTravelList(c context.Context, query request.TravelListQueryRequest, userID int) (response.TravelListResponse, error)
	SdmTravelList(c context.Context, query request.TravelListQueryRequest) (response.SdmTravelListResponse, error)
	TravelActions(c context.Context, travelID int, actions string) error
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

func (h *TravelHandler) UserTravelList(c *gin.Context) {
	var query request.TravelListQueryRequest

	if err := c.ShouldBindQuery(&query); err != nil {
		c.Error(utils.ErrBadRequest(fmt.Sprintf("binding error: %v", err)))

		return
	}

	rawID := c.Value(utils.UserIDKey).(int64)
	userID := int(rawID)

	travels, err := h.usecase.UserTravelList(c.Request.Context(), query, userID)
	if err != nil {
		c.Error(err)

		return
	}

	c.JSON(http.StatusOK, response.JSONResponse{
		Message: "success",
		Data: travels,
	})
}

func(h *TravelHandler) SdmTravelList(c *gin.Context) {
	var query request.TravelListQueryRequest

	if err := c.ShouldBindQuery(&query); err != nil {
		c.Error(utils.ErrBadRequest(fmt.Sprintf("binding error: %v", err)))

		return
	}

	travels, err := h.usecase.SdmTravelList(c.Request.Context(), query)
	if err != nil {
		c.Error(err)

		return
	}

	c.JSON(http.StatusOK, response.JSONResponse{
		Message: "success",
		Data: travels,
	})
}

func(h *TravelHandler) ApproveTravelRequest(c *gin.Context) {
	travelIDStr := c.Param("travel_id")
	travelID, err := strconv.Atoi(travelIDStr)
	if err != nil || travelID <= 0 {
		c.Error(utils.ErrBadRequest("invalid travel_id"))
		return
	}

	if err := h.usecase.TravelActions(c.Request.Context(), travelID, "approve"); err != nil {
		c.Error(err)

		return
	}

	c.JSON(http.StatusOK, response.JSONResponse{
		Message: "success",
		Data: response.InfoResponse{
			Info: "successfully approve travel request",
		},
	})
}

func(h *TravelHandler) DeclineTravelRequest(c *gin.Context) {
	travelIDStr := c.Param("travel_id")
	travelID, err := strconv.Atoi(travelIDStr)
	if err != nil || travelID <= 0 {
		c.Error(utils.ErrBadRequest("invalid travel_id"))
		return
	}

	if err := h.usecase.TravelActions(c.Request.Context(), travelID, "decline"); err != nil {
		c.Error(err)

		return
	}

	c.JSON(http.StatusOK, response.JSONResponse{
		Message: "success",
		Data: response.InfoResponse{
			Info: "successfully decline travel request",
		},
	})
}