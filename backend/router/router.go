package router

import (
	"perdin-backend/config"
	"perdin-backend/middleware"
	"time"

	"github.com/gin-gonic/gin"
)

func SetupRouter(cfg config.Config) *gin.Engine {
	r := gin.New()

	r.Use(
		middleware.CORSMiddleware(),
		gin.Recovery(),
		middleware.LoggerMiddleware(),
		middleware.ErrorMiddleware(),
		middleware.TimeoutMiddleware(time.Duration(cfg.App.RequestTimeout)*time.Second),
	)

	return r
}