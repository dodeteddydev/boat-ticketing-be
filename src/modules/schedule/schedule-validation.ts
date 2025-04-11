import { z, ZodType } from "zod";

export class ScheduleValidation {
  static create: ZodType = z.object({
    schedule: z
      .string({ required_error: "Schedule is required" })
      .min(1, "Schedule is required"),
    seat: z.number({ required_error: "Seat is required" }).min(1),
    price: z.number({ required_error: "Price is required" }).min(1),
    markupPrice: z.number().min(1).optional(),
    boatId: z.number({ required_error: "Boat is required" }).min(1),
    arrivalId: z.number({ required_error: "Arrival is required" }).min(1),
    departureId: z.number({ required_error: "Departure is required" }).min(1),
  });

  static update: ZodType = this.create;

  static get: ZodType = z
    .object({
      schedule: z.string().min(1).optional(),
      boatId: z.number().min(1).optional(),
      arrivalId: z.number().min(1).optional(),
      departureId: z.number().min(1).optional(),
      page: z.number().min(1).positive().optional(),
      size: z.number().min(1).max(100).positive().optional(),
      all: z.boolean().optional(),
    })
    .superRefine((data, ctx) => {
      if (!data.all) {
        if (!data.page) {
          ctx.addIssue({
            code: "custom",
            path: ["page"],
          });
        }
        if (!data.size) {
          ctx.addIssue({
            code: "custom",
            path: ["size"],
          });
        }
      }
    });
}
