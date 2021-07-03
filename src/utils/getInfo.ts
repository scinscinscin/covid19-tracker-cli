// retrieves data from the sources
import axios from "axios";
// prettier-ignore
import { CountryData, CountryHistoricalData, GlobalData, GlobalHistoricalData } from "../types/schema";
import { MapMarker } from "./graphics/generateDashboardOutput";
axios.defaults.baseURL = "https://disease.sh/v3/covid-19";

// how much time (in ms) should relapse before refetching data
// as the current api that is being used is refreshing every 10 minutes
// that is the interval that will be used
const fetchInterval = 1000 * 60 * 10;
let finishedInit = false;

let globalData: GlobalData;
let countriesData: CountryData[];
let globalHistoricalData: GlobalHistoricalData;
let countriesHistoricalData: CountryHistoricalData[];

const fetchData = async () => {
    let get = async (str: string) => (await axios.get(str)).data;
    globalData = await get("/all?allowNull=false");
    countriesData = await get("/countries?allowNull=false");
    globalHistoricalData = await get("/historical/all?lastdays=all");
    countriesHistoricalData = await get("/historical?lastdays=all");
    finishedInit = true;
};

fetchData().catch(fetchData);
setInterval(fetchData, fetchInterval); // refetch the data on the interval

// when called this function will block the code by 2 seconds if init is not finished, until it's finished
// this should only repeat at most 2-3 times as the initial fetching of data takes 11 seconds
const makeSureInit = async () => {
    if (finishedInit) return;
    while (finishedInit === false) {
        await new Promise((res) => {
            setTimeout(res, 2000, "");
        });
    }
    return;
};

/**
 * @param id identifier of country: name, iso2, iso3
 * @returns that countries name if it can be found
 */
// prettier-ignore
const getCountryName = (id: string): string => {
	// convert everything to lowercase just in case
	id = id.toLowerCase(); 
	const filter = ({country, countryInfo: {iso2, iso3}}: CountryData) => {
		// the api sends back objects that are undefined? why?
		if([country, iso2, iso3].find(e => e === null) !== undefined) return false;
		return country.toLowerCase() === id || 
		iso2.toLowerCase()=== id || 
		iso3.toLowerCase()=== id
	}
	
	let countryObject = countriesData.find(filter);
	if(countryObject === undefined) throw new Error("Cannot find a country with that name")
	else return countryObject.country; // return the name of the country
}

/**
 * @param id name of country
 * @returns object containing 2 letter code, lat and long
 */
export const getMapMarker = async (id: string): Promise<MapMarker> => {
    let { countryInfo } = await getCountryData(id);
    return {
        countryCode: countryInfo.iso2,
        latitude: countryInfo.lat,
        longitude: countryInfo.long,
    };
};

/**
 * @param id country identifier (name, iso-2, iso-3)
 * @returns historical data of country
 */
export const getCountryHistorical = async (
    id: string
): Promise<CountryHistoricalData> => {
    await makeSureInit();
    let name = getCountryName(id); // get country name from id
    // this should not be undefined because the country name was found, unless the api is broken
    let country = countriesHistoricalData.find((ctry) => ctry.country === name);
    if (country === undefined)
        throw new Error("Cannot find a country with that name");
    return country;
};

/**
 * @param id country identier (name, iso-2, iso-3)
 * @returns data of country
 */
export const getCountryData = async (id: string): Promise<CountryData> => {
    await makeSureInit();
    let name = getCountryName(id);
    // this should not be undefined
    let country = countriesData.find((ctry) => ctry.country === name);
    if (country === undefined)
        throw new Error("Cannot find a country with that name");
    return country;
};

/**
 * make sure that data is initialized
 * @returns global data
 */
export const getGlobalData = async (): Promise<GlobalData> => {
    await makeSureInit();
    return globalData;
};

/**
 * make sure that data is initialized
 * @returns global historical data
 */
export const getGlobalHistorical = async (): Promise<GlobalHistoricalData> => {
    await makeSureInit();
    return globalHistoricalData;
};
