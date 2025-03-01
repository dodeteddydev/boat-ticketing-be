import bcrypt from "bcrypt";
import { prisma } from "../../config/database";
import { ErrorResponse } from "../../utilities/error-response";
import { validation } from "../../utilities/validation";
import {
  convertToCreateOrUpdateUserResponse,
  CreateOrUpdateUserRequest,
  CreateOrUpdateUserResponse,
} from "./user-model";
import { UserValidation } from "./user-vaidation";

export class UserService {
  static async checkUserExist(name: string, username: string, email: string) {
    const user = await prisma.user.findFirst({
      where: {
        OR: [{ name }, { username }, { email }],
      },
    });

    const errorMessage =
      user?.name === name
        ? "Name already registered"
        : user?.username === username
        ? "Username already used"
        : "Email already registered";

    if (user)
      throw new ErrorResponse(400, "Failed to create user", errorMessage);
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
}
