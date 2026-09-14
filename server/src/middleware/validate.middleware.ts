import { Request, Response, NextFunction } from "express";
import { z } from "zod";

export const validate = (
  schema: z.ZodType,
  source: "body" | "params" = "body"
) => {
  return (req:Request, res:Response, next:NextFunction) => {
    const result = schema.safeParse(req[source]);

    if(!result.success) {
      return res.status(400).json({
        message: "Validation failed",
        error: result.error.issues.map((issue) => ({
            field: issue.path.join("."),
            message: issue.message
        }))
      });
    }
    req[source] = result.data;
    next();
  };
};
