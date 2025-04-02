import { NextFunction, Request, Response } from "express";
import { AuthRequest } from "../../middlewares/authMiddleware";
import { ActiveRequest } from "../../types/activeRequest";
import { ResponseHelpers } from "../../utilities/responseHelpers";
import { CityRequest, FilterCityRequest } from "./city-model";
import { CityService } from "./city-service";

export class CityController {
  static async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const request = req.body as CityRequest;
      const response = await CityService.create(request, req.userId!);
      res
        .status(201)
        .json(ResponseHelpers.success("City created successfully", response));
    } catch (error) {
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const request = req.body as CityRequest;

      const cityId = Number(id);
      if (isNaN(cityId)) {
        res
          .status(400)
          .json(
            ResponseHelpers.error(
              "Invalid City ID",
              "ID must be type of number"
            )
          );
        return;
      }

      const response = await CityService.update(request, cityId);

      res
        .status(200)
        .json(ResponseHelpers.success("City updated successfully", response));
    } catch (error) {
      next(error);
    }
  }

  static async active(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const request = req.body as ActiveRequest;

      const cityId = Number(id);
      if (isNaN(cityId)) {
        res
          .status(400)
          .json(
            ResponseHelpers.error(
              "Invalid City ID",
              "ID must be type of number"
            )
          );
        return;
      }

      const response = await CityService.active(request, cityId);

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
        provinceId: req.query.provinceId && Number(req.query.provinceId),
        page: req.query.page ? Number(req.query.page) : 1,
        size: req.query.size ? Number(req.query.size) : 10,
        all: req.query.all === "true",
      } as FilterCityRequest;

      const response = await CityService.get(request);

      res
        .status(200)
        .json(
          ResponseHelpers.successWithPagination(
            "City get successfully",
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

      const cityId = Number(id);
      if (isNaN(cityId)) {
        res
          .status(400)
          .json(
            ResponseHelpers.error(
              "Invalid City ID",
              "ID must be type of number"
            )
          );
        return;
      }

      const response = await CityService.delete(cityId);

      res
        .status(200)
        .json(ResponseHelpers.success("City deleted successfully", response));
    } catch (error) {
      next(error);
    }
  }
}
