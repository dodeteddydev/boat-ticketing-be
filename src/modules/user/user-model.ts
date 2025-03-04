import { Role, Status, User } from "@prisma/client";

export type CreatedBy = {
  id: number;
  name: string;
};

export type UserResponse = {
  id: number;
  role: Role;
  name: string;
  username: string;
  email: string;
  status: Status;
  createdBy: CreatedBy | null;
  createdAt: string;
  updatedAt: string;
  active: boolean;
};

export type CreateOrUpdateUserResponse = {
  id: number;
  role: Role;
  name: string;
  username: string;
  email: string;
};

export type LoginResponse = {
  id: number;
  role: Role;
  name: string;
  username: string;
  email: string;
  accessToken: string;
  refreshToken: string;
};

export type CreateOrUpdateUserRequest = {
  role: Role;
  name: string;
  username: string;
  email: string;
  password: string;
};

export type LoginRequest = {
  identifier: string;
  password: string;
};

export const convertToLoginResponse = (
  user: User,
  accessToken: string,
  refreshToken: string
): LoginResponse => {
  return {
    id: user.id,
    role: user.role,
    name: user.name,
    username: user.username,
    email: user.email,
    accessToken: accessToken,
    refreshToken: refreshToken,
  };
};

export const convertToCreateOrUpdateUserResponse = (
  user: User
): CreateOrUpdateUserResponse => {
  return {
    id: user.id,
    role: user.role,
    name: user.name,
    username: user.username,
    email: user.email,
  };
};

export const convertToUserResponse = (
  user: User,
  createdBy: CreatedBy | null
): UserResponse => {
  return {
    id: user.id,
    role: user.role,
    name: user.name,
    username: user.username,
    email: user.email,
    status: user.status,
    createdBy: createdBy,
    createdAt: user.created_at.toISOString(),
    updatedAt: user.updated_at.toISOString(),
    active: user.active,
  };
};
