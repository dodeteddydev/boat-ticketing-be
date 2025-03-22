import { Province } from "@prisma/client";
import { UserGlobalResponse } from "../user/user-model";
import { CountryGlobalResponse } from "../country/country-model";

export type ProvinceGlobalResponse = {
  id: number;
  provinceName: string;
  provinceCode: string;
};

export type ProvinceResponse = {
  id: number;
  provinceName: string;
  provinceCode: string;
  country: CountryGlobalResponse;
  createdBy: UserGlobalResponse | null;
  createdAt: string;
  updatedAt: string;
  active: boolean;
};

export type ProvinceRequest = {
  provinceName: string;
  provinceCode: string;
  countryId: number;
};

export type FilterProvinceRequest = {
  search?: string;
  countryId?: number;
  page: number;
  size: number;
};

export const convertProvinceResponse = (
  province: Province,
  createdBy: UserGlobalResponse,
  country: CountryGlobalResponse
): ProvinceResponse => {
  return {
    id: province.id,
    provinceName: province.province_name,
    provinceCode: province.province_code,
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
    provinceName: province.province_name,
    provinceCode: province.province_code,
  };
};
