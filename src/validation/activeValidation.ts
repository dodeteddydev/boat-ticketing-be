import { z } from "zod";

export const activeValidation = z.object({
  active: z.boolean({ required_error: "Active is required" }),
});
