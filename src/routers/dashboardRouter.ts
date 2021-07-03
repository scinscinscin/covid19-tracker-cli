import { Router } from "express";
import { dashboardHandler } from "../handlers/dashboardHandler";
import { DashboardSize } from "../types/types";
import { countryHistorical, globalHistorical } from "../utils/main";
import { RouterWrapper, RouterWrapperOptions } from "../utils/RouterWrapper";

const dashboardPrefixes = ["/history/web/charts", "/history/charts"];
export const sizes: DashboardSize[] = ["lg", "md", "sm"];
// prettier-ignore
export const dashboardSizeError = `Unknown dashboard size. Try <${sizes.join(" | ")}>`;

// routes for dashboard
export const dashboardRouter = Router();
const wrapperOptions: RouterWrapperOptions = {
    addQuiet: false,
    onlyPrefixPrepended: true,
};
let { register } = new RouterWrapper(
    dashboardRouter,
    dashboardPrefixes,
    wrapperOptions
);

register("/:size?", async (req, res) => {
    let size = req.params.size; // get size from request
    if (size === undefined) size = "sm"; // set to sm id undefined
    if (sizes.includes(size) === false) return; // exit if the size is a country
    res.locals.data = await globalHistorical(dashboardHandler(true, size), {});
});

register("/:id/:size?", async (req, res) => {
    let { id, size } = req.params;
    if (size === undefined) size = "sm";
    if (sizes.includes(size) === false) throw new Error(dashboardSizeError);
    res.locals.data = await countryHistorical(dashboardHandler(true, size), {
        id,
    });
});
