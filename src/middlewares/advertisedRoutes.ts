import { mainRouter } from "../routers/mainRouter";
import { dashboardRouter } from "../routers/dashboardRouter";
import { Middleware } from "./notFoundHandler";
import { Router } from "express-serve-static-core";

let routes: string[] = [];

/**
 * @param routers routers that are to be advertised
 */
const compileRoutes = (...routers: Router[]) => {
    [...routers].forEach(({ stack }) =>
        stack.forEach((obj) => {
            if (obj.route === undefined) return;
            routes = routes.concat(obj.route.path);
        })
    );
};

compileRoutes(dashboardRouter, mainRouter);

export const advertisedRoutes: Middleware = (_, res, next) => {
    res.locals.data = routes.join("\n");
    next();
};
