package usecase

import (
	"context"

	"perdin-backend/dto/request"
	"perdin-backend/model/constant"
	"perdin-backend/model/entity"
	"perdin-backend/utils"
)

type TravelRepository interface {
	CreateTrip(c context.Context, data entity.OfficialTravel) error
	GetCityDistance(c context.Context, originID, destinationID int) (int, error)
	GetCityByID(c context.Context, cityID int) (entity.City, error)
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