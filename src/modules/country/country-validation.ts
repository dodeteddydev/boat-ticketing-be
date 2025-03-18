import { z, ZodType } from "zod";

export class CountryValidation {
  static create: ZodType = z.object({
    countryName: z.string({ required_error: "Country name is required" }),
    countryCode: z.string({ required_error: "Country code is required" }),
  });

  static update: ZodType = z.object({
    id: z.number({ required_error: "Country id is required" }),
    countryName: z.string({ required_error: "Country name is required" }),
    countryCode: z.string({ required_error: "Country code is required" }),
  });
}
