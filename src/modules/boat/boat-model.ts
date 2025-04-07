import { Province } from "@prisma/client";
import { CountryGlobalResponse } from "../country/country-model";
import { UserGlobalResponse } from "../user/user-model";

export type ProvinceGlobalResponse = {
  id: number;
  boatName: string;
  boatCode: string | null;
};

export type ProvinceResponse = {
  id: number;
  boatName: string;
  boatCode: string | null;
  country: CountryGlobalResponse;
  createdBy: UserGlobalResponse | null;
  createdAt: string;
  updatedAt: string;
  active: boolean;
};

export type ProvinceRequest = {
  boatName: string;
  boatCode: string;
  countryId: number;
};

export type FilterProvinceRequest = {
  search?: string;
  countryId?: number;
  page: number;
  size: number;
  all?: boolean;
};

export const convertProvinceResponse = (
  province: Province,
  createdBy: UserGlobalResponse,
  country: CountryGlobalResponse
): ProvinceResponse => {
  return {
    id: province.id,
    boatName: province.province_name,
    boatCode: province.province_code,
    country: country,
    createdBy: createdBy,
    createdAt: province.created_at.toISOString(),
    updatedAt: province.updated_at.toISOString(),
    active: province.active,
  };
};

export const convertProvinceGlobalResponse = (
  province: Province
): ProvinceGlobalResponse => {
  return {
    id: province.id,
    boatName: province.province_name,
    boatCode: province.province_code,
  };
};
