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
			auth.POST("/login", handler.Auth.Login)
		}

		users := root.Group("/users")
		users.Use(middleware.AuthMiddleware(cfg.JWT))
		{
			users.GET("/profile", handler.Auth.Profile)
		}

		travel := root.Group("/travels")
		travel.Use(middleware.AuthMiddleware(cfg.JWT))
		{
			travel.Use(middleware.RoleAccess("user"))
			travel.POST("", handler.Travel.CreateTrip)
			travel.GET("/list", handler.Travel.UserTravelList)
		}

		city := root.Group("/city")
		city.Use(middleware.AuthMiddleware(cfg.JWT))
		{
			city.Use(middleware.RoleAccess("sdm"))
			city.POST("", handler.City.CreateCity)
		}
	}

	return r
}