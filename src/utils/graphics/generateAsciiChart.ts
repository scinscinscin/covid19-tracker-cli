import { Timeline } from "../../types/schema";
import * as asciichart from "asciichart";
import { getMostCommonElement } from "../libs/numberUtils";

const multiplier = 100;

// https://stackoverflow.com/questions/32439437/retrieve-an-evenly-distributed-number-of-elements-from-an-array
const limiter = (data: number[], limit: number): number[] => {
    if (data.length <= limit) return data; // length of data is lower than the limit so just send it again

    let response: number[] = [data[0]]; // initiate return array and add first item
    let totalItems = data.length - 2; // get length of input array without first and last item
    let interval = totalItems / (limit - 2); // get the interval (this contains decimals so it can be a bit more precise)

    // push element from input evenly to the output
    for (var i = 1; i < limit - 1; i++) {
        let index = Math.round(i * interval);
        response.push(data[index]);
    }
    response.push(data[data.length - 1]); // add the last element from the input
    return response;
};

/**
 * asciichart config used
 */
const config: asciichart.PlotConfig = {
    height: 15,
};

/**
 * @param raw Timeline
 * @param sample the amount of samples, generally controls the length of the chart
 * @returns chart
 */
export const generateAsciiChart = (raw: Timeline, sample: number): string => {
    let data = limiter(Object.values(raw), sample); // limit the data
    data = data.map((num) => num / multiplier); // divide each number by 100

    let chart = asciichart.plot(data, config); // generate chart
    chart = replaceFloats(chart); // replace the floats on the chart
    chart = patchChart(chart); // get most common place of divider

    return chart;
};

const replaceFloats = (chart: string): string => {
    chart.match(/[+-]?\d+(\.\d+)?/g)!.forEach((strFloat) => {
        let rounded = Math.round(parseFloat(strFloat) * multiplier).toString();
        chart = chart.replace(strFloat, rounded);
    });

    return chart;
};

const patchChart = (chart: string): string => {
    // get most common place of divider
    const getPosOfDivider = (line: string) => {
        let pos = line.indexOf("┤");
        if (pos !== -1) return pos;
        else return line.indexOf("┼");
    };
    let commonPos = getMostCommonElement(
        chart.split("\n").map(getPosOfDivider)
    );

    // prettier-ignore
    chart = chart.split("\n").map(line => {
		while(getPosOfDivider(line) !== commonPos){
			if(getPosOfDivider(line) > commonPos) line = line.substring(1); // remove first character
			else line = " " + line;
		}
		return line;
	}).join("\n")

    chart = chart.replace("┼", "┤"); // replace the first instance with the regular divier, needed for inserting into tables
    return chart;
};
