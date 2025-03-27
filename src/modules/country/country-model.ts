import { Country } from "@prisma/client";
import { UserGlobalResponse } from "../user/user-model";

export type CountryGlobalResponse = {
  id: number;
  countryName: string;
  countryCode: string;
};

export type CountryResponse = {
  id: number;
  countryName: string;
  countryCode: string;
  createdBy: UserGlobalResponse | null;
  createdAt: string;
  updatedAt: string;
  active: boolean;
};

export type CountryRequest = {
  countryName: string;
  countryCode: string;
};

export type FilterCountryRequest = {
  search?: string;
  page: number;
  size: number;
  all?: boolean;
};

export const convertCountryResponse = (
  country: Country,
  createdBy: UserGlobalResponse
): CountryResponse => {
  return {
    id: country.id,
    countryName: country.country_name,
    countryCode: country.country_code,
    createdBy: createdBy,
    createdAt: country.created_at.toISOString(),
    updatedAt: country.updated_at.toISOString(),
    active: country.active,
  };
};

export const convertCountryGlobalResponse = (
  country: Country
): CountryGlobalResponse => {
  return {
    id: country.id,
    countryName: country.country_name,
    countryCode: country.country_code,
  };
};
