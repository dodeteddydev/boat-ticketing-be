import { Role, Status, User } from "@prisma/client";

export type UserGlobalResponse = {
  id: number | null;
  name: string;
};

export type UserResponse = {
  id: number;
  role: Role;
  name: string;
  username: string;
  email: string;
  status: Status;
  createdBy?: UserGlobalResponse;
  createdAt: string;
  updatedAt: string;
  active: boolean;
};

export type UserRequest = {
  role: Role;
  name: string;
  username: string;
  email: string;
  password: string;
};

export type FilterUserRequest = {
  search?: string;
  page: number;
  size: number;
  all?: boolean;
};

export const convertUserResponse = (
  user: User,
  createdBy?: UserGlobalResponse
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

export const convertUserGlobalResponse = (
  createdBy: User
): UserGlobalResponse => {
  return {
    id: createdBy.id,
    name: createdBy.name,
  };
};
