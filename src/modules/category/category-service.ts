import { prisma } from "../../config/database";
import { ActiveRequest } from "../../types/activeRequest";
import { Pageable } from "../../types/pageable";
import { ErrorResponse } from "../../utilities/errorResponse";
import { validation } from "../../utilities/validation";
import { activeValidation } from "../../validation/activeValidation";
import { convertUserGlobalResponse } from "../user/user-model";
import {
  CategoryRequest,
  CategoryResponse,
  convertCategoryResponse,
  FilterCategoryRequest,
} from "./category-model";
import { CategoryValidation } from "./category-validation";

export class CategoryService {
  static async checkCategoryExist(categoryName: string, categoryCode: string) {
    const category = await prisma.category.findFirst({
      where: {
        OR: [{ category_name: categoryName }, { category_code: categoryCode }],
      },
    });

    const errorMessage =
      category?.category_name === categoryName
        ? "Category name is already exist"
        : category?.category_code === categoryCode
        ? "Category code already exist"
        : "Category is already exist";

    if (category)
      throw new ErrorResponse(400, "Failed create category", errorMessage);
  }

  static async checkCategoryExistById(
    id: number
  ): Promise<{ countryName: string; countryCode: string }> {
    const existingCategory = await prisma.category.findUnique({
      where: { id },
    });

    if (!existingCategory) {
      throw new ErrorResponse(
        404,
        "Category not found",
        "Category with this ID doesn't exist!"
      );
    }

    return {
      countryName: existingCategory.category_name,
      countryCode: existingCategory.category_code,
    };
  }

  static async create(
    request: CategoryRequest,
    userId: number
  ): Promise<CategoryResponse> {
    const createRequest = validation(CategoryValidation.create, request);

    await this.checkCategoryExist(
      createRequest.categoryName,
      createRequest.categoryCode
    );

    const createdCategory = await prisma.category.create({
      data: {
        category_name: createRequest.categoryName,
        category_code: createRequest.categoryCode,
        created_by: { connect: { id: Number(userId) } },
      },
      include: {
        created_by: true,
      },
    });

    return convertCategoryResponse(
      createdCategory,
      convertUserGlobalResponse(createdCategory.created_by)
    );
  }

  static async update(
    request: CategoryRequest,
    id: number
  ): Promise<CategoryResponse> {
    const updateRequest = validation(CategoryValidation.create, request);

    const existingCategory = await this.checkCategoryExistById(id);

    if (
      updateRequest.categoryName !== existingCategory.countryName &&
      updateRequest.categoryCode !== existingCategory.countryCode
    ) {
      await this.checkCategoryExist(
        updateRequest.categoryName,
        updateRequest.categoryCode
      );
    }

    const updatedCategory = await prisma.category.update({
      where: { id },
      data: {
        category_name: updateRequest.categoryName,
        category_code: updateRequest.categoryCode,
      },
      include: {
        created_by: true,
      },
    });

    return convertCategoryResponse(
      updatedCategory,
      convertUserGlobalResponse(updatedCategory.created_by)
    );
  }

  static async active(
    request: ActiveRequest,
    id: number
  ): Promise<{ active: boolean }> {
    const activeRequest = validation(activeValidation, request);

    await this.checkCategoryExistById(id);

    const updatedActive = await prisma.category.update({
      where: { id },
      data: {
        active: activeRequest.active,
      },
    });

    return { active: updatedActive.active };
  }

  static async get(
    request: FilterCategoryRequest
  ): Promise<Pageable<CategoryResponse>> {
    const getRequest = validation(CategoryValidation.get, request);

    const skip = (getRequest.page - 1) * getRequest.size;

    const filters = [];

    if (getRequest.search) {
      filters.push({
        OR: [
          {
            category_name: {
              contains: getRequest.search,
            },
          },
          {
            category_code: {
              contains: getRequest.search,
            },
          },
        ],
      });
    }

    const getCategory = await prisma.category.findMany({
      where: {
        AND: filters,
      },
      orderBy: {
        created_at: "desc",
      },
      take: getRequest.all ? undefined : getRequest.size,
      skip: getRequest.all ? undefined : skip,
      include: {
        created_by: true,
      },
    });

    const total = await prisma.category.count({
      where: {
        AND: filters,
      },
    });

    return {
      data: getCategory.map((value) =>
        convertCategoryResponse(
          value,
          convertUserGlobalResponse(value.created_by)
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
    await this.checkCategoryExistById(id);

    await prisma.category.delete({
      where: { id },
      include: {
        created_by: true,
      },
    });

    return `Category with ID ${id} is deleted`;
  }
}
