import { NextFunction, Request, Response } from "express";
import { AuthRequest } from "../../middlewares/authMiddleware";
import { ActiveRequest } from "../../types/activeRequest";
import { ResponseHelpers } from "../../utilities/responseHelpers";
import { BoatRequest, FilterBoatRequest } from "./boat-model";
import { BoatService } from "./boat-service";

export class BoatController {
  static async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const request = req.body as BoatRequest;
      const response = await BoatService.create(request, req.userId!);
      res
        .status(201)
        .json(ResponseHelpers.success("Boat created successfully", response));
    } catch (error) {
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const request = req.body as BoatRequest;

      const boatId = Number(id);
      if (isNaN(boatId)) {
        res
          .status(400)
          .json(
            ResponseHelpers.error(
              "Invalid Boat ID",
              "ID must be type of number"
            )
          );
        return;
      }

      const response = await BoatService.update(request, boatId);

      res
        .status(200)
        .json(ResponseHelpers.success("Boat updated successfully", response));
    } catch (error) {
      next(error);
    }
  }

  static async active(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const request = req.body as ActiveRequest;

      const boatId = Number(id);
      if (isNaN(boatId)) {
        res
          .status(400)
          .json(
            ResponseHelpers.error(
              "Invalid Boat ID",
              "ID must be type of number"
            )
          );
        return;
      }

      const response = await BoatService.active(request, boatId);

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
        categoryId: req.query.categoryId && Number(req.query.categoryId),
        page: req.query.page ? Number(req.query.page) : 1,
        size: req.query.size ? Number(req.query.size) : 10,
        all: req.query.all === "true",
      } as FilterBoatRequest;

      const response = await BoatService.get(request);

      res
        .status(200)
        .json(
          ResponseHelpers.successWithPagination(
            "Boat get successfully",
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

      const boatId = Number(id);
      if (isNaN(boatId)) {
        res
          .status(400)
          .json(
            ResponseHelpers.error(
              "Invalid Boat ID",
              "ID must be type of number"
            )
          );
        return;
      }

      const response = await BoatService.delete(boatId);

      res
        .status(200)
        .json(ResponseHelpers.success("Boat deleted successfully", response));
    } catch (error) {
      next(error);
    }
  }
}
