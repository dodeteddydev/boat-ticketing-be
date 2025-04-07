import { prisma } from "../../config/database";
import { ActiveRequest } from "../../types/activeRequest";
import { Pageable } from "../../types/pageable";
import { ErrorResponse } from "../../utilities/errorResponse";
import { validation } from "../../utilities/validation";
import { activeValidation } from "../../validation/activeValidation";
import { convertCountryGlobalResponse } from "../country/country-model";
import { CountryService } from "../country/country-service";
import { convertProvinceGlobalResponse } from "../province/province-model";
import { ProvinceService } from "../province/province-service";
import { convertUserGlobalResponse } from "../user/user-model";
import {
  CityRequest,
  CityResponse,
  convertCityResponse,
  FilterCityRequest,
} from "./city-model";
import { CityValidation } from "./city-validation";

export class CityService {
  static async checkCityExist(cityName: string) {
    const city = await prisma.city.findFirst({
      where: {
        OR: [{ city_name: cityName }],
      },
    });

    const errorMessage =
      city?.city_name === cityName
        ? "City name is already exist"
        : "City is already exist";

    if (city) throw new ErrorResponse(400, "Failed create city", errorMessage);
  }

  static async checkCityExistById(
    cityId: number
  ): Promise<{ cityName: string }> {
    const existingCity = await prisma.city.findUnique({
      where: { id: cityId },
    });

    if (!existingCity) {
      throw new ErrorResponse(
        404,
        "City not found",
        "City with this ID doesn't exist!"
      );
    }

    return { cityName: existingCity.city_name };
  }

  static async create(
    request: CityRequest,
    userId: number
  ): Promise<CityResponse> {
    const createRequest = validation(CityValidation.create, request);

    await CountryService.checkCountryExistById(createRequest.countryId);

    await ProvinceService.checkProvinceExistById(createRequest.provinceId);

    await this.checkCityExist(createRequest.cityName);

    const createdCity = await prisma.city.create({
      data: {
        city_name: createRequest.cityName,
        country: { connect: { id: Number(createRequest.countryId) } },
        province: { connect: { id: Number(createRequest.provinceId) } },
        created_by: { connect: { id: Number(userId) } },
      },
      include: {
        created_by: true,
        country: true,
        province: true,
      },
    });

    return convertCityResponse(
      createdCity,
      convertUserGlobalResponse(createdCity.created_by),
      convertCountryGlobalResponse(createdCity.country),
      convertProvinceGlobalResponse(createdCity.province)
    );
  }

  static async update(request: CityRequest, id: number): Promise<CityResponse> {
    const updateRequest = validation(CityValidation.create, request);

    const { cityName } = await this.checkCityExistById(id);

    if (updateRequest.cityName !== cityName) {
      await CountryService.checkCountryExistById(updateRequest.countryId);
      await ProvinceService.checkProvinceExistById(updateRequest.provinceId);
      await this.checkCityExist(updateRequest.cityName);
    }

    const updatedCity = await prisma.city.update({
      where: { id },
      data: {
        city_name: updateRequest.cityName,
        country: { connect: { id: Number(updateRequest.countryId) } },
        province: { connect: { id: Number(updateRequest.provinceId) } },
      },
      include: {
        created_by: true,
        country: true,
        province: true,
      },
    });

    return convertCityResponse(
      updatedCity,
      convertUserGlobalResponse(updatedCity.created_by),
      convertCountryGlobalResponse(updatedCity.country),
      convertProvinceGlobalResponse(updatedCity.province)
    );
  }

  static async active(
    request: ActiveRequest,
    id: number
  ): Promise<{ active: boolean }> {
    const activeRequest = validation(activeValidation, request);

    await this.checkCityExistById(id);

    const updatedActive = await prisma.city.update({
      where: { id },
      data: {
        active: activeRequest.active,
      },
    });

    return { active: updatedActive.active };
  }

  static async get(
    request: FilterCityRequest
  ): Promise<Pageable<CityResponse>> {
    const getRequest = validation(CityValidation.get, request);
    const skip = (getRequest.page - 1) * getRequest.size;

    const filters = [];

    if (getRequest.countryId) {
      filters.push({
        country_id: Number(getRequest.countryId),
      });
    }

    if (getRequest.provinceId) {
      filters.push({
        province_id: Number(getRequest.provinceId),
      });
    }

    if (getRequest.search) {
      filters.push({
        OR: [
          {
            city_name: {
              contains: getRequest.search,
            },
          },
        ],
      });
    }

    const getProvince = await prisma.city.findMany({
      where: {
        AND: filters,
      },
      orderBy: {
        created_at: "desc",
      },
      take: getRequest.all ? undefined : getRequest.size,
      skip: getRequest.all ? undefined : skip,
      include: {
        created_by: true,
        country: true,
        province: true,
      },
    });

    const total = await prisma.city.count({
      where: {
        AND: filters,
      },
    });

    return {
      data: getProvince.map((value) =>
        convertCityResponse(
          value,
          convertUserGlobalResponse(value.created_by),
          convertCountryGlobalResponse(value.country),
          convertProvinceGlobalResponse(value.province)
        )
      ),
      paging: getRequest.all
        ? undefined
        : {
            currentPage: getRequest.page,
            totalPage: Math.ceil(total / getRequest.size),
            size: getRequest.size,
          },
    };
  }

  static async delete(id: number): Promise<string> {
    await this.checkCityExistById(id);

    await prisma.city.delete({
      where: { id },
    });

    return `City with ID ${id} is deleted`;
  }
}
