import { Booking, BookingStatus, IdType } from "@prisma/client";
import { ScheduleGlobalResponse } from "../schedule/schedule-model";
import { CountryGlobalResponse } from "../country/country-model";
import { ProvinceGlobalResponse } from "../province/province-model";
import { CityGlobalResponse } from "../city/city-model";
import { UserGlobalResponse } from "../user/user-model";

export type BookingResponse = {
  id: number;
  schedule: ScheduleGlobalResponse;
  bookingNumber: string;
  passengerName: string;
  idType: IdType;
  idNumber: string;
  country: CountryGlobalResponse;
  province: ProvinceGlobalResponse;
  city: CityGlobalResponse;
  address: string;
  bookingStatus: BookingStatus;
  createdBy: UserGlobalResponse;
  createdAt: string;
  updatedAt: string;
};

export type BookingRequest = {
  scheduleId: number;
  passengerName: string;
  idType: IdType;
  idNumber: string;
  countryId: number;
  provinceId: number;
  cityId: number;
  address: string;
};

export type FilterBookingRequest = {
  search?: string;
  departureId?: string;
  arrivalId?: string;
  boatId?: string;
  schedule?: string;
  page: number;
  size: number;
  all?: boolean;
};

export const convertBookingResponse = (
  booking: Booking,
  schedule: ScheduleGlobalResponse,
  country: CountryGlobalResponse,
  province: ProvinceGlobalResponse,
  city: CityGlobalResponse,
  createdBy: UserGlobalResponse
): BookingResponse => {
  return {
    id: booking.id,
    schedule: schedule,
    bookingNumber: booking.booking_number,
    passengerName: booking.passenger_name,
    idType: booking.id_type,
    idNumber: booking.id_number,
    country: country,
    province: province,
    city: city,
    address: booking.address,
    bookingStatus: booking.booking_status,
    createdBy: createdBy,
    createdAt: booking.created_at.toISOString(),
    updatedAt: booking.updated_at.toISOString(),
  };
};
