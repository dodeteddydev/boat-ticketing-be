import { prisma } from "../../config/database";
import { logger } from "../../config/logger";
import { ActiveRequest } from "../../types/activeRequest";
import { Pageable } from "../../types/pageable";
import { ErrorResponse } from "../../utilities/errorResponse";
import { validation } from "../../utilities/validation";
import { activeValidation } from "../../validation/activeValidation";
import { convertBoatGlobalResponse } from "../boat/boat-model";
import { BoatService } from "../boat/boat-service";
import { convertPortGlobalResponse } from "../port/port-model";
import { PortService } from "../port/port-service";
import { convertUserGlobalResponse } from "../user/user-model";
import {
  convertScheduleResponse,
  FilterScheduleRequest,
  ScheduleRequest,
  ScheduleResponse,
} from "./schedule-model";
import { ScheduleValidation } from "./schedule-validation";

export class ScheduleService {
  static async checkScheduleExist(date: Date, boatId: number) {
    const schedule = await prisma.schedule.findFirst({
      where: {
        AND: [{ schedule: date }, { boat_id: boatId }],
      },
    });

    const errorMessage = "Schedule is already exist";

    if (schedule)
      throw new ErrorResponse(400, "Failed create schedule", errorMessage);
  }

  static async checkScheduleExistById(
    portId: number
  ): Promise<{ schedule: Date; boatId: number }> {
    const existingSchedule = await prisma.schedule.findUnique({
      where: { id: portId },
    });

    if (!existingSchedule) {
      throw new ErrorResponse(
        404,
        "Schedule not found",
        "Schedule with this ID doesn't exist!"
      );
    }

    return {
      schedule: existingSchedule.schedule,
      boatId: existingSchedule.boat_id,
    };
  }

  static checkPort(arrivalId: number, departureId: number) {
    if (arrivalId === departureId) {
      throw new ErrorResponse(
        400,
        "Failed create schedule",
        "Arrival and departure ports must be different"
      );
    }
  }

  static async checkMarkup(userId: number, markupPrice?: number) {
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (user?.role !== "superadmin" && markupPrice) {
      throw new ErrorResponse(
        400,
        "Failed create schedule",
        "Only superadmin is allowed to set a markup price"
      );
    }
  }

  static async create(
    request: ScheduleRequest,
    userId: number
  ): Promise<ScheduleResponse> {
    const createRequest = validation(ScheduleValidation.create, request);

    await this.checkMarkup(Number(userId), createRequest.markupPrice);
    await this.checkScheduleExist(
      new Date(createRequest.schedule),
      createRequest.boatId
    );
    await BoatService.checkBoatExistById(createRequest.boatId);
    await PortService.checkPortExistById(createRequest.arrivalId, "Arrival");
    await PortService.checkPortExistById(
      createRequest.departureId,
      "Departure"
    );
    this.checkPort(createRequest.arrivalId, createRequest.departureId);

    const createdPort = await prisma.schedule.create({
      data: {
        schedule: createRequest.schedule,
        seat: createRequest.seat,
        price: createRequest.price,
        markup_price: createRequest.markupPrice,
        boat: { connect: { id: Number(createRequest.boatId) } },
        arrival: { connect: { id: Number(createRequest.arrivalId) } },
        departure: { connect: { id: Number(createRequest.departureId) } },
        created_by: { connect: { id: Number(userId) } },
      },
      include: {
        boat: true,
        arrival: true,
        departure: true,
        created_by: true,
      },
    });

    return convertScheduleResponse(
      createdPort,
      convertBoatGlobalResponse(createdPort.boat),
      convertPortGlobalResponse(createdPort.arrival),
      convertPortGlobalResponse(createdPort.departure),
      convertUserGlobalResponse(createdPort.created_by)
    );
  }

  static async update(
    request: ScheduleRequest,
    id: number,
    userId: number
  ): Promise<ScheduleResponse> {
    const updateRequest = validation(ScheduleValidation.create, request);

    const { schedule, boatId } = await this.checkScheduleExistById(id);
    const isSameSchedule =
      new Date(updateRequest.schedule).toISOString() !== schedule.toISOString();

    if (isSameSchedule) {
      await this.checkMarkup(Number(userId), updateRequest.markupPrice);
      await this.checkScheduleExist(
        new Date(updateRequest.schedule),
        updateRequest.boatId
      );
      await BoatService.checkBoatExistById(updateRequest.boatId);
      await PortService.checkPortExistById(updateRequest.arrivalId, "Arrival");
      await PortService.checkPortExistById(
        updateRequest.departureId,
        "Departure"
      );
      this.checkPort(updateRequest.arrivalId, updateRequest.departureId);
    }

    if (updateRequest.boatId !== boatId) {
      await this.checkScheduleExist(
        new Date(updateRequest.schedule),
        updateRequest.boatId
      );
    }

    await this.checkMarkup(Number(userId), updateRequest.markupPrice);
    await BoatService.checkBoatExistById(updateRequest.boatId);
    await PortService.checkPortExistById(updateRequest.arrivalId, "Arrival");
    await PortService.checkPortExistById(
      updateRequest.departureId,
      "Departure"
    );
    this.checkPort(updateRequest.arrivalId, updateRequest.departureId);

    const updatedPort = await prisma.schedule.update({
      where: { id },
      data: {
        schedule: updateRequest.schedule,
        seat: updateRequest.seat,
        price: updateRequest.price,
        markup_price: updateRequest.markupPrice,
        boat: { connect: { id: Number(updateRequest.boatId) } },
        arrival: { connect: { id: Number(updateRequest.arrivalId) } },
        departure: { connect: { id: Number(updateRequest.departureId) } },
      },
      include: {
        boat: true,
        arrival: true,
        departure: true,
        created_by: true,
      },
    });

    return convertScheduleResponse(
      updatedPort,
      convertBoatGlobalResponse(updatedPort.boat),
      convertPortGlobalResponse(updatedPort.arrival),
      convertPortGlobalResponse(updatedPort.departure),
      convertUserGlobalResponse(updatedPort.created_by)
    );
  }

  static async active(
    request: ActiveRequest,
    id: number
  ): Promise<{ active: boolean }> {
    const activeRequest = validation(activeValidation, request);

    await this.checkScheduleExistById(id);

    const updatedActive = await prisma.schedule.update({
      where: { id },
      data: {
        active: activeRequest.active,
      },
    });

    return { active: updatedActive.active };
  }

  static async get(
    request: FilterScheduleRequest
  ): Promise<Pageable<ScheduleResponse>> {
    const getRequest = validation(ScheduleValidation.get, request);

    const skip = (getRequest.page - 1) * getRequest.size;

    const filters = [];

    if (getRequest.schedule) {
      filters.push({
        schedule: new Date(getRequest.schedule),
      });
    }

    if (getRequest.arrivalId) {
      filters.push({
        arrival_id: Number(getRequest.arrivalId),
      });
    }

    if (getRequest.departureId) {
      filters.push({
        departure_id: Number(getRequest.departureId),
      });
    }

    const getPort = await prisma.schedule.findMany({
      where: {
        AND: filters,
      },
      orderBy: {
        created_at: "desc",
      },
      take: getRequest.all ? undefined : getRequest.size,
      skip: getRequest.all ? undefined : skip,
      include: {
        boat: true,
        arrival: true,
        departure: true,
        created_by: true,
      },
    });

    const total = await prisma.schedule.count({
      where: {
        AND: filters,
      },
    });

    return {
      data: getPort.map((value) =>
        convertScheduleResponse(
          value,
          convertBoatGlobalResponse(value.boat),
          convertPortGlobalResponse(value.arrival),
          convertPortGlobalResponse(value.departure),
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
    await this.checkScheduleExistById(id);

    await prisma.schedule.delete({
      where: { id },
      include: {
        created_by: true,
      },
    });

    return `Schedule with ID ${id} is deleted`;
  }
}
