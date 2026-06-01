package mapper

import (
	"perdin-backend/dto/response"
	"perdin-backend/model/entity"
)

func CityToResponses(data []entity.CityList) []response.CityResponse {
	res := make([]response.CityResponse, len(data))
	for i, b := range data {
		res[i] = cityToResponse(b)
	}
	return res
}

func cityToResponse(data entity.CityList) response.CityResponse {
	return response.CityResponse{
		ID: data.ID,
		Name: data.Name,
	}
}

func SdmCityToResponses(data []entity.CityData) []response.City {
	res := make([]response.City, len(data))
	for i, b := range data {
		res[i] = sdmCityToResponse(b)
	}
	return res
}

func sdmCityToResponse(data entity.CityData) response.City {
	return response.City{
		ID: data.ID,
		Name: data.Name,
		Province: data.Province,
		Island: data.Island,
		IsAbroad: data.IsAbroad,
		Latitude: data.Latitude,
		Longitude: data.Longitude,
	}
}