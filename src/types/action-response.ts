import { $ZodIssue } from "zod/v4/core";

export interface ActionResponse {
  success: boolean;
  message: string;
  data?: unknown;
  errors?: $ZodIssue[];
}
