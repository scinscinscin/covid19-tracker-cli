import { Router } from "express";
import { quietBasicMiddleware } from "../middlewares/quietBasicMiddleware";
import { Mode } from "../types/schema";
import {
    countryData,
    countryHistorical,
    globalData,
    globalHistorical,
} from "../utils/main";
import { RouterWrapper, RouterWrapperOptions } from "../utils/RouterWrapper";

export const modes: Mode[] = ["cases", "deaths", "recovered"];
export const modeNotFoundError = `Mode not found. Try <${modes.join(" | ")}>`;
export const plainPrefixes = ["/plain", "/basic", "/cmd"];

// main router that the project uses
export const mainRouter = Router();
const wrapperOptions: RouterWrapperOptions = {
    addQuiet: true,
    onlyPrefixPrepended: false,
};
let { register } = new RouterWrapper(mainRouter, plainPrefixes, wrapperOptions);
mainRouter.use(quietBasicMiddleware); // determines if the request is querying for basic or quiet mode

// please do not change the order that the routes are registered in as it matters
register("/history/:id/:mode?", async (req, res) => {
    let { id, mode } = req.params;
    if (modes.includes(id as Mode)) return; // the id is a mode so it must go through the global handler
    if (mode === undefined) mode = "cases"; // set to cases by default
    if (modes.includes(mode) === false) throw new Error(modeNotFoundError);

    // prettier-ignore
    res.locals.data = await countryHistorical(res.locals.callback, { id, mode });
});

register("/history/:mode?", async (req, res) => {
    let { id, mode } = req.params;
    if (mode === undefined) mode = "cases"; // set to cases by default
    if (modes.includes(mode) === false) throw new Error(modeNotFoundError);

    // prettier-ignore
    res.locals.data = await globalHistorical(res.locals.callback, { id, mode });
});

register("/:id?", async (req, res) => {
    let { id, mode } = req.params;
    let mainFunction = id !== undefined ? countryData : globalData;

    // prettier-ignore
    res.locals.data = await mainFunction(res.locals.callback, {id, mode})
});
