import { Role, User } from "@prisma/client";

export type RegisterResponse = {
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

export type RefreshResponse = {
  accessToken: string;
  refreshToken: string;
};

export type RegisterRequest = {
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

export type RefreshRequest = {
  refreshToken: string;
};

export const convertLoginResponse = (
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

export const convertRegisterResponse = (user: User): RegisterResponse => {
  return {
    id: user.id,
    role: user.role,
    name: user.name,
    username: user.username,
    email: user.email,
  };
};
