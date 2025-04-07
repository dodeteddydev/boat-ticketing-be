import { z, ZodType } from "zod";

export class BoatValidation {
  static create: ZodType = z.object({
    boatName: z
      .string({ required_error: "Boat name is required" })
      .min(1, "Boat name must be at least 1 character"),
    boatCode: z
      .string({ required_error: "Boat code is required" })
      .min(1, "Boat code must be at least 1 character"),
    categoryId: z.number({ required_error: "Category is required" }).min(1),
  });

  static update: ZodType = this.create;

  static get: ZodType = z
    .object({
      search: z.string().min(1).optional(),
      categoryId: z.number().min(1).optional(),
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
