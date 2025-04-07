import { z, ZodType } from "zod";

export class CategoryValidation {
  static create: ZodType = z.object({
    categoryName: z
      .string({ required_error: "Category name is required" })
      .min(1, "Category name must be at least 1 character"),
    categoryCode: z
      .string({ required_error: "Category code is required" })
      .min(1, "Category code must be at least 1 character"),
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
