import { Category } from "@prisma/client";
import { UserGlobalResponse } from "../user/user-model";

export type CategoryGlobalResponse = {
  id: number;
  categoryName: string;
  categoryCode: string;
};

export type CategoryResponse = {
  id: number;
  categoryName: string;
  categoryCode: string;
  createdBy: UserGlobalResponse | null;
  createdAt: string;
  updatedAt: string;
  active: boolean;
};

export type CategoryRequest = {
  categoryName: string;
  categoryCode: string;
};

export type FilterCategoryRequest = {
  search?: string;
  page: number;
  size: number;
  all?: boolean;
};

export const convertCategoryResponse = (
  category: Category,
  createdBy: UserGlobalResponse
): CategoryResponse => {
  return {
    id: category.id,
    categoryName: category.category_name,
    categoryCode: category.category_code,
    createdBy: createdBy,
    createdAt: category.created_at.toISOString(),
    updatedAt: category.updated_at.toISOString(),
    active: category.active,
  };
};

export const convertCategoryGlobalResponse = (
  category: Category
): CategoryGlobalResponse => {
  return {
    id: category.id,
    categoryName: category.category_name,
    categoryCode: category.category_code,
  };
};
