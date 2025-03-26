import { prisma } from "../../config/database";
import { ActiveRequest } from "../../types/activeRequest";
import { Pageable } from "../../types/pageable";
import { ErrorResponse } from "../../utilities/errorResponse";
import { validation } from "../../utilities/validation";
import { activeValidation } from "../../validation/activeValidation";
import { convertCountryGlobalResponse } from "../country/country-model";
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
  static async checkProvinceExist(provinceId: number) {
    const province = await prisma.province.findFirst({
      where: {
        id: provinceId,
      },
    });

    if (!province)
      throw new ErrorResponse(
        404,
        "Failed create city",
        "Province doesn't exist"
      );
  }

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

  static async create(
    request: CityRequest,
    userId: number
  ): Promise<CityResponse> {
    const createRequest = validation(CityValidation.create, request);

    await ProvinceService.checkCountryExist(createRequest.countryId);

    await this.checkProvinceExist(createRequest.provinceId);

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

    const existingCity = await prisma.city.findUnique({
      where: { id },
    });

    if (!existingCity) {
      throw new ErrorResponse(
        404,
        "City not found",
        "City with this ID doesn't exist!"
      );
    }

    if (updateRequest.cityName !== existingCity.city_name) {
      await ProvinceService.checkCountryExist(updateRequest.countryId);
      await this.checkProvinceExist(updateRequest.provinceId);
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

    const existingCity = await prisma.city.findUnique({
      where: { id },
    });

    if (!existingCity) {
      throw new ErrorResponse(
        404,
        "City not found",
        "City with this ID doesn't exist!"
      );
    }

    const updatedActive = await prisma.city.update({
      where: { id },
      data: {
        active: activeRequest.active,
      },
      include: {
        created_by: true,
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
      take: getRequest.size,
      skip: skip,
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
      paging: {
        currentPage: getRequest.page,
        totalPage: Math.ceil(total / getRequest.size),
        size: getRequest.size,
      },
    };
  }

  static async delete(id: number): Promise<string> {
    const existingCity = await prisma.city.findUnique({
      where: { id },
    });

    if (!existingCity) {
      throw new ErrorResponse(
        404,
        "City not found",
        "City with this ID doesn't exist!"
      );
    }

    await prisma.city.delete({
      where: { id },
    });

    return `City with ID ${id} is deleted`;
  }
}
