import { Boat } from "@prisma/client";
import { CategoryGlobalResponse } from "../category/category-model";
import { UserGlobalResponse } from "../user/user-model";

export type BoatGlobalResponse = {
  id: number;
  boatName: string;
  boatCode: string | null;
};

export type BoatResponse = {
  id: number;
  boatName: string;
  boatCode: string | null;
  category: CategoryGlobalResponse;
  createdBy: UserGlobalResponse | null;
  createdAt: string;
  updatedAt: string;
  active: boolean;
};

export type BoatRequest = {
  boatName: string;
  boatCode: string;
  categoryId: number;
};

export type FilterBoatRequest = {
  search?: string;
  categoryId?: number;
  page: number;
  size: number;
  all?: boolean;
};

export const convertBoatResponse = (
  boat: Boat,
  createdBy: UserGlobalResponse,
  category: CategoryGlobalResponse
): BoatResponse => {
  return {
    id: boat.id,
    boatName: boat.boat_name,
    boatCode: boat.boat_code,
    category: category,
    createdBy: createdBy,
    createdAt: boat.created_at.toISOString(),
    updatedAt: boat.updated_at.toISOString(),
    active: boat.active,
  };
};

export const convertBoatGlobalResponse = (boat: Boat): BoatGlobalResponse => {
  return {
    id: boat.id,
    boatName: boat.boat_name,
    boatCode: boat.boat_code,
  };
};
