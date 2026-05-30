package mapper

import (
	"perdin-backend/dto/response"
	"perdin-backend/model/entity"
)

func TravelListToResponses(data []entity.TravelList) []response.Travel {
	res := make([]response.Travel, len(data))
	for i, b := range data {
		res[i] = travelListToResponse(b)
	}
	return res
}

func travelListToResponse(data entity.TravelList) response.Travel {
	return response.Travel{
		ID: data.ID,
		OriginCity: data.OriginCity,
		DestinationCity: data.DestinationCity,
		DepartureDate: data.DepartureDate,
		ReturnDate: data.ReturnDate,
		Description: data.Description,
		TripDuration: data.TripDuration,
		Allowance: data.Allowance,
		Status: data.Status,
	}
}