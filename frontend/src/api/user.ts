import type { TravelStatus } from "../utils/user";

export interface UserTravel {
  data: UserTravelList;
}

export interface UserTravelList {
  travels: TravelList[];
  meta: Meta;
}

export interface TravelList {
  id: number;
  user_name: string;
  origin_city: string;
  destination_city: string;
  departure_date: string;
  return_date: string;
  description: string;
  trip_duration: number;
  allowance: number;
  status: TravelStatus;
}

export interface Meta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}
