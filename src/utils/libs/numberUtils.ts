import { ObjectIface } from "../../types/types";

export const convertPercentToNonPercent = (
    data: ObjectIface<number>
): ObjectIface<number> => {
    const toBeRemoved = ["casesPerOneMillion", "criticalPerOneMillion"];
    let cases = data["casesPerOneMillion"]; // be the number of covid 19 cases
    let response: ReturnType<typeof convertPercentToNonPercent> = {};

    Object.keys(data).forEach((key) => {
        if (toBeRemoved.includes(key)) return;
        let tempValue: number;
        if (key !== "testsPerOneMillion") tempValue = data[key] / cases;
        else tempValue = data[key] / 1000000;
        tempValue = tempValue * 100;

        let value = Math.round(tempValue * 1000) / 1000; // round to 3 decimal places
        response[key] = value;
    });

    return response;
};

/**
 * from https://stackoverflow.com/questions/1053843/get-the-element-with-the-highest-occurrence-in-an-array
 * @param arr array of any type
 * @returns the most common element in the array
 */
// prettier-ignore
export const getMostCommonElement = (arr: any[]) => {
    return arr.sort((a,b) =>
          arr.filter(v => v===a).length
        - arr.filter(v => v===b).length
    ).pop();
}
