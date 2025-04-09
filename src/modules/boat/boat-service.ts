import { prisma } from "../../config/database";
import { ActiveRequest } from "../../types/activeRequest";
import { Pageable } from "../../types/pageable";
import { ErrorResponse } from "../../utilities/errorResponse";
import { validation } from "../../utilities/validation";
import { activeValidation } from "../../validation/activeValidation";
import { convertCategoryGlobalResponse } from "../category/category-model";
import { CategoryService } from "../category/category-service";
import { convertUserGlobalResponse } from "../user/user-model";
import {
  BoatRequest,
  BoatResponse,
  convertBoatResponse,
  FilterBoatRequest,
} from "./boat-model";
import { BoatValidation } from "./boat-validation";

export class BoatService {
  static async checkBoatExist(boatName: string, boatCode: string) {
    const boat = await prisma.boat.findFirst({
      where: {
        OR: [{ boat_name: boatName }, { boat_code: boatCode }],
      },
    });

    const errorMessage =
      boat?.boat_name === boatName
        ? "Boat name is already exist"
        : boat?.boat_code === boatCode
        ? "Boat code already exist"
        : "Boat is already exist";

    if (boat) throw new ErrorResponse(400, "Failed create boat", errorMessage);
  }

  static async checkBoatExistById(
    id: number
  ): Promise<{ boatName: string; boatCode: string }> {
    const existingBoat = await prisma.boat.findUnique({
      where: { id },
    });

    if (!existingBoat) {
      throw new ErrorResponse(
        404,
        "Boat not found",
        "Boat with this ID doesn't exist!"
      );
    }

    return {
      boatName: existingBoat.boat_name,
      boatCode: existingBoat.boat_code,
    };
  }

  static async create(
    request: BoatRequest,
    userId: number
  ): Promise<BoatResponse> {
    const createRequest = validation(BoatValidation.create, request);

    await CategoryService.checkCategoryExistById(createRequest.categoryId);
    await this.checkBoatExist(createRequest.boatName, createRequest.boatCode);

    const createdBoat = await prisma.boat.create({
      data: {
        boat_name: createRequest.boatName,
        boat_code: createRequest.boatCode,
        category: { connect: { id: Number(createRequest.categoryId) } },
        created_by: { connect: { id: Number(userId) } },
      },
      include: {
        created_by: true,
        category: true,
      },
    });

    return convertBoatResponse(
      createdBoat,
      convertUserGlobalResponse(createdBoat.created_by),
      convertCategoryGlobalResponse(createdBoat.category)
    );
  }

  static async update(request: BoatRequest, id: number): Promise<BoatResponse> {
    const updateRequest = validation(BoatValidation.create, request);

    const existingBoat = await this.checkBoatExistById(id);

    if (
      updateRequest.boatName !== existingBoat.boatName &&
      updateRequest.boatCode !== existingBoat.boatCode
    ) {
      await CategoryService.checkCategoryExistById(updateRequest.categoryId);

      await this.checkBoatExist(updateRequest.boatName, updateRequest.boatCode);
    }

    await CategoryService.checkCategoryExistById(updateRequest.categoryId);

    const updatedBoat = await prisma.boat.update({
      where: { id },
      data: {
        boat_name: updateRequest.boatName,
        boat_code: updateRequest.boatCode,
        category: { connect: { id: Number(updateRequest.categoryId) } },
      },
      include: {
        created_by: true,
        category: true,
      },
    });

    return convertBoatResponse(
      updatedBoat,
      convertUserGlobalResponse(updatedBoat.created_by),
      convertCategoryGlobalResponse(updatedBoat.category)
    );
  }

  static async active(
    request: ActiveRequest,
    id: number
  ): Promise<{ active: boolean }> {
    const activeRequest = validation(activeValidation, request);

    await this.checkBoatExistById(id);

    const updatedActive = await prisma.boat.update({
      where: { id },
      data: {
        active: activeRequest.active,
      },
    });

    return { active: updatedActive.active };
  }

  static async get(
    request: FilterBoatRequest
  ): Promise<Pageable<BoatResponse>> {
    const getRequest = validation(BoatValidation.get, request);
    const skip = (getRequest.page - 1) * getRequest.size;

    const filters = [];

    if (getRequest.categoryId) {
      filters.push({
        category_id: Number(getRequest.categoryId),
      });
    }

    if (getRequest.search) {
      filters.push({
        OR: [
          {
            boat_name: {
              contains: getRequest.search,
            },
          },
          {
            boat_code: {
              contains: getRequest.search,
            },
          },
        ],
      });
    }

    const getBoat = await prisma.boat.findMany({
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
        category: true,
      },
    });

    const total = await prisma.boat.count({
      where: {
        AND: filters,
      },
    });

    return {
      data: getBoat.map((value) =>
        convertBoatResponse(
          value,
          convertUserGlobalResponse(value.created_by),
          convertCategoryGlobalResponse(value.category)
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
    await this.checkBoatExistById(id);

    await prisma.boat.delete({
      where: { id },
      include: {
        created_by: true,
      },
    });

    return `Boat with ID ${id} is deleted`;
  }
}
