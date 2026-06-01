import type { Meta } from "./user";

export interface CityData {
  cities: City[];
}

export interface City {
  id: number;
  name: string;
}

export interface SdmCity {
  data: CityListData;
}

export interface CityListData {
  cities: CityList[];
  meta: Meta;
}

export interface CityList {
  id: number;
  name: string;
  province: string;
  island: string;
  is_abroad: boolean;
  latitude: number;
  longitude: number;
}
