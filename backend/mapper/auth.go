package mapper

import (
	"perdin-backend/dto/response"
	"perdin-backend/model/entity"
)

func UserProfileToResponse(data entity.UserProfile) response.ProfileUserResponse {
	return response.ProfileUserResponse{
		Name: data.Name,
		Username: data.Username,
	}
}