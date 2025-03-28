import { z, ZodType } from "zod";

export class CountryValidation {
  static create: ZodType = z.object({
    countryName: z
      .string({ required_error: "Country name is required" })
      .min(1, "Country name must be at least 1 character"),
    countryCode: z
      .string({ required_error: "Country code is required" })
      .min(1, "Country code must be at least 1 character"),
  });

  static update: ZodType = this.create;

  static get: ZodType = z
    .object({
      search: z.string().min(1).optional(),
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
