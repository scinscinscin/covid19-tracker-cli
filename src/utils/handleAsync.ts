import { Request, Response, NextFunction } from "express";

/* Explanation 
	This is a curry function. It's a function that returns another function.
	handleAsync is a function that takes a function as its parameter and returns another function
*/

type ReturnType = Promise<void | Response> | void | Response;
type Handler<R> = (req: Request, res: Response, next: NextFunction) => R;
export type AsyncFn = Handler<ReturnType>;
const handleAsync: (asyncFn: AsyncFn) => Handler<void> = (asyncFn) => {
    return async (req, res, next) => {
        if (res.locals.data === undefined || res.locals.data === "") {
            try {
                await Promise.resolve(asyncFn(req, res, next)).catch();
            } catch (err) {
                // error handling
                if (res.statusCode === 200) res.status(500); // if status is 200 then set to 500
                res.locals.data = err.message; // set the data to err.message
            }
        }

        next();
    };
};

export default handleAsync;
