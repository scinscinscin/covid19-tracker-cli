import { GlobalHistoricalData, Timeline } from "../types/schema";
import { CallbackCurry, ObjectIface } from "../types/types";
import { getMapMarker } from "../utils/getInfo";
import {
    DashboardFunctionInput,
    generateDashboardOutput,
    LineDataObject,
} from "../utils/graphics/generateDashboardOutput";
import { paginator } from "../utils/graphics/paginate";
import { getTimestamp } from "../utils/libs/getTimestamp";
import { convertPercentToNonPercent } from "../utils/libs/numberUtils";
import { capitalizeFirstLetter } from "../utils/libs/stringUtils";
import { getDuration } from "./plainHandler";
import { colorMappings } from "./regularHandler";

export const dashboardHandler: CallbackCurry = (_, size) => {
    return async (meta, [nonPercent, percent], timeline) => {
        if (timeline === undefined)
            throw new Error("dashboard - timeline is undefined");
        if (size === undefined)
            throw new Error("dashboard - size is undefined");

        percent = convertPercentToNonPercent(percent); // turn per million into percentages
        let payload = {} as DashboardFunctionInput;

        let lineData: LineDataObject[] = Object.entries(
            timeline as GlobalHistoricalData
        ).map(([key, timeline]) => {
            let values = Object.values(timeline); // get the values
            return {
                style: { line: colorMappings[key] },
                title: capitalizeFirstLetter(key),
                x: values.map((_) => " "),
                y: values,
            };
        });

        payload.lineData = lineData;
        payload.lineLabel = getDuration(meta, timeline["cases"] as Timeline);
        payload.tableData = paginator({ ...nonPercent, ...percent }, 2); // merge data and make the main body
        payload.tableLabel = getTimestamp(meta.updated);
        if (meta.country !== undefined)
            payload.mapMarker = await getMapMarker(meta.country); // set the mapmarker if applicable
        payload.barData = getBars(nonPercent);
        payload.donutData = getDonuts(percent);

        const response = generateDashboardOutput(payload, size);
        return response;
    };
};

/**
 * @param data object containing keys and percentages. it should not be per millions
 * @returns donuts
 */
const getDonuts = (
    data: ObjectIface<number>
): DashboardFunctionInput["donutData"] => {
    let response: ReturnType<typeof getDonuts> = [];
    Object.entries(data).forEach(([key, val]) => {
        key = key.replace("PerOneMillion", ""); // remove start of it
        response.push({
            label: capitalizeFirstLetter(key),
            color: colorMappings[key],
            percent: val,
        });
    });
    return response;
};

const getBars = (
    data: ObjectIface<number>
): DashboardFunctionInput["barData"] => {
    const toBeRemoved = ["tests", "critical"];

    // prettier-ignore
    let response: ReturnType<typeof getBars> = {titles: [], data: []};
    Object.entries(data).forEach(([key, val]) => {
        if (key.includes("today")) return; // don't include stats for today
        if (toBeRemoved.includes(key)) return;

        response.titles.push(capitalizeFirstLetter(key));
        response.data.push(val);
    });
    return response;
};
