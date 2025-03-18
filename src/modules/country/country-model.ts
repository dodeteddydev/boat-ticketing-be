import { Country } from "@prisma/client";
import { CreatedBy } from "../../types/createBy";
import { Pageable, Paging } from "../../types/pageable";

export type CountryResponse = {
  id: number;
  countryName: string;
  countryCode: string;
  createdBy: CreatedBy | null;
  createdAt: string;
  updatedAt: string;
  active: boolean;
};

export type CreateOrUpdateCountryResponse = {
  id: number;
  countryName: string;
  countryCode: string;
  createdBy: CreatedBy | null;
  createdAt: string;
  updatedAt: string;
};

export type CreateOrUpdateCountryRequest = {
  id: number;
  countryName: string;
  countryCode: string;
};

export const convertToCreateOrUpdateCountryResponse = (
  country: Country,
  createdBy: CreatedBy
): CreateOrUpdateCountryResponse => {
  return {
    id: country.id,
    countryName: country.country_name,
    countryCode: country.country_code,
    createdBy: createdBy,
    createdAt: country.created_at.toISOString(),
    updatedAt: country.updated_at.toISOString(),
  };
};

type CustomCountry = Omit<Country, "created_by_id"> & CreatedBy;

export const convertToCountryListResponse = (
  country: CustomCountry[],
  paging: Paging
): Pageable<CountryResponse> => {
  return {
    data: country.map((value) => {
      return {
        id: value.id,
        countryName: value.country_name,
        countryCode: value.country_code,
        createdBy: {
          id: value.id,
          name: value.name,
        },
        createdAt: value.created_at.toISOString(),
        updatedAt: value.updated_at.toISOString(),
        active: value.active,
      } as CountryResponse;
    }),
    paging: paging,
  };
};
