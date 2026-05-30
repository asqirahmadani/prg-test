package router

import (
	"perdin-backend/config"
	"perdin-backend/handler"
	"perdin-backend/middleware"
	"time"

	"github.com/gin-gonic/gin"
)

func SetupRouter(cfg config.Config, handler *handler.Handlers) *gin.Engine {
	r := gin.New()

	r.Use(
		middleware.CORSMiddleware(),
		gin.Recovery(),
		middleware.LoggerMiddleware(),
		middleware.ErrorMiddleware(),
		middleware.TimeoutMiddleware(time.Duration(cfg.App.RequestTimeout)*time.Second),
	)

	root := r.Group("/api/v1")
	{
		auth := root.Group("/auth")
		{
			auth.POST("/register", handler.Auth.Register)
		}
	}

	return r
}