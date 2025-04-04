import { z, ZodType } from "zod";

export class UserValidation {
  static create: ZodType = z.object({
    role: z.enum(["superadmin", "boatowner", "boatadmin", "customer"], {
      required_error: "Role is required",
    }),
    name: z
      .string({ required_error: "Name is required" })
      .min(1, "Name must be at least 1 character"),
    username: z
      .string({ required_error: "Username is required" })
      .min(6, "Username must be at least 6 characters"),
    email: z
      .string({ required_error: "Email is required" })
      .email("Please enter a valid email"),
    password: z
      .string({ required_error: "Password is required" })
      .min(6, "Password must be at least 6 character"),
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
