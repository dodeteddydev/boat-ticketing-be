import { z, ZodType } from "zod";

export class WalletValidation {
  static update: ZodType = z.object({
    amount: z.number({ required_error: "User ID is required" }),
  });
}
