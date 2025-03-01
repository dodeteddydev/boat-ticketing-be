import { ZodType } from "zod";

export const validation = <T>(schema: ZodType, data: T): T =>
  schema.parse(data);
