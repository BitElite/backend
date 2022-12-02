import * as Joi from 'joi';
import { NextFunction, Request, Response } from "express";
import { ApiError } from "../commons/APIError";
const validateRequest = (schema: Joi.Schema) => {
    const options = {
        abortEarly: false, // include all errors
        allowUnknown: true, // ignore unknown props
        stripUnknown: true // remove unknown props
    };
    return (req: Request, res: Response, next: NextFunction) => {
        const { error, value } = schema.validate(req.body, options);
        if (error) {
            next(new ApiError("Validation error", 400, error.details));
        } else {
            req.body = value;
            next();
        }
    }
}

export = validateRequest