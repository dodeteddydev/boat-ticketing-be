import { NextFunction, Request, Response } from "express";
import { AuthRequest } from "../../middlewares/authMiddleware";
import { ActiveRequest } from "../../types/activeRequest";
import { ResponseHelpers } from "../../utilities/responseHelpers";
import { CountryRequest, FilterCountryRequest } from "./country-model";
import { CountryService } from "./country-service";

export class CountryController {
  static async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const request = req.body as CountryRequest;
      const response = await CountryService.create(request, req.userId!);
      res
        .status(201)
        .json(
          ResponseHelpers.success("Country created successfully", response)
        );
    } catch (error) {
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const request = req.body as CountryRequest;

      const countryId = Number(id);
      if (isNaN(countryId)) {
        res
          .status(400)
          .json(
            ResponseHelpers.error(
              "Invalid country ID",
              "ID must be type of number"
            )
          );
        return;
      }

      const response = await CountryService.update(request, countryId);

      res
        .status(200)
        .json(
          ResponseHelpers.success("Country updated successfully", response)
        );
    } catch (error) {
      next(error);
    }
  }

  static async active(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const request = req.body as ActiveRequest;

      const countryId = Number(id);
      if (isNaN(countryId)) {
        res
          .status(400)
          .json(
            ResponseHelpers.error(
              "Invalid country ID",
              "ID must be type of number"
            )
          );
        return;
      }

      const response = await CountryService.active(request, countryId);

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
      } as FilterCountryRequest;

      const response = await CountryService.get(request);

      res
        .status(200)
        .json(
          ResponseHelpers.successWithPagination(
            "Country get successfully",
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

      const countryId = Number(id);
      if (isNaN(countryId)) {
        res
          .status(400)
          .json(
            ResponseHelpers.error(
              "Invalid country ID",
              "ID must be type of number"
            )
          );
        return;
      }

      const response = await CountryService.delete(countryId);

      res
        .status(200)
        .json(
          ResponseHelpers.success("Country deleted successfully", response)
        );
    } catch (error) {
      next(error);
    }
  }
}
