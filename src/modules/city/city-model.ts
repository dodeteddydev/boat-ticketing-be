import { City } from "@prisma/client";
import { CountryGlobalResponse } from "../country/country-model";
import { ProvinceGlobalResponse } from "../province/province-model";
import { UserGlobalResponse } from "../user/user-model";

export type CityGlobalResponse = {
  id: number;
  cityName: string;
};

export type CityResponse = {
  id: number;
  cityName: string;

  country: CountryGlobalResponse;
  province: ProvinceGlobalResponse;
  createdBy: UserGlobalResponse | null;
  createdAt: string;
  updatedAt: string;
  active: boolean;
};

export type CityRequest = {
  cityName: string;

  countryId: number;
  provinceId: number;
};

export type FilterCityRequest = {
  search?: string;
  countryId?: number;
  provinceId?: number;
  page: number;
  size: number;
};

export const convertCityResponse = (
  city: City,
  createdBy: UserGlobalResponse,
  country: CountryGlobalResponse,
  province: ProvinceGlobalResponse
): CityResponse => {
  return {
    id: city.id,
    cityName: city.city_name,

    country: country,
    province: province,
    createdBy: createdBy,
    createdAt: city.created_at.toISOString(),
    updatedAt: city.updated_at.toISOString(),
    active: city.active,
  };
};

export const convertCityGlobalResponse = (city: City): CityGlobalResponse => {
  return {
    id: city.id,
    cityName: city.city_name,
  };
};
