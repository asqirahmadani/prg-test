package usecase

import (
	"context"
	"fmt"
	"math"
	"strings"

	"perdin-backend/dto/request"
	"perdin-backend/dto/response"
	"perdin-backend/mapper"
	"perdin-backend/model/constant"
	"perdin-backend/model/entity"
	"perdin-backend/utils"
)

type TravelRepository interface {
	CreateTrip(c context.Context, data entity.OfficialTravel) error
	GetCityDistance(c context.Context, originID, destinationID int) (int, error)
	GetCityByID(c context.Context, cityID int) (entity.City, error)
	GetUserTravelList(c context.Context, condition, pagination string, values []any) ([]entity.TravelList, error)
	TravelListMetadata(c context.Context, conditionQuery string, values []any) (int, error)
}

type TravelUsecase struct {
	repo	TravelRepository
}

func NewTravelUsecase(r TravelRepository) *TravelUsecase {
	return &TravelUsecase{
		repo: r,
	}
}

func (u *TravelUsecase) CreateTrip(c context.Context, data request.CreateTripRequest) error {
	if data.ReturnDate.Before(data.DepartureDate) {
		return utils.ErrUnprocessableEntity("return date cannot berfore departure date")
	}

	tripDuration := int(data.ReturnDate.Sub(data.DepartureDate).Hours() / 24)

	allowance, err := u.getAllowance(c, data.OriginCityID, data.DestinationCityID, tripDuration)
	if err != nil {
		return err
	}

	if err := u.repo.CreateTrip(c, entity.OfficialTravel{
		UserID: *data.UserID,
		DepartureDate: data.DepartureDate,
		ReturnDate: data.ReturnDate,
		OriginCityID: data.OriginCityID,
		DestinationCityID: data.DestinationCityID,
		Description: data.Description,
		TripDuration: tripDuration,
		Allowance: allowance,
	}); err != nil {
		return err
	}
	
	return nil
}

func (u *TravelUsecase) getAllowance(c context.Context, originID, destinationID, tripDuration int) (float64, error) {
	distance, err := u.repo.GetCityDistance(c, originID, destinationID)
	if err != nil {
		return 0, err
	}

	if distance <= 60 {
		return 0, nil
	}

	origin, err := u.repo.GetCityByID(c, originID)
	if err != nil {
		return 0, err
	}

	destination, err := u.repo.GetCityByID(c, destinationID)
	if err != nil {
		return 0, err
	}

	if destination.IsAbroad {
		return (constant.USDtoIDR * float64(tripDuration)), nil
	}

	if origin.Province != destination.Province && origin.Island != destination.Island {
		return float64(300000 * tripDuration), nil
	}

	if origin.Province != destination.Province && origin.Island == destination.Island {
		return float64(250000 * tripDuration), nil
	}

	if origin.Province == destination.Province {
		return float64(200000 * tripDuration), nil
	}

	return 0, utils.ErrBadRequest("unavailable trip")
}

func (u *TravelUsecase) UserTravelList(c context.Context, data request.TravelListQueryRequest, userID int) (response.TravelListResponse, error) {
	conditionQuery, args, values := u.buildQueryCondition(entity.QueryCondition{UserID: &userID})
	paginationQuery, finalValues := u.writePaginationQuery(data.Page, data.Limit, args, values)

	travels, err := u.repo.GetUserTravelList(c, conditionQuery, paginationQuery, finalValues)
	if err != nil {
		return response.TravelListResponse{}, err
	}

	meta, err := u.getTravelListMetadata(c, data.Page, data.Limit, conditionQuery, values)
	if err != nil {
		return response.TravelListResponse{}, err
	}

	return response.TravelListResponse{
		Travels: mapper.TravelListToResponses(travels),
		Meta: meta,
	}, nil
}

func(u *TravelUsecase) buildQueryCondition(cond entity.QueryCondition) (string, int, []any) {
	var (
        whereCondition strings.Builder
        where          []string
        values         []any
    )
    args := 1

	if cond.UserID != nil {
        where = append(where, fmt.Sprintf("ot.user_id = $%d", args))
        values = append(values, *cond.UserID)
        args++
    }

	if len(where) > 0 {
        whereCondition.WriteString(" WHERE ")
        whereCondition.WriteString(strings.Join(where, " AND "))
    }

    return whereCondition.String(), args, values
}

func (u *TravelUsecase) writePaginationQuery(page, limit, args int, values []any) (string, []any) {
	values = append(values, limit)
	values = append(values, (page-1)*limit)

	return fmt.Sprintf(" LIMIT $%d OFFSET $%d;", args, args+1), values
}

func (u *TravelUsecase) getTravelListMetadata(c context.Context, page, limit int, conditionQuery string, values []any) (response.PaginationResponse, error) {
	total, err :=   u.repo.TravelListMetadata(c, conditionQuery, values)
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