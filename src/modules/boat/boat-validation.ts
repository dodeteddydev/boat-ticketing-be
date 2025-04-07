import { z, ZodType } from "zod";

export class ProvinceValidation {
  static create: ZodType = z.object({
    provinceName: z
      .string({ required_error: "Province name is required" })
      .min(1, "Province name must be at least 1 character"),
    provinceCode: z
      .string({ required_error: "Province code is required" })
      .min(1, "Province code must be at least 1 character"),
    countryId: z.number({ required_error: "Country is required" }).min(1),
  });

  static update: ZodType = this.create;

  static get: ZodType = z
    .object({
      search: z.string().min(1).optional(),
      countryId: z.number().min(1).optional(),
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
