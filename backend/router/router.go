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

		city := root.Group("/cities")
		city.Use(middleware.AuthMiddleware(cfg.JWT))
		{
			city.GET("", handler.City.GetCities)
		}

		sdm := root.Group("/sdm")
		sdm.Use(middleware.AuthMiddleware(cfg.JWT))
		{
			sdm.Use(middleware.RoleAccess("sdm"))

			sdm.GET("travels", handler.Travel.SdmTravelList)
			sdm.POST("travels/:travel_id/approve", handler.Travel.ApproveTravelRequest)
			sdm.POST("travels/:travel_id/decline", handler.Travel.DeclineTravelRequest)

			sdm.GET("cities", handler.City.CityList)
			sdm.POST("cities", handler.City.CreateCity)
		}
	}

	return r
}