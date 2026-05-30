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
	Login(c context.Context, data request.LoginRequest) (string, error)
}

type AuthHandler struct {
	usecase	AuthUsecase
}

func NewAuthHandler (uc AuthUsecase) *AuthHandler {
	return &AuthHandler{
		usecase: uc,
	}
}

func (h *AuthHandler) Register(c *gin.Context) {
	var reqBody request.RegisterRequest

	if err := c.ShouldBindJSON(&reqBody); err != nil {
		c.Error(utils.ErrBadRequest(fmt.Sprintf("binding error: %v", err)))

		return
	}

	if err := h.usecase.Register(c.Request.Context(), reqBody); err != nil {
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

func (h *AuthHandler) Login(c *gin.Context) {
	var reqBody request.LoginRequest

	if err := c.ShouldBindJSON(&reqBody); err != nil {
		c.Error(utils.ErrBadRequest(fmt.Sprintf("binding error: %v", err)))

		return
	}

	token, err := h.usecase.Login(c.Request.Context(), reqBody)
	if err != nil {
		c.Error(utils.ErrUnauthorize("invalid username or password"))
		return
	}

	c.JSON(http.StatusOK, response.JSONResponse{
		Message: "success",
		Data: response.LoginResponse{
			Token: token,
		},
	})
}