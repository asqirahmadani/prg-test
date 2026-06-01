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

func SdmTravelListToResponses(data []entity.SdmTravelList) []response.SdmTravel {
	res := make([]response.SdmTravel, len(data))
	for i, b := range data {
		res[i] = sdmTravelListToResponse(b)
	}
	return res
}

func sdmTravelListToResponse(data entity.SdmTravelList) response.SdmTravel {
	return response.SdmTravel{
		ID: data.ID,
		UserName: data.UserName,
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