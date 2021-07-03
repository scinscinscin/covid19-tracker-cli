import colors from "colors";
import { Timeline } from "../types/schema";
import { CallbackCurry, ObjectIface } from "../types/types";
import { generateAsciiChart } from "../utils/graphics/generateAsciiChart";
import { generateColorTable } from "../utils/graphics/generateTable";
import { getTimestamp } from "../utils/libs/getTimestamp";
import { getTitle } from "../utils/libs/getTitle";
import { convertPercentToNonPercent } from "../utils/libs/numberUtils";
import { camelToSentenceCase, removeANSI } from "../utils/libs/stringUtils";
import { lines } from "../utils/lines";
import { getSaying } from "../utils/sayings";
import { getDuration } from "./plainHandler";

export const colorMappings: ObjectIface<keyof colors.Color> = {
    active: "blue",
    cases: "yellow",
    critical: "cyan",
    deaths: "red",
    recovered: "green",
    tests: "magenta",
};

const getKeysColor = (str: string): string => {
    let response = str;
    Object.entries(colorMappings).forEach(([keyWord, color]) => {
        // @ts-ignore. This will never be a function
        if (str.toLowerCase().includes(keyWord)) response = str[color];
    });
    return response; // default value
};

const parseData = (data: ObjectIface<number>): ObjectIface<string> => {
    let unsorted: ObjectIface<string> = {};
    Object.entries(data).forEach(([key, value]) => {
        let stringValue = value.toString();
        if (key.includes("PerOneMillion")) stringValue += "%";
        key = camelToSentenceCase(key).replace("Per One Million", "%");
        unsorted[key] = stringValue;
    });

    let sortedAndColored: ObjectIface<string> = {};
    Object.keys(unsorted)
        .sort()
        .forEach((key) => {
            let coloredKey = getKeysColor(key);
            sortedAndColored[coloredKey] = unsorted[key];
        });
    return sortedAndColored;
};

const constructTable = (data: ObjectIface<string>, cols = 8): string[][] => {
    let raw = Object.entries(data);
    let response: string[][] = [];

    while (raw.length > 0) {
        let keyPairArray: [string, string][] = []; // array split from raw containing <cols> amount of items
        for (let i = 0; i < cols; i++)
            keyPairArray.push(raw.shift() ?? ["", ""]);

        let keys = keyPairArray.map(([key]) => key);
        let values = keyPairArray.map(([_, value]) => value);
        response.push(keys, values); // add to response;
    }

    return response;
};

export const regularHandler: CallbackCurry = (isQuiet) => {
    // prettier-ignore
    return (meta, [nonPercent, percent], timeline) => {
		let payload: Parameters<typeof generateColorTable>[0] = [
			getTitle(meta.country, timeline !== undefined), // title	
		]

		payload.push(getTimestamp(meta.updated)) // add timestamp
		const cols = timeline !== undefined ? 8 : 4; // limit to 4 columns when there is no chart
		let dataTable = constructTable(parseData({ ...nonPercent, ...convertPercentToNonPercent(percent) }), cols);
		payload = payload.concat(dataTable); // add body
		
		// generate chart if applicable
		let chart = timeline !== undefined ? generateAsciiChart(timeline as Timeline, 100) : undefined;
		if(chart !== undefined){
			let duration = getDuration(meta, timeline as Timeline)
			payload.push(duration);
			payload = payload.concat(chart.split("\n")) // add the chart
		}

		let response = generateColorTable(payload).split("\n");
		const divider = "═".repeat(removeANSI(response[0]).length);

		response.push(lines.sponsorMessage, lines.BMCLink.red);
		if(isQuiet === false){
			response.push(divider, `\n${getSaying().green}\n`);
			response.push(divider, lines.twitterPlug);
			response.push(lines.handleHashtag.map((str) => str.black.bgCyan).join(" "));
		}
		
        return response.join("\n") + "\n";
    };
};
