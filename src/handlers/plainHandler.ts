import { Timeline } from "../types/schema";
import { CallbackCurry, Metadata } from "../types/types";
import { generateAsciiChart } from "../utils/graphics/generateAsciiChart";
import { paginator } from "../utils/graphics/paginate";
import { getTimestamp } from "../utils/libs/getTimestamp";
import { getTitle } from "../utils/libs/getTitle";
import { convertPercentToNonPercent } from "../utils/libs/numberUtils";
import { capitalizeFirstLetter } from "../utils/libs/stringUtils";
import { lines } from "../utils/lines";
import { getSaying } from "../utils/sayings";

export const getDuration = ({ mode }: Metadata, timeline: Timeline): string => {
    let keys = Object.keys(timeline);
    if (mode === undefined)
        throw new Error("internal server error - mode undefined");

    const formalMode = mode === "all" ? "Data" : capitalizeFirstLetter(mode);
    let response = `${formalMode} from ${keys.shift()} to ${keys.pop()}`;
    return response;
};

export const plainHandler: CallbackCurry = (isQuiet) => {
    // prettier-ignore
    return (meta, [nonPercent, percent], timeline) => {
        let data = { ...nonPercent, ...convertPercentToNonPercent(percent) }; // convert and merge percent to nonpercent
        let body = paginator(data); // get the mainbody
		let title = getTitle(meta.country, timeline !== undefined)
		
        let chart = timeline !== undefined ? generateAsciiChart(timeline as Timeline, 80) : undefined;
        let totalLength = chart?.split("\n")[0].length; // get total length from chart, is undefined if chart is undefined

        // set totallength if not
        let bodyLength = body.split("\n")[0].length;
        if (totalLength === undefined || totalLength < bodyLength) totalLength = bodyLength;
        let divider = "-".repeat(totalLength);

        let response: string[] = [divider];
		response.push(title, divider);
        response.push(getTimestamp(meta.updated), divider); // as of date
        response = response.concat(body.split("\n")); // add the body
        response.push(divider);
		
		if(chart !== undefined){
			response.push(getDuration(meta, timeline as Timeline), divider)
			response = response.concat(chart.split("\n"))
			response.push(divider)
		}

		response.push(lines.sponsorMessage, lines.BMCLink);
		if(isQuiet === false){
			response.push(divider, `\n${getSaying()}\n`);
			response.push(divider, lines.twitterPlug, lines.handleHashtag.join(" "))
		}

        return response.join("\n") + "\n";
    };
};
