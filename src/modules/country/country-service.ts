import { prisma } from "../../config/database";
import { ErrorResponse } from "../../utilities/error-response";
import { validation } from "../../utilities/validation";
import {
  convertToCreateOrUpdateCountryResponse,
  CreateOrUpdateCountryRequest,
  CreateOrUpdateCountryResponse,
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
    request: CreateOrUpdateCountryRequest
  ): Promise<CreateOrUpdateCountryResponse> {
    const createRequest = validation(CountryValidation.create, request);

    await this.checkCountryExist(
      createRequest.countryName,
      createRequest.countryCode
    );

    const country = await prisma.country.create({
      data: {
        country_name: createRequest.countryName,
        country_code: createRequest.countryCode,
      },
    });

    return convertToCreateOrUpdateCountryResponse(country, { id: 1, name: "" });
  }
}
