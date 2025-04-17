import { z, ZodType } from "zod";

export class BookingValidation {
  static create: ZodType = z
    .array(
      z.object({
        scheduleId: z.number({ required_error: "Schedule is required" }).min(1),
        passangerName: z
          .string({ required_error: "Passanger name is required" })
          .min(1, "Passanger name must be at least 1 character"),
        idType: z.enum(["ktp", "passport"]),
        idNumber: z
          .string({ required_error: "ID number is required" })
          .min(1, "ID number must be at least 1 character"),
        countryId: z.number({ required_error: "Country is required" }).min(1),
        provinceId: z.number({ required_error: "Province is required" }).min(1),
        cityId: z.number({ required_error: "City is required" }).min(1),
        address: z
          .string({ required_error: "Address is required" })
          .min(1, "Address must be at least 1 character"),
      })
    )
    .min(1, "Booking must be at least 1 data");

  static update: ZodType = this.create;

  static get: ZodType = z
    .object({
      search: z.string().min(1).optional(),
      departureId: z.number().min(1).optional(),
      arrivalId: z.number().min(1).optional(),
      boatId: z.number().min(1).optional(),
      schedule: z.string().min(1).optional(),
      page: z.number().min(1).positive(),
      size: z.number().min(1).max(100).positive(),
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
