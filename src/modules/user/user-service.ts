import { Role } from "@prisma/client";
import bcrypt from "bcrypt";
import { prisma } from "../../config/database";
import { ActiveRequest } from "../../types/activeRequest";
import { Pageable } from "../../types/pageable";
import { ErrorResponse } from "../../utilities/errorResponse";
import { validation } from "../../utilities/validation";
import { activeValidation } from "../../validation/activeValidation";
import { WalletService } from "../wallet/wallet-service";
import {
  convertUserGlobalResponse,
  convertUserResponse,
  FilterUserRequest,
  UserRequest,
  UserResponse,
} from "./user-model";
import { UserValidation } from "./user-validation";

export class UserService {
  static async checkUserExist(name: string, username: string, email: string) {
    const user = await prisma.user.findFirst({
      where: {
        OR: [{ name }, { username }, { email }],
      },
    });

    const errorMessage =
      user?.name === name
        ? "Name is already exist"
        : user?.username === username
        ? "Username is already exist"
        : "Email is already exist";

    if (user) throw new ErrorResponse(400, "Failed create user", errorMessage);
  }

  static async create(
    request: UserRequest,
    userId: number
  ): Promise<UserResponse> {
    const createRequest = validation(UserValidation.create, request);

    if (createRequest.role === "superadmin")
      throw new ErrorResponse(
        400,
        "User registration failed",
        `You are not allowed to register as a ${createRequest.role}.`
      );

    await this.checkUserExist(
      createRequest.name,
      createRequest.username,
      createRequest.email
    );

    createRequest.password = await bcrypt.hash(createRequest.password, 10);

    const createdUser = await prisma.user.create({
      data: {
        ...createRequest,
        status: "verified",
        created_by_id: Number(userId),
      },
      include: {
        created_by: true,
      },
    });

    if (createdUser.role === "boatowner" || createdUser.role === "customer")
      await WalletService.create(createdUser.id);

    return convertUserResponse(
      createdUser,
      createdUser.created_by
        ? convertUserGlobalResponse(createdUser.created_by)
        : { id: null, name: "" }
    );
  }

  static async update(request: UserRequest, id: number): Promise<UserResponse> {
    const updateRequest = validation(UserValidation.create, request);

    const existingUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      throw new ErrorResponse(
        404,
        "User not found",
        "User with this ID doesn't exist!"
      );
    }

    if (
      updateRequest.name !== existingUser.name &&
      updateRequest.username !== existingUser.username &&
      updateRequest.email !== existingUser.email
    ) {
      await this.checkUserExist(
        updateRequest.name,
        updateRequest.username,
        updateRequest.email
      );
    }

    updateRequest.password = await bcrypt.hash(updateRequest.password, 10);

    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateRequest,
      include: {
        created_by: true,
      },
    });

    return convertUserResponse(
      updatedUser,
      updatedUser.created_by
        ? convertUserGlobalResponse(updatedUser.created_by)
        : { id: null, name: "" }
    );
  }

  static async active(
    request: ActiveRequest,
    id: number
  ): Promise<{ active: boolean }> {
    const activeRequest = validation(activeValidation, request);

    const existingCountry = await prisma.user.findUnique({
      where: { id },
    });

    if (!existingCountry) {
      throw new ErrorResponse(
        404,
        "Country not found",
        "Country with this ID doesn't exist!"
      );
    }

    const updatedActive = await prisma.user.update({
      where: { id },
      data: {
        active: activeRequest.active,
      },
    });

    return { active: updatedActive.active };
  }

  static async get(
    request: FilterUserRequest,
    userId: number
  ): Promise<Pageable<UserResponse>> {
    const getRequest = validation(UserValidation.get, request);

    const checkRole = await prisma.user.findUnique({
      where: { id: Number(userId) },
    });

    const skip = (getRequest.page - 1) * getRequest.size;

    const filters = [];

    if (getRequest.search) {
      filters.push({
        name: {
          contains: getRequest.search,
        },
      });
    }

    const getUser = await prisma.user.findMany({
      where: {
        created_by_id:
          checkRole?.role !== Role.superadmin ? checkRole?.id : undefined,
        AND: filters,
      },
      orderBy: {
        created_at: "desc",
      },
      include: {
        created_by: true,
      },
      take: getRequest.all ? undefined : getRequest.size,
      skip: getRequest.all ? undefined : skip,
    });

    const total = await prisma.user.count({
      where: {
        AND: filters,
      },
    });

    return {
      data: getUser.map((value) =>
        convertUserResponse(
          value,
          value.created_by
            ? convertUserGlobalResponse(value.created_by)
            : { id: null, name: "" }
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
    const existingUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      throw new ErrorResponse(
        404,
        "User not found",
        "User with this ID doesn't exist!"
      );
    }

    await prisma.user.delete({
      where: { id },
    });

    return `User with ID ${id} is deleted`;
  }
}
