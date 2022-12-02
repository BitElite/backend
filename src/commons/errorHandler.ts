import * as httpStatus from "http-status";
const { env } = require("../config/index");
import { Request, Response, NextFunction } from "express";
import { ApiError } from "./APIError";

/**
 * Error handler. Send stacktrace only during development
 * @public
 */
const handler = (err: ApiError, req: Request, res: Response, next: NextFunction) => {
    const response = {
        success: false,
        code: err.status,
        message: err.message || httpStatus[err.status],
        errors: err.errors,
        stack: err.stack,
    };

    if (env !== "development") {
        delete response.stack;
    }

    res.status(err.status);
    res.json(response);
};

/**
 * If error is not an instanceOf APIError, convert it.
 * @public
 */
const converter = (err: ApiError | Error, req: Request, res: Response, next: NextFunction) => {
    let convertedError: ApiError;
    if (!(err instanceof ApiError)) {
        convertedError = new ApiError(
            err.message,
            500,
            [],
            err.stack,
        );
        return handler(convertedError, req, res, next);
    }
    return handler(err, req, res, next);


};

/**
 * Catch 404 and forward to error handler
 * @public
 */
const notFound = (req: Request, res: Response, next: NextFunction) => {
    const err = new ApiError(
        "Not found",
        httpStatus.NOT_FOUND,
        []
    );
    return handler(err, req, res, next);
};


export {
    handler,
    converter,
    notFound
};