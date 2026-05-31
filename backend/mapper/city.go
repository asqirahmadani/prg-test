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