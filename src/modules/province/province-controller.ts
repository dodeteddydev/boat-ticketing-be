import { NextFunction, Request, Response } from "express";
import { AuthRequest } from "../../middlewares/authMiddleware";
import { ActiveRequest } from "../../types/activeRequest";
import { ResponseHelpers } from "../../utilities/responseHelpers";
import { FilterProvinceRequest, ProvinceRequest } from "./province-model";
import { ProvinceService } from "./province-service";

export class ProvinceController {
  static async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const request = req.body as ProvinceRequest;
      const response = await ProvinceService.create(request, req.userId!);
      res
        .status(201)
        .json(
          ResponseHelpers.success("Province created successfully", response)
        );
    } catch (error) {
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const request = req.body as ProvinceRequest;

      const provinceId = Number(id);
      if (isNaN(provinceId)) {
        res
          .status(400)
          .json(
            ResponseHelpers.error(
              "Invalid Province ID",
              "ID must be type of number"
            )
          );
        return;
      }

      const response = await ProvinceService.update(request, provinceId);

      res
        .status(200)
        .json(
          ResponseHelpers.success("Province updated successfully", response)
        );
    } catch (error) {
      next(error);
    }
  }

  static async active(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const request = req.body as ActiveRequest;

      const provinceId = Number(id);
      if (isNaN(provinceId)) {
        res
          .status(400)
          .json(
            ResponseHelpers.error(
              "Invalid Province ID",
              "ID must be type of number"
            )
          );
        return;
      }

      const response = await ProvinceService.active(request, provinceId);

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
        countryId: req.query.countryId && Number(req.query.countryId),
        page: req.query.page ? Number(req.query.page) : 1,
        size: req.query.size ? Number(req.query.size) : 10,
        all: req.query.all === "true",
      } as FilterProvinceRequest;

      const response = await ProvinceService.get(request);

      res
        .status(200)
        .json(
          ResponseHelpers.successWithPagination(
            "Province get successfully",
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

      const provinceId = Number(id);
      if (isNaN(provinceId)) {
        res
          .status(400)
          .json(
            ResponseHelpers.error(
              "Invalid Province ID",
              "ID must be type of number"
            )
          );
        return;
      }

      const response = await ProvinceService.delete(provinceId);

      res
        .status(200)
        .json(
          ResponseHelpers.success("Province deleted successfully", response)
        );
    } catch (error) {
      next(error);
    }
  }
}
