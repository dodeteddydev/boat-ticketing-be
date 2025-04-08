import { prisma } from "../../config/database";
import { ActiveRequest } from "../../types/activeRequest";
import { Pageable } from "../../types/pageable";
import { ErrorResponse } from "../../utilities/errorResponse";
import { validation } from "../../utilities/validation";
import { activeValidation } from "../../validation/activeValidation";
import { convertCityGlobalResponse } from "../city/city-model";
import { CityService } from "../city/city-service";
import { convertCountryGlobalResponse } from "../country/country-model";
import { CountryService } from "../country/country-service";
import { convertProvinceGlobalResponse } from "../province/province-model";
import { ProvinceService } from "../province/province-service";
import { convertUserGlobalResponse } from "../user/user-model";
import {
  convertPortResponse,
  FilterPortRequest,
  PortRequest,
  PortResponse,
} from "./port-model";
import { PortValidation } from "./port-validation";

export class PortService {
  static async checkPortExist(portName: string, portCode: string) {
    const port = await prisma.port.findFirst({
      where: {
        OR: [{ port_name: portName }, { port_code: portCode }],
      },
    });

    const errorMessage =
      port?.port_name === portName
        ? "Port name is already exist"
        : port?.port_code === portCode
        ? "Port code already exist"
        : "Port is already exist";

    if (port) throw new ErrorResponse(400, "Failed create port", errorMessage);
  }

  static async checkPortExistById(
    portId: number
  ): Promise<{ portName: string; portCode: string }> {
    const existingPort = await prisma.port.findUnique({
      where: { id: portId },
    });

    if (!existingPort) {
      throw new ErrorResponse(
        404,
        "Port not found",
        "Port with this ID doesn't exist!"
      );
    }

    return {
      portName: existingPort.port_name,
      portCode: existingPort.port_code,
    };
  }

  static async create(
    request: PortRequest,
    userId: number
  ): Promise<PortResponse> {
    const createRequest = validation(PortValidation.create, request);

    await this.checkPortExist(createRequest.portName, createRequest.portCode);
    await CountryService.checkCountryExistById(createRequest.countryId);
    await ProvinceService.checkProvinceExistById(createRequest.provinceId);
    await CityService.checkCityExistById(createRequest.cityId);

    const createdPort = await prisma.port.create({
      data: {
        port_name: createRequest.portName,
        port_code: createRequest.portCode,
        country: { connect: { id: Number(createRequest.countryId) } },
        province: { connect: { id: Number(createRequest.provinceId) } },
        city: { connect: { id: Number(createRequest.cityId) } },
        created_by: { connect: { id: Number(userId) } },
      },
      include: {
        country: true,
        province: true,
        city: true,
        created_by: true,
      },
    });

    return convertPortResponse(
      createdPort,
      convertCountryGlobalResponse(createdPort.country),
      convertProvinceGlobalResponse(createdPort.province),
      convertCityGlobalResponse(createdPort.city),
      convertUserGlobalResponse(createdPort.created_by)
    );
  }

  static async update(request: PortRequest, id: number): Promise<PortResponse> {
    const updateRequest = validation(PortValidation.create, request);

    const { portName, portCode } = await this.checkPortExistById(id);

    if (
      updateRequest.portName !== portName &&
      updateRequest.portCode !== portCode
    ) {
      await this.checkPortExist(updateRequest.portName, updateRequest.portCode);
    }

    const updatedPort = await prisma.port.update({
      where: { id },
      data: {
        port_name: updateRequest.portName,
        port_code: updateRequest.portCode,
        country: { connect: { id: Number(updateRequest.countryId) } },
        province: { connect: { id: Number(updateRequest.provinceId) } },
        city: { connect: { id: Number(updateRequest.cityId) } },
      },
      include: {
        country: true,
        province: true,
        city: true,
        created_by: true,
      },
    });

    return convertPortResponse(
      updatedPort,
      convertCountryGlobalResponse(updatedPort.country),
      convertProvinceGlobalResponse(updatedPort.province),
      convertCityGlobalResponse(updatedPort.city),
      convertUserGlobalResponse(updatedPort.created_by)
    );
  }

  static async active(
    request: ActiveRequest,
    id: number
  ): Promise<{ active: boolean }> {
    const activeRequest = validation(activeValidation, request);

    await this.checkPortExistById(id);

    const updatedActive = await prisma.port.update({
      where: { id },
      data: {
        active: activeRequest.active,
      },
    });

    return { active: updatedActive.active };
  }

  static async get(
    request: FilterPortRequest
  ): Promise<Pageable<PortResponse>> {
    const getRequest = validation(PortValidation.get, request);

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

    if (getRequest.cityId) {
      filters.push({
        city_id: Number(getRequest.cityId),
      });
    }

    if (getRequest.search) {
      filters.push({
        OR: [
          {
            port_name: {
              contains: getRequest.search,
            },
          },
          {
            port_code: {
              contains: getRequest.search,
            },
          },
        ],
      });
    }

    const getPort = await prisma.port.findMany({
      where: {
        AND: filters,
      },
      orderBy: {
        created_at: "desc",
      },
      take: getRequest.all ? undefined : getRequest.size,
      skip: getRequest.all ? undefined : skip,
      include: {
        country: true,
        province: true,
        city: true,
        created_by: true,
      },
    });

    const total = await prisma.port.count({
      where: {
        AND: filters,
      },
    });

    return {
      data: getPort.map((value) =>
        convertPortResponse(
          value,
          convertCountryGlobalResponse(value.country),
          convertProvinceGlobalResponse(value.province),
          convertCityGlobalResponse(value.city),
          convertUserGlobalResponse(value.created_by)
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
    await this.checkPortExistById(id);

    await prisma.port.delete({
      where: { id },
      include: {
        created_by: true,
      },
    });

    return `Port with ID ${id} is deleted`;
  }
}
