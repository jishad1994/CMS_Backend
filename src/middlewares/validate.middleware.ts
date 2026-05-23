import { ZodSchema } from "zod";
import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/app.error";
import logger from "../utils/logger.util";
import { HTTP_STATUS } from "../constants/http.messages.contants";

export type IRequestObjects = "body" | "params" | "query" | "user" | "cookies";

const formatZodErrorMessage = (fieldErrors: Record<string, string[] | undefined>): string => {
    return Object.entries(fieldErrors)
        .map(([field, messages]) => {
            const message = messages?.join(", ") ?? "Invalid value";
            return `${field}: ${message}`;
        })
        .join("; ");
};

export const validate = (schema: ZodSchema, sources: IRequestObjects[]) => (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        for (const source of sources) {
            const result = schema.safeParse({ body: req[source] });

            if (!result.success) {
                logger.error("validation error:", result.error.flatten().fieldErrors);
                const fieldErrors = result.error.flatten().fieldErrors;
                const message = formatZodErrorMessage(fieldErrors);

                return next(new AppError(message || "Validation failed", HTTP_STATUS.BAD_REQUEST));
            }

            req[source] = result.data;
        }

        next();
    } catch (error) {
        next(error);
    }
};
