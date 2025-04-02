import bcrypt from "bcrypt";
import { prisma } from "../../config/database";
import { AuthRequest } from "../../middlewares/authMiddleware";
import { ErrorResponse } from "../../utilities/errorResponse";
import { JwtHelpers } from "../../utilities/jwtHelpers";
import { validation } from "../../utilities/validation";
import {
  convertCreateOrUpdateUserResponse,
  convertLoginResponse,
  convertUserGlobalResponse,
  convertUserResponse,
  CreateOrUpdateUserRequest,
  CreateOrUpdateUserResponse,
  FilterUserRequest,
  LoginRequest,
  LoginResponse,
  RefreshRequest,
  RefreshResponse,
  UserResponse,
} from "./user-model";
import { UserValidation } from "./user-validation";
import { Pageable } from "../../types/pageable";

export class UserService {
  static async checkUserExist(name: string, username: string, email: string) {
    const user = await prisma.user.findFirst({
      where: {
        OR: [{ name }, { username }, { email }],
      },
    });

    const errorMessage =
      user?.name === name
        ? "Name is already registered"
        : user?.username === username
        ? "Username is already registered"
        : "Email is already registered";

    if (user)
      throw new ErrorResponse(400, "User registration failed", errorMessage);
  }

  static async register(
    request: CreateOrUpdateUserRequest
  ): Promise<CreateOrUpdateUserResponse> {
    const registerRequest = validation(UserValidation.register, request);

    await this.checkUserExist(
      registerRequest.name,
      registerRequest.username,
      registerRequest.email
    );

    registerRequest.password = await bcrypt.hash(registerRequest.password, 10);

    const user = await prisma.user.create({
      data: registerRequest,
    });

    return convertCreateOrUpdateUserResponse(user);
  }

  static async login(request: LoginRequest): Promise<LoginResponse> {
    const loginRequest = validation(UserValidation.login, request);

    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { username: loginRequest.identifier },
          { email: loginRequest.identifier },
        ],
      },
    });

    if (!user)
      throw new ErrorResponse(
        400,
        "User login failed",
        "No account found. Please sign up to continue."
      );

    const isValidPassword = await bcrypt.compare(
      loginRequest.password,
      user.password
    );

    if (!isValidPassword)
      throw new ErrorResponse(
        400,
        "User login failed",
        "Invalid username/email or password. Please try again!"
      );

    const accessToken = JwtHelpers.generateToken(user.id.toString()).access;
    const refreshToken = JwtHelpers.generateToken(user.id.toString()).refresh;

    return convertLoginResponse(user, accessToken, refreshToken);
  }

  static async get(request: AuthRequest): Promise<UserResponse> {
    const user = await prisma.user.findUnique({
      where: {
        id: Number(request.userId),
      },
    });

    if (!user) {
      throw new ErrorResponse(
        404,
        "User not found",
        "User with this ID doesn't exist!"
      );
    }
    return convertUserResponse(user, null);
  }

  static async getListUser(
    request: FilterUserRequest
  ): Promise<Pageable<UserResponse>> {
    const getListUserRequest = validation(UserValidation.getListUser, request);

    const skip = (getListUserRequest.page - 1) * getListUserRequest.size;

    const filters = [];

    if (getListUserRequest.search) {
      filters.push({
        name: {
          contains: getListUserRequest.search,
        },
      });
    }

    const getUser = await prisma.user.findMany({
      where: {
        AND: filters,
      },
      orderBy: {
        created_at: "desc",
      },
      include: {
        created_by: true,
      },
      take: getListUserRequest.all ? undefined : getListUserRequest.size,
      skip: getListUserRequest.all ? undefined : skip,
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
          value.created_by ? convertUserGlobalResponse(value.created_by) : null
        )
      ),
      paging: getListUserRequest.all
        ? undefined
        : {
            currentPage: getListUserRequest.page,
            totalPage: Math.ceil(total / getListUserRequest.size),
            size: getListUserRequest.size,
          },
    };
  }

  static async refresh(request: RefreshRequest): Promise<RefreshResponse> {
    const refreshRequest = validation(UserValidation.refresh, request);

    const decode = JwtHelpers.verifyRefreshToken(refreshRequest.refreshToken);

    const userId = decode.userId;

    const accessToken = JwtHelpers.generateToken(userId.toString()).access;
    const refreshToken = JwtHelpers.generateToken(userId.toString()).refresh;

    return {
      accessToken,
      refreshToken,
    };
  }
}
