import { z, ZodType } from "zod";

export class TransactionValidation {
  static create: ZodType = z.object({
    amountTransaction: z
      .number({ required_error: "Amount transaction is required" })
      .min(1),
    proofImage: z.string({ required_error: "Proof image is required" }),
  });

  static update: ZodType = this.create;

  static get: ZodType = z
    .object({
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
