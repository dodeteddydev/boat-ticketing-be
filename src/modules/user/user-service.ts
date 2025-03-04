import bcrypt from "bcrypt";
import { prisma } from "../../config/database";
import { ErrorResponse } from "../../utilities/error-response";
import { validation } from "../../utilities/validation";
import {
  convertToCreateOrUpdateUserResponse,
  convertToLoginResponse,
  convertToUserResponse,
  CreateOrUpdateUserRequest,
  CreateOrUpdateUserResponse,
  LoginRequest,
  LoginResponse,
  UserResponse,
} from "./user-model";
import { UserValidation } from "./user-vaidation";
import { JwtHelpers } from "../../utilities/jwt-helpers";
import { logger } from "../../config/logger";
import { AuthRequest } from "../../middlewares/auth-middleware";

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

    return convertToCreateOrUpdateUserResponse(user);
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

    return convertToLoginResponse(user, accessToken, refreshToken);
  }

  static async get(request: AuthRequest): Promise<UserResponse> {
    const user = await prisma.user.findUnique({
      where: {
        id: Number(request.userId),
      },
    });

    logger.info(request.userId);
    logger.info(user);

    if (!user) {
      throw new ErrorResponse(
        404,
        "User not found",
        "User with this ID doesn't exist!"
      );
    }
    return convertToUserResponse(user, null);
  }
}
