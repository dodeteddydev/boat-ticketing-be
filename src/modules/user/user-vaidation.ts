import { z, ZodType } from "zod";

export class UserValidation {
  static register: ZodType = z.object({
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
}
