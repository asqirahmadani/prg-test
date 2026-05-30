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

type AuthUsecase interface {
	Register(c context.Context, data request.RegisterRequest) error
}

type AuthHandler struct {
	uc	AuthUsecase
}

func NewAuthHandler (uc AuthUsecase) *AuthHandler {
	return &AuthHandler{
		uc: uc,
	}
}

func (h *AuthHandler) Register(c *gin.Context) {
	var reqBody request.RegisterRequest

	if err := c.ShouldBindJSON(&reqBody); err != nil {
		c.Error(utils.ErrBadRequest(fmt.Sprintf("binding error: %v", err)))

		return
	}

	if err := h.uc.Register(c.Request.Context(), reqBody); err != nil {
		c.Error(err)

		return
	}

	c.JSON(http.StatusCreated, response.JSONResponse{
		Message: "success",
		Data: response.InfoResponse{
			Info: "user registered successfully",
		},
	})
}
