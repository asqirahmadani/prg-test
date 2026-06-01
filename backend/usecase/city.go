package usecase

import (
	"context"
	"fmt"
	"math"
	"perdin-backend/dto/request"
	"perdin-backend/dto/response"
	"perdin-backend/mapper"
	"perdin-backend/model/entity"
	"perdin-backend/utils"
)

type CityRepository interface {
	CreateCity(c context.Context, data entity.CreateCity) (error)
	ExistsByName(c context.Context, cityName string) (bool, error)
	GetCities(c context.Context) ([]entity.CityList, error)
	CityList(c context.Context, queryPagination string, values []any) ([]entity.CityData, error)
	CityListMetadata(c context.Context) (int, error)
	DeleteCityByID(c context.Context, cityID int) error
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

func(u *CityUsecase) GetCities(c context.Context) ([]response.CityResponse, error) {
	cities, err := u.repo.GetCities(c)
	if err != nil {
		return nil, err
	}
	
	return mapper.CityToResponses(cities), nil
}

func(u *CityUsecase) CityList(c context.Context, data request.CityListQueryRequest) (response.CityListResponse, error) {
	paginationQuery, values := u.writePaginationQuery(data.Page, data.Limit)

	cities, err := u.repo.CityList(c, paginationQuery, values)
	if err != nil {
		return response.CityListResponse{}, err
	}

	meta, err := u.getCityListMetadata(c, data.Page, data.Limit)
	if err != nil {
		return response.CityListResponse{}, err
	}

	return response.CityListResponse{
		Cities: mapper.SdmCityToResponses(cities),
		Meta: meta,
	}, nil
}

func (u *CityUsecase) writePaginationQuery(page, limit int) (string, []any) {
	var values []any

	values = append(values, limit)
	values = append(values, (page-1)*limit)

	return fmt.Sprintf(" LIMIT $%d OFFSET $%d;", 1, 2), values
}

func (u *CityUsecase) getCityListMetadata(c context.Context, page, limit int) (response.PaginationResponse, error) {
	total, err :=   u.repo.CityListMetadata(c)
	if err != nil {
		return response.PaginationResponse{}, err
	}
	
	return response.PaginationResponse{
		CurrentPage: page,
		LastPage:    int(math.Ceil(float64(total) / float64(limit))),
		PerPage:     limit,
		Total:       total,
	}, nil
}

func (u *CityUsecase) DeleteCity(c context.Context, cityID int) error {
	if err := u.repo.DeleteCityByID(c, cityID); err != nil {
		return err
	}
	
	return nil
}