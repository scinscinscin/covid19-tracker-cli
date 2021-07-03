import { CountryData, GlobalData, ModeOrAll } from "../types/schema";
import { MainFunction, Metadata, ObjectIface } from "../types/types";
import {
    getCountryData,
    getCountryHistorical,
    getGlobalData,
    getGlobalHistorical,
} from "./getInfo";

// contains the main functions used by the app

/**
 * filter data so that only numbers remain. this removes typings
 * this also splits between perMillion data
 * @param data result from querying the cache
 * @returns tuple containing ObjectIface<number>s. First tuple is non percentages, second tuple is percentages
 */
const getNumbersFromData = (
    oldData: CountryData | GlobalData
): [ObjectIface<number>, ObjectIface<number>] => {
    // prettier-ignore
    // list of keys that should be ignored
    const bannedKeys = ["population", "undefined", "updated", "affectedCountries"];
    let nonPercent: ObjectIface<number> = {};
    let percent: ObjectIface<number> = {};

    // @ts-ignore, idk how to make this work
    Object.keys(oldData).forEach((key: keyof typeof oldData) => {
        let value = oldData[key];
        if (key.includes("PerPeople") || bannedKeys.includes(key)) return;
        if (typeof value === "number") {
            if (value === 0) return; // remove any data that is just 0
            if (key.includes("PerOneMillion")) percent[key] = value;
            else nonPercent[key] = value;
        }
    });

    return [nonPercent, percent];
};

/**
 * gets the metadata from country / globaldata
 * @param data object containing metadata such as updated time and country
 * @param mode mode that the user selected, useful for historical
 */
const getMeta = (
    data: CountryData | GlobalData,
    mode?: ModeOrAll
): Metadata => {
    let response = {} as Metadata;
    response.updated = data.updated;
    if ("country" in data) response.country = data.country;
    if (mode !== undefined) response.mode = mode;
    return response;
};

/**
 * @param id the idenitifer for the country
 * @param callback what processor to send the data to
 */
export const countryData: MainFunction = async (
    callback,
    { id }
): Promise<string> => {
    if (id === undefined) throw new Error("ID is undefined");
    let oldData = await getCountryData(id);
    let newData = getNumbersFromData(oldData);
    let metadata = getMeta(oldData);

    return await callback(metadata, newData);
};

/**
 * @param id the identifier for the country
 * @param mode what specific bit of data to get
 * @param callback what processor to send the data to
 */
export const countryHistorical: MainFunction = async (
    callback,
    { id, mode }
) => {
    if (id === undefined) throw new Error("ID is undefined");
    if (mode === undefined) mode = "all";

    let oldData = await getCountryData(id);
    let newData = getNumbersFromData(oldData);
    let metadata = getMeta(oldData, mode);

    let historical = (await getCountryHistorical(id)).timeline;
    let timeline = mode === "all" ? historical : historical[mode];

    return await callback(metadata, newData, timeline);
};

/**
 * @param callback callback function
 * @returns string output
 */
export const globalData: MainFunction = async (callback) => {
    let oldData = await getGlobalData();
    let newData = getNumbersFromData(oldData);
    let metadata = getMeta(oldData);

    return await callback(metadata, newData);
};

export const globalHistorical: MainFunction = async (callback, { mode }) => {
    if (mode === undefined) mode = "all";

    let oldData = await getGlobalData();
    let newData = getNumbersFromData(oldData);
    let metadata = getMeta(oldData, mode);

    let historical = await getGlobalHistorical();
    let timeline = mode === "all" ? historical : historical[mode];

    return await callback(metadata, newData, timeline);
};
