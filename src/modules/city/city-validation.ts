import { z, ZodType } from "zod";

export class CityValidation {
  static create: ZodType = z.object({
    cityName: z
      .string({ required_error: "City name is required" })
      .min(1, "City name must be at least 1 character"),
    countryId: z.number({ required_error: "Country is required" }).min(1),
    provinceId: z.number({ required_error: "Province is required" }).min(1),
  });

  static update: ZodType = this.create;

  static get: ZodType = z.object({
    search: z.string().min(1).optional(),
    countryId: z.number().min(1).optional(),
    provinceId: z.number().min(1).optional(),
    page: z.number().min(1).positive(),
    size: z.number().min(1).max(100).positive(),
  });
}
