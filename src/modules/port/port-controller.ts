import { NextFunction, Request, Response } from "express";
import { AuthRequest } from "../../middlewares/authMiddleware";
import { ActiveRequest } from "../../types/activeRequest";
import { ResponseHelpers } from "../../utilities/responseHelpers";
import { PortRequest, FilterPortRequest } from "./port-model";
import { PortService } from "./port-service";

export class PortController {
  static async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const request = req.body as PortRequest;
      const response = await PortService.create(request, req.userId!);
      res
        .status(201)
        .json(ResponseHelpers.success("Port created successfully", response));
    } catch (error) {
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const request = req.body as PortRequest;

      const portId = Number(id);
      if (isNaN(portId)) {
        res
          .status(400)
          .json(
            ResponseHelpers.error(
              "Invalid Port ID",
              "ID must be type of number"
            )
          );
        return;
      }

      const response = await PortService.update(request, portId);

      res
        .status(200)
        .json(ResponseHelpers.success("Port updated successfully", response));
    } catch (error) {
      next(error);
    }
  }

  static async active(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const request = req.body as ActiveRequest;

      const portId = Number(id);
      if (isNaN(portId)) {
        res
          .status(400)
          .json(
            ResponseHelpers.error(
              "Invalid Port ID",
              "ID must be type of number"
            )
          );
        return;
      }

      const response = await PortService.active(request, portId);

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
        cityId: req.query.cityId && Number(req.query.cityId),
        page: req.query.page ? Number(req.query.page) : 1,
        size: req.query.size ? Number(req.query.size) : 10,
        all: req.query.all === "true",
      } as FilterPortRequest;

      const response = await PortService.get(request);

      res
        .status(200)
        .json(
          ResponseHelpers.successWithPagination(
            "Port get successfully",
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

      const portId = Number(id);
      if (isNaN(portId)) {
        res
          .status(400)
          .json(
            ResponseHelpers.error(
              "Invalid Port ID",
              "ID must be type of number"
            )
          );
        return;
      }

      const response = await PortService.delete(portId);

      res
        .status(200)
        .json(ResponseHelpers.success("Port deleted successfully", response));
    } catch (error) {
      next(error);
    }
  }
}
