import bcrypt from "bcrypt";
import { Response } from "express";
import { prisma } from "../../config/database";
import { AuthRequest } from "../../middlewares/authMiddleware";
import { ErrorResponse } from "../../utilities/errorResponse";
import { JwtHelpers } from "../../utilities/jwtHelpers";
import { validation } from "../../utilities/validation";
import { convertUserResponse, UserResponse } from "../user/user-model";
import { WalletService } from "../wallet/wallet-service";
import {
  convertLoginResponse,
  convertRegisterResponse,
  LoginRequest,
  LoginResponse,
  RefreshRequest,
  RefreshResponse,
  RegisterRequest,
  RegisterResponse,
} from "./auth-model";
import { AuthValidation } from "./auth-validation";

export class AuthService {
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

  static async register(request: RegisterRequest): Promise<RegisterResponse> {
    const registerRequest = validation(AuthValidation.register, request);

    if (
      registerRequest.role === "superadmin" ||
      registerRequest.role === "boatadmin"
    )
      throw new ErrorResponse(
        400,
        "User registration failed",
        `You are not allowed to register as a ${registerRequest.role}.`
      );

    await this.checkUserExist(
      registerRequest.name,
      registerRequest.username,
      registerRequest.email
    );

    registerRequest.password = await bcrypt.hash(registerRequest.password, 10);

    const user = await prisma.user.create({
      data: registerRequest,
    });

    if (user.role === "superadmin" || user.role === "customer")
      await WalletService.create(user.id);

    return convertRegisterResponse(user);
  }

  static async login(
    request: LoginRequest,
    res: Response
  ): Promise<LoginResponse> {
    const loginRequest = validation(AuthValidation.login, request);

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

    if (!user.active) {
      throw new ErrorResponse(
        403,
        "User login failed",
        "Your account is inactive. Please contact support for assistance."
      );
    }

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

    if (loginRequest.platform === "web") {
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.APP_ENV === "PROD",
        sameSite: "strict",
        path: "/",
      });

      return convertLoginResponse(user, accessToken);
    }

    return convertLoginResponse(user, accessToken, refreshToken);
  }

  static async profile(request: AuthRequest): Promise<UserResponse> {
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
    return convertUserResponse(user);
  }

  static async refresh(
    cookiesRefreshToken: string,
    res: Response
  ): Promise<RefreshResponse> {
    const refreshToken = cookiesRefreshToken;

    if (!refreshToken) {
      throw new ErrorResponse(
        401,
        "Refresh failed",
        "No refresh token provided."
      );
    }

    const decoded = JwtHelpers.verifyRefreshToken(refreshToken);
    const userId = decoded.userId;

    const newAccessToken = JwtHelpers.generateToken(userId.toString()).access;
    const newRefreshToken = JwtHelpers.generateToken(userId.toString()).refresh;

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: process.env.APP_ENV === "PROD",
      sameSite: "strict",
      path: "/",
    });

    return { accessToken: newAccessToken };
  }

  static async refreshMobile(req: RefreshRequest): Promise<RefreshResponse> {
    const refreshToken = req.refreshToken;

    if (!refreshToken) {
      throw new ErrorResponse(
        401,
        "Refresh failed",
        "No refresh token provided."
      );
    }

    const decoded = JwtHelpers.verifyRefreshToken(refreshToken);
    const userId = decoded.userId;

    const newAccessToken = JwtHelpers.generateToken(userId.toString()).access;
    const newRefreshToken = JwtHelpers.generateToken(userId.toString()).refresh;

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }
}
