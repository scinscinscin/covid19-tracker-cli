import { Middleware } from "./notFoundHandler";
const { version } = require("../../package.json");

/**
 * just adds some debug information to the response headers
 * currently only adds the covid cli version
 * @param _ request
 * @param res response
 * @param next next function
 */
export const debugMiddleware: Middleware = (_, res, next) => {
    res.setHeader("covid-cli-version", version);
    next();
};
