import { Prisma } from "@prisma/client";
import { prisma } from "../../config/database";
import { validation } from "../../utilities/validation";
import { convertBoatGlobalResponse } from "../boat/boat-model";
import { convertCityGlobalResponse } from "../city/city-model";
import { convertCountryGlobalResponse } from "../country/country-model";
import { convertPortGlobalResponse } from "../port/port-model";
import { convertProvinceGlobalResponse } from "../province/province-model";
import { convertScheduleGlobalResponse } from "../schedule/schedule-model";
import { convertUserGlobalResponse } from "../user/user-model";
import {
  BookingRequest,
  BookingResponse,
  convertBookingResponse,
} from "./booking-model";
import { BookingValidation } from "./booking-validation";
import { ErrorResponse } from "../../utilities/errorResponse";
import { ScheduleService } from "../schedule/schedule-service";
import { CountryService } from "../country/country-service";
import { ProvinceService } from "../province/province-service";
import { CityService } from "../city/city-service";

type BookingWithRelations = Prisma.BookingGetPayload<{
  include: {
    schedule: {
      include: {
        boat: true;
        arrival: true;
        departure: true;
      };
    };
    country: true;
    province: true;
    city: true;
    created_by: true;
  };
}>;

export class BookingService {
  static async checkAmountValid(userId: number, price: number) {
    const wallet = await prisma.wallet.findUnique({
      where: { user_id: userId },
    });

    if (!wallet) {
      throw new ErrorResponse(
        404,
        "Failed to create booking",
        "User wallet  not found"
      );
    }

    if (wallet.amount < price) {
      throw new ErrorResponse(
        400,
        "Failed to create booking",
        "Your wallet balance is not enough to make this booking"
      );
    }
  }

  static async create(
    request: BookingRequest[],
    userId: number
  ): Promise<BookingResponse[]> {
    const createRequest = validation(BookingValidation.create, request);

    await ScheduleService.checkScheduleExistById(createRequest[0].scheduleId);
    await CountryService.checkCountryExistById(createRequest[0].countryId);
    await ProvinceService.checkProvinceExistById(createRequest[0].provinceId);
    await CityService.checkCityExistById(createRequest[0].cityId);

    const createdBooking: BookingWithRelations[] = await Promise.all(
      createRequest.map(async (booking) => {
        return await prisma.booking.create({
          data: {
            schedule: { connect: { id: Number(booking.scheduleId), seat: -1 } },
            booking_number: booking.bookingNumber,
            passenger_name: booking.passengerName,
            id_type: booking.idType,
            id_number: booking.idNumber,
            country: { connect: { id: Number(booking.countryId) } },
            province: { connect: { id: Number(booking.provinceId) } },
            city: { connect: { id: Number(booking.cityId) } },
            address: booking.address,
            created_by: { connect: { id: Number(userId) } },
          },
          include: {
            schedule: {
              include: {
                boat: true,
                arrival: true,
                departure: true,
              },
            },
            country: true,
            province: true,
            city: true,
            created_by: true,
          },
        });
      })
    );

    return createdBooking.map((booking) =>
      convertBookingResponse(
        booking,
        convertScheduleGlobalResponse(
          booking.schedule,
          convertBoatGlobalResponse(booking.schedule.boat),
          convertPortGlobalResponse(booking.schedule.arrival),
          convertPortGlobalResponse(booking.schedule.departure)
        ),
        convertCountryGlobalResponse(booking.country),
        convertProvinceGlobalResponse(booking.province),
        convertCityGlobalResponse(booking.city),
        convertUserGlobalResponse(booking.created_by)
      )
    );
  }
}
