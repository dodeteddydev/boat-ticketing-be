import { prisma } from "../../config/database";
import { ActiveRequest } from "../../types/activeRequest";
import { Pageable } from "../../types/pageable";
import { ErrorResponse } from "../../utilities/errorResponse";
import { validation } from "../../utilities/validation";
import { activeValidation } from "../../validation/activeValidation";
import {
  convertToCountryResponse,
  CountryRequest,
  CountryResponse,
  FilterCountryRequest,
} from "./country-model";
import { CountryValidation } from "./country-validation";

export class CountryService {
  static async checkCountryExist(countryName: string, countryCode: string) {
    const country = await prisma.country.findFirst({
      where: {
        OR: [{ country_name: countryName }, { country_code: countryCode }],
      },
    });

    const errorMessage =
      country?.country_name === countryName
        ? "Country name is already exist"
        : country?.country_code === countryCode
        ? "Country code already exist"
        : "Country is already exist";

    if (country)
      throw new ErrorResponse(400, "Failed create country", errorMessage);
  }

  static async create(
    request: CountryRequest,
    userId: number
  ): Promise<CountryResponse> {
    const createRequest = validation(CountryValidation.create, request);

    await this.checkCountryExist(
      createRequest.countryName,
      createRequest.countryCode
    );

    const createdCountry = await prisma.country.create({
      data: {
        country_name: createRequest.countryName,
        country_code: createRequest.countryCode,
        created_by: { connect: { id: Number(userId) } },
      },
      include: {
        created_by: true,
      },
    });

    return convertToCountryResponse(createdCountry, {
      id: createdCountry.created_by?.id!,
      name: createdCountry.created_by?.name!,
    });
  }

  static async update(
    request: CountryRequest,
    id: number
  ): Promise<CountryResponse> {
    const updateRequest = validation(CountryValidation.create, request);

    const existingCountry = await prisma.country.findUnique({
      where: { id },
    });

    if (!existingCountry) {
      throw new ErrorResponse(
        404,
        "Country not found",
        "Country with this ID doesn't exist!"
      );
    }

    if (
      updateRequest.countryName !== existingCountry.country_name &&
      updateRequest.countryCode !== existingCountry.country_code
    ) {
      await this.checkCountryExist(
        updateRequest.countryName,
        updateRequest.countryCode
      );
    }

    const updatedCountry = await prisma.country.update({
      where: { id },
      data: {
        country_name: updateRequest.countryName,
        country_code: updateRequest.countryCode,
      },
      include: {
        created_by: true,
      },
    });

    return convertToCountryResponse(updatedCountry, {
      id: updatedCountry.created_by?.id!,
      name: updatedCountry.created_by?.name!,
    });
  }

  static async active(
    request: ActiveRequest,
    id: number
  ): Promise<{ active: boolean }> {
    const activeRequest = validation(activeValidation, request);

    const existingCountry = await prisma.country.findUnique({
      where: { id },
    });

    if (!existingCountry) {
      throw new ErrorResponse(
        404,
        "Country not found",
        "Country with this ID doesn't exist!"
      );
    }

    const updatedActive = await prisma.country.update({
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
    request: FilterCountryRequest
  ): Promise<Pageable<CountryResponse>> {
    const getRequest = validation(CountryValidation.get, request);
    const skip = (getRequest.page - 1) * getRequest.size;

    const filters = [];

    if (getRequest.search) {
      filters.push({
        OR: [
          {
            country_name: {
              contains: getRequest.search,
            },
          },
          {
            country_code: {
              contains: getRequest.search,
            },
          },
        ],
      });
    }

    const getCountry = await prisma.country.findMany({
      where: {
        active: true,
        AND: filters,
      },
      take: getRequest.size,
      skip: skip,
      include: {
        created_by: true,
      },
    });

    const total = await prisma.country.count({
      where: {
        active: true,
        AND: filters,
      },
    });

    return {
      data: getCountry.map((value) =>
        convertToCountryResponse(value, {
          id: value.created_by?.id!,
          name: value.created_by?.name!,
        })
      ),
      paging: {
        currentPage: getRequest.page,
        totalPage: Math.ceil(total / getRequest.size),
        size: getRequest.size,
      },
    };
  }

  static async delete(id: number): Promise<string> {
    const existingCountry = await prisma.country.findUnique({
      where: { id },
    });

    if (!existingCountry) {
      throw new ErrorResponse(
        404,
        "Country not found",
        "Country with this ID doesn't exist!"
      );
    }

    await prisma.country.delete({
      where: { id },
      include: {
        created_by: true,
      },
    });

    return `Country with ID ${id} is deleted`;
  }
}
