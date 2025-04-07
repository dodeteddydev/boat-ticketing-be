import { Port } from "@prisma/client";
import { CityGlobalResponse } from "../city/city-model";
import { CountryGlobalResponse } from "../country/country-model";
import { ProvinceGlobalResponse } from "../province/province-model";
import { UserGlobalResponse } from "../user/user-model";

export type PortGlobalResponse = {
  id: number;
  portName: string;
  portCode: string;
};

export type PortResponse = {
  id: number;
  portName: string;
  portCode: string;
  country: CountryGlobalResponse;
  province: ProvinceGlobalResponse;
  city: CityGlobalResponse;
  createdBy: UserGlobalResponse | null;
  createdAt: string;
  updatedAt: string;
  active: boolean;
};

export type PortRequest = {
  portName: string;
  portCode: string;
  countryId: number;
  provinceId: number;
  cityId: number;
};

export type FilterPortRequest = {
  search?: string;
  countryId?: number;
  provinceId?: number;
  cityId?: number;
  page: number;
  size: number;
  all?: boolean;
};

export const convertPortResponse = (
  port: Port,
  country: CountryGlobalResponse,
  province: ProvinceGlobalResponse,
  city: CityGlobalResponse,
  createdBy: UserGlobalResponse
): PortResponse => {
  return {
    id: port.id,
    portName: port.port_name,
    portCode: port.port_code,
    country: country,
    province: province,
    city: city,
    createdBy: createdBy,
    createdAt: port.created_at.toISOString(),
    updatedAt: port.updated_at.toISOString(),
    active: port.active,
  };
};

export const convertPortGlobalResponse = (port: Port): PortGlobalResponse => {
  return {
    id: port.id,
    portName: port.port_name,
    portCode: port.port_code,
  };
};
