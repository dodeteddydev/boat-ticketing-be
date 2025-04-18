import { prisma } from "../../config/database";
import { ActiveRequest } from "../../types/activeRequest";
import { Pageable } from "../../types/pageable";
import { ErrorResponse } from "../../utilities/errorResponse";
import { validation } from "../../utilities/validation";
import { activeValidation } from "../../validation/activeValidation";
import { convertCountryGlobalResponse } from "../country/country-model";
import { CountryService } from "../country/country-service";
import { convertUserGlobalResponse } from "../user/user-model";
import {
  convertProvinceResponse,
  FilterProvinceRequest,
  ProvinceRequest,
  ProvinceResponse,
} from "./province-model";
import { ProvinceValidation } from "./province-validation";

export class ProvinceService {
  static async checkProvinceExist(provinceName: string, provinceCode: string) {
    const province = await prisma.province.findFirst({
      where: {
        OR: [{ province_name: provinceName }, { province_code: provinceCode }],
      },
    });

    const errorMessage =
      province?.province_name === provinceName
        ? "Province name is already exist"
        : province?.province_code === provinceCode
        ? "Province code already exist"
        : "Province is already exist";

    if (province)
      throw new ErrorResponse(400, "Failed create province", errorMessage);
  }

  static async checkProvinceExistById(
    provinceId: number
  ): Promise<{ provinceName: string; provinceCode: string | null }> {
    const existingProvince = await prisma.province.findUnique({
      where: { id: provinceId },
    });

    if (!existingProvince) {
      throw new ErrorResponse(
        404,
        "Province not found",
        "Province with this ID doesn't exist!"
      );
    }

    return {
      provinceName: existingProvince.province_name,
      provinceCode: existingProvince.province_code,
    };
  }

  static async create(
    request: ProvinceRequest,
    userId: number
  ): Promise<ProvinceResponse> {
    const createRequest = validation(ProvinceValidation.create, request);

    await CountryService.checkCountryExistById(createRequest.countryId);

    await this.checkProvinceExist(
      createRequest.provinceName,
      createRequest.provinceCode
    );

    const createdProvince = await prisma.province.create({
      data: {
        province_name: createRequest.provinceName,
        province_code: createRequest.provinceCode,
        country: { connect: { id: Number(createRequest.countryId) } },
        created_by: { connect: { id: Number(userId) } },
      },
      include: {
        created_by: true,
        country: true,
      },
    });

    return convertProvinceResponse(
      createdProvince,
      convertUserGlobalResponse(createdProvince.created_by),
      convertCountryGlobalResponse(createdProvince.country)
    );
  }

  static async update(
    request: ProvinceRequest,
    id: number
  ): Promise<ProvinceResponse> {
    const updateRequest = validation(ProvinceValidation.create, request);

    const { provinceName, provinceCode } = await this.checkProvinceExistById(
      id
    );

    if (
      updateRequest.provinceName !== provinceName &&
      updateRequest.provinceCode !== provinceCode
    ) {
      await CountryService.checkCountryExistById(updateRequest.countryId);

      await this.checkProvinceExist(
        updateRequest.provinceName,
        updateRequest.provinceCode
      );
    }

    await CountryService.checkCountryExistById(updateRequest.countryId);

    const updatedProvince = await prisma.province.update({
      where: { id },
      data: {
        province_name: updateRequest.provinceName,
        province_code: updateRequest.provinceCode,
        country: { connect: { id: Number(updateRequest.countryId) } },
      },
      include: {
        created_by: true,
        country: true,
      },
    });

    return convertProvinceResponse(
      updatedProvince,
      convertUserGlobalResponse(updatedProvince.created_by),
      convertCountryGlobalResponse(updatedProvince.country)
    );
  }

  static async active(
    request: ActiveRequest,
    id: number
  ): Promise<{ active: boolean }> {
    const activeRequest = validation(activeValidation, request);

    await this.checkProvinceExistById(id);

    const updatedActive = await prisma.province.update({
      where: { id },
      data: {
        active: activeRequest.active,
      },
    });

    return { active: updatedActive.active };
  }

  static async get(
    request: FilterProvinceRequest
  ): Promise<Pageable<ProvinceResponse>> {
    const getRequest = validation(ProvinceValidation.get, request);
    const skip = (getRequest.page - 1) * getRequest.size;

    const filters = [];

    if (getRequest.countryId) {
      filters.push({
        country_id: Number(getRequest.countryId),
      });
    }

    if (getRequest.search) {
      filters.push({
        OR: [
          {
            province_name: {
              contains: getRequest.search,
            },
          },
          {
            province_code: {
              contains: getRequest.search,
            },
          },
        ],
      });
    }

    const getProvince = await prisma.province.findMany({
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
      },
    });

    const total = await prisma.province.count({
      where: {
        AND: filters,
      },
    });

    return {
      data: getProvince.map((value) =>
        convertProvinceResponse(
          value,
          convertUserGlobalResponse(value.created_by),
          convertCountryGlobalResponse(value.country)
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
    await this.checkProvinceExistById(id);

    await prisma.province.delete({
      where: { id },
      include: {
        created_by: true,
      },
    });

    return `Province with ID ${id} is deleted`;
  }
}
