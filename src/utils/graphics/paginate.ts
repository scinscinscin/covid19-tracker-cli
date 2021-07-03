import { ObjectIface } from "../../types/types";
import { camelToSentenceCase, sortBasedOnLength } from "../libs/stringUtils";

const findKeyValueLength = (
    obj: ObjectIface<string>,
    type: "keys" | "values"
): number => Object[type](obj).sort(sortBasedOnLength)[0].length;

const getUnformattedData = (data: ObjectIface<number>): ObjectIface<string> => {
    let response: ObjectIface<string> = {};
    Object.keys(data).forEach((key) => {
        let value: string = data[key].toString();
        if (key.includes("PerOneMillion")) value += "%"; // add percent sign to value if applicable
        key = camelToSentenceCase(key).replace("Per One Million", "%");
        response[key] = value;
    });
    return response;
};

const getData = (data: ObjectIface<number>): ObjectIface<string> => {
    let unformattedData = getUnformattedData(data);
    let response: ObjectIface<string> = {};
    Object.keys(unformattedData)
        .sort()
        .forEach((key) => {
            let value = unformattedData[key];
            response[key] = value;
        });
    return response;
};

/**
 *
 * @param data data in the format of key: value
 * @param cols how many columns to paginate
 * @returns
 */
export const paginator = (data: ObjectIface<number>, cols = 2): string => {
    let formattedData = getData(data); // format the data

    // find the length of keys and values
    let keyLength = findKeyValueLength(formattedData, "keys");
    let valueLength = findKeyValueLength(formattedData, "values");

    let strings: string[] = []; // is an array where the key is matched with the value
    Object.keys(formattedData).forEach((key) => {
        let paddedKey = key.padEnd(keyLength);
        let value = formattedData[key].padEnd(valueLength);
        strings.push(`${paddedKey}| ${value}`);
    });

    // combine strings based on the number of columns
    let combinedStrings: string[] = [];
    while (strings.length > 0) {
        let tempArray: (string | undefined)[] = [];
        for (let i = 0; i < cols; i++) tempArray.push(strings.shift());
        tempArray = tempArray.map((str) => (str === undefined ? "" : str)); // change any undefined to empty string
        combinedStrings.push(tempArray.join("    ")); // join and push
    }

    return combinedStrings.join("\n"); // return joined combined strings;
};
