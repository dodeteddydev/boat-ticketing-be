import { z, ZodType } from "zod";

export class PortValidation {
  static create: ZodType = z.object({
    portName: z
      .string({ required_error: "Port name is required" })
      .min(1, "Port name must be at least 1 character"),
    portCode: z
      .string({ required_error: "Port code is required" })
      .min(1, "Port code must be at least 1 character"),
    countryId: z.number({ required_error: "Country is required" }).min(1),
    provinceId: z.number({ required_error: "Province is required" }).min(1),
    cityId: z.number({ required_error: "City is required" }).min(1),
  });

  static update: ZodType = this.create;

  static get: ZodType = z
    .object({
      search: z.string().min(1).optional(),
      countryId: z.number().min(1).optional(),
      provinceId: z.number().min(1).optional(),
      cityId: z.number().min(1).optional(),
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
