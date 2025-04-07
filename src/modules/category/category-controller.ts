import { NextFunction, Request, Response } from "express";
import { AuthRequest } from "../../middlewares/authMiddleware";
import { ActiveRequest } from "../../types/activeRequest";
import { ResponseHelpers } from "../../utilities/responseHelpers";
import { CategoryRequest, FilterCategoryRequest } from "./category-model";
import { CategoryService } from "./category-service";

export class CategoryController {
  static async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const request = req.body as CategoryRequest;
      const response = await CategoryService.create(request, req.userId!);
      res
        .status(201)
        .json(
          ResponseHelpers.success("Category created successfully", response)
        );
    } catch (error) {
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const request = req.body as CategoryRequest;

      const categoryId = Number(id);
      if (isNaN(categoryId)) {
        res
          .status(400)
          .json(
            ResponseHelpers.error(
              "Invalid Category ID",
              "ID must be type of number"
            )
          );
        return;
      }

      const response = await CategoryService.update(request, categoryId);

      res
        .status(200)
        .json(
          ResponseHelpers.success("Category updated successfully", response)
        );
    } catch (error) {
      next(error);
    }
  }

  static async active(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const request = req.body as ActiveRequest;

      const categoryId = Number(id);
      if (isNaN(categoryId)) {
        res
          .status(400)
          .json(
            ResponseHelpers.error(
              "Invalid Category ID",
              "ID must be type of number"
            )
          );
        return;
      }

      const response = await CategoryService.active(request, categoryId);

      res
        .status(200)
        .json(ResponseHelpers.success("Active updated successfully", response));
    } catch (error) {
      next(error);
    }
  }

  static async get(req: Request, res: Response, next: NextFunction) {
    try {
      const request = {
        search: req.query.search as string,
        page: req.query.page ? Number(req.query.page) : 1,
        size: req.query.size ? Number(req.query.size) : 10,
        all: req.query.all === "true",
      } as FilterCategoryRequest;

      const response = await CategoryService.get(request);

      res
        .status(200)
        .json(
          ResponseHelpers.successWithPagination(
            "Category get successfully",
            response
          )
        );
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const categoryId = Number(id);
      if (isNaN(categoryId)) {
        res
          .status(400)
          .json(
            ResponseHelpers.error(
              "Invalid Category ID",
              "ID must be type of number"
            )
          );
        return;
      }

      const response = await CategoryService.delete(categoryId);

      res
        .status(200)
        .json(
          ResponseHelpers.success("Category deleted successfully", response)
        );
    } catch (error) {
      next(error);
    }
  }
}
