#!/usr/bin/env node
import minimist from "minimist";
import { dashboardHandler } from "./handlers/dashboardHandler";
import { plainHandler } from "./handlers/plainHandler";
import { regularHandler } from "./handlers/regularHandler";
import { dashboardSizeError, sizes } from "./routers/dashboardRouter";
import { modeNotFoundError, modes } from "./routers/mainRouter";
import { Mode } from "./types/schema";
import { DashboardSize, MainFunction, ObjectIface } from "./types/types";
import {
    countryData,
    countryHistorical,
    globalData,
    globalHistorical,
} from "./utils/main";

// prettier-ignore
(async () => {
    var argv = minimist(process.argv.slice(2));

	const size: DashboardSize = argv.size ?? "sm";
	const mode: Mode = argv.mode ?? "cases";
	if(sizes.includes(size) === false) throw new Error(dashboardSizeError);
	if(modes.includes(mode) === false) throw new Error(modeNotFoundError);

    const country = argv._.shift();
    let params = {
		quiet: argv.q || argv.quiet,
        plain: argv.p || argv.plain,
        dashboard: argv.d || argv.dashboard,
		historical: argv.h || argv.history || argv.historical
    } as ObjectIface<boolean>;
	
    // fix the parameters
    Object.keys(params).forEach((key) => {
        if (params[key] === undefined) params[key] = false;
    });

	let callbackFunction = params.dashboard ? dashboardHandler(true, size) :
							params.plain ? plainHandler(params.quiet):
										regularHandler(params.quiet);
	
	let mainFunction: MainFunction;
	if(params.historical || params.dashboard) mainFunction = country ? countryHistorical : globalHistorical;
	else mainFunction = country ? countryData: globalData;

	const payload: Parameters<typeof mainFunction>[1] = {
		mode: params.dashboard ? "all" : mode,
		id: country
	}
	const response = await mainFunction(callbackFunction, payload);
	console.log(response);
	process.exit(0);
})().catch(({message}) => {
	console.log(message)
	process.exit(0)
});
