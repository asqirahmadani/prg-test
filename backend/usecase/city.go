package usecase

import (
	"context"
	"perdin-backend/dto/request"
	"perdin-backend/model/entity"
	"perdin-backend/utils"
)

type CityRepository interface {
	CreateCity(c context.Context, data entity.CreateCity) (error)
	ExistsByName(c context.Context, cityName string) (bool, error)
}

type CityUsecase struct {
	repo	CityRepository
}

func NewCityUsecase(r CityRepository) *CityUsecase {
	return &CityUsecase{
		repo: r,
	}
}

func(u *CityUsecase) CreateCity(c context.Context, data request.CreateCityRequest) error {
	exists, err := u.repo.ExistsByName(c, data.Name)
	if err != nil {
		return err
	}
	if exists {
		return utils.ErrUnprocessableEntity("city already exists")
	}

	if err := u.repo.CreateCity(c, entity.CreateCity{
		Name: data.Name,
		Province: data.Province,
		Island: data.Island,
		IsAbroad: data.IsAbroad,
		Longitude: data.Longitude,
		Latitude: data.Latitude,
	}); err != nil {
		return err
	}
	
	return nil
}