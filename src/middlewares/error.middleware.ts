import { ErrorRequestHandler } from "express";
import { AppError } from "../errors/app.error.js";
import { ApiResponse } from "../utils/apiResponse.util.js";
import logger from "../utils/logger.util.js";
import { HTTP_MESSAGES, HTTP_STATUS } from "../constants/http.messages.contants.js";

export const errorMiddleware: ErrorRequestHandler = (error, _req, res, _next) => {
    if (error instanceof AppError) {
        ApiResponse.error(res, error.message, null, error.statusCode);
        return;
    }

    logger.error("Unhandled Error:", error);

    ApiResponse.error(res, HTTP_MESSAGES.SERVER_ERROR, null, HTTP_STATUS.INTERNAL_SERVER_ERROR);
};
