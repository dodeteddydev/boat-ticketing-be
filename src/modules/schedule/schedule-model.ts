import { Schedule } from "@prisma/client";
import { BoatGlobalResponse } from "../boat/boat-model";
import { PortGlobalResponse } from "../port/port-model";
import { UserGlobalResponse } from "../user/user-model";

export type ScheduleGlobalResponse = {
  id: number;
  schedule: string;
  price: number;
  markupPrice?: number;
  boat: BoatGlobalResponse;
  arrival: PortGlobalResponse;
  departure: PortGlobalResponse;
};

export type ScheduleResponse = {
  id: number;
  schedule: string;
  seat: number;
  price: number;
  markupPrice?: number;
  boat: BoatGlobalResponse;
  arrival: PortGlobalResponse;
  departure: PortGlobalResponse;
  createdBy: UserGlobalResponse | null;
  createdAt: string;
  updatedAt: string;
  active: boolean;
};

export type ScheduleRequest = {
  schedule: string;
  seat: number;
  price: number;
  markupPrice?: number;
  boatId: number;
  arrivalId: number;
  departureId: number;
};

export type FilterScheduleRequest = {
  schedule?: string;
  boatId?: number;
  arrivalId?: number;
  departureId?: number;
  page: number;
  size: number;
  all?: boolean;
};

export const convertScheduleResponse = (
  schedule: Schedule,
  boat: BoatGlobalResponse,
  arrival: PortGlobalResponse,
  departure: PortGlobalResponse,
  createdBy: UserGlobalResponse
): ScheduleResponse => {
  return {
    id: schedule.id,
    schedule: schedule.schedule.toISOString(),
    seat: schedule.seat,
    price: schedule.price,
    markupPrice: schedule.markup_price ?? undefined,
    boat: boat,
    arrival: arrival,
    departure: departure,
    createdBy: createdBy,
    createdAt: schedule.created_at.toISOString(),
    updatedAt: schedule.updated_at.toISOString(),
    active: schedule.active,
  };
};

export const convertScheduleGlobalResponse = (
  schedule: Schedule,
  boat: BoatGlobalResponse,
  arrival: PortGlobalResponse,
  departure: PortGlobalResponse
): ScheduleGlobalResponse => {
  return {
    id: schedule.id,
    schedule: schedule.schedule.toISOString(),
    price: schedule.price,
    markupPrice: schedule.markup_price ?? undefined,
    boat: boat,
    arrival: arrival,
    departure: departure,
  };
};
