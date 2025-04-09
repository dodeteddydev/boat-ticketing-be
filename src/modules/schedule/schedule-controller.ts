import { NextFunction, Request, Response } from "express";
import { AuthRequest } from "../../middlewares/authMiddleware";
import { ActiveRequest } from "../../types/activeRequest";
import { ResponseHelpers } from "../../utilities/responseHelpers";
import { FilterScheduleRequest, ScheduleRequest } from "./schedule-model";
import { ScheduleService } from "./schedule-service";

export class ScheduleController {
  static async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const request = req.body as ScheduleRequest;

      const response = await ScheduleService.create(request, req.userId!);
      res
        .status(201)
        .json(
          ResponseHelpers.success("Schedule created successfully", response)
        );
    } catch (error) {
      next(error);
    }
  }

  static async update(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const request = req.body as ScheduleRequest;

      const scheduleId = Number(id);
      if (isNaN(scheduleId)) {
        res
          .status(400)
          .json(
            ResponseHelpers.error(
              "Invalid Schedule ID",
              "ID must be type of number"
            )
          );
        return;
      }

      const response = await ScheduleService.update(
        request,
        scheduleId,
        req.userId!
      );

      res
        .status(200)
        .json(
          ResponseHelpers.success("Schedule updated successfully", response)
        );
    } catch (error) {
      next(error);
    }
  }

  static async active(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const request = req.body as ActiveRequest;

      const scheduleId = Number(id);
      if (isNaN(scheduleId)) {
        res
          .status(400)
          .json(
            ResponseHelpers.error(
              "Invalid Schedule ID",
              "ID must be type of number"
            )
          );
        return;
      }

      const response = await ScheduleService.active(request, scheduleId);

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
        countryId: req.query.countryId && Number(req.query.countryId),
        provinceId: req.query.provinceId && Number(req.query.provinceId),
        cityId: req.query.cityId && Number(req.query.cityId),
        page: req.query.page ? Number(req.query.page) : 1,
        size: req.query.size ? Number(req.query.size) : 10,
        all: req.query.all === "true",
      } as FilterScheduleRequest;

      const response = await ScheduleService.get(request);

      res
        .status(200)
        .json(
          ResponseHelpers.successWithPagination(
            "Schedule get successfully",
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

      const scheduleId = Number(id);
      if (isNaN(scheduleId)) {
        res
          .status(400)
          .json(
            ResponseHelpers.error(
              "Invalid Schedule ID",
              "ID must be type of number"
            )
          );
        return;
      }

      const response = await ScheduleService.delete(scheduleId);

      res
        .status(200)
        .json(
          ResponseHelpers.success("Schedule deleted successfully", response)
        );
    } catch (error) {
      next(error);
    }
  }
}
