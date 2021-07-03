import { Request, Response, NextFunction } from "express";
import { lines } from "../utils/lines";

export type Middleware = (
    req: Request,
    res: Response,
    next: NextFunction
) => void | Response;

export const notFoundHandler: Middleware = (_, res, next) => {
    if (res.locals.data === undefined) {
        res.locals.data = lines.notFound;
        res.status(404);
    }
    next();
};
