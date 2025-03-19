import { Country } from "@prisma/client";
import { CreatedBy } from "../../types/createBy";

export type CountryResponse = {
  id: number;
  countryName: string;
  countryCode: string;
  createdBy: CreatedBy | null;
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
};

export const convertToCountryResponse = (
  country: Country,
  createdBy: CreatedBy
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
