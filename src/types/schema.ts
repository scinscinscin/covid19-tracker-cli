// this file contains the typings for the api
// do not edit the interfaces unless the api schema changed

export interface GlobalData {
    updated: number;
    cases: number;
    todayCases: number;
    deaths: number;
    todayDeaths: number;
    recovered: number;
    todayRecovered: number;
    active: number;
    critical: number;
    casesPerOneMillion: number;
    deathsPerOneMillion: number;
    tests: number;
    testsPerOneMillion: number;
    population: number;
    oneCasePerPeople: number;
    oneDeathPerPeople: number;
    oneTestPerPeople: number;
    activePerOneMillion: number;
    recoveredPerOneMillion: number;
    criticalPerOneMillion: number;
    affectedCountries: number;
    undefined: number;
}

export interface CountryInfo {
    _id?: number;
    iso2: string;
    iso3: string;
    lat: number;
    long: number;
    flag: string;
}

export interface CountryData {
    updated: number;
    country: string;
    countryInfo: CountryInfo;
    cases: number;
    todayCases: number;
    deaths: number;
    todayDeaths: number;
    recovered: number;
    todayRecovered: number;
    active: number;
    critical: number;
    casesPerOneMillion: number;
    deathsPerOneMillion: number;
    tests: number;
    testsPerOneMillion: number;
    population: number;
    continent: string;
    oneCasePerPeople: number;
    oneDeathPerPeople: number;
    oneTestPerPeople: number;
    activePerOneMillion: number;
    recoveredPerOneMillion: number;
    criticalPerOneMillion: number;
    undefined?: number;
}

export interface Timeline {
    [key: string]: number;
}

export type Mode = "cases" | "deaths" | "recovered";
export type ModeOrAll = Mode | "all";

export type GlobalHistoricalData = {
    [key in Mode]: Timeline;
};

export interface CountryHistoricalData {
    country: string;
    provice: string;
    // this follows the same format as the global historical data so it uses the type
    timeline: GlobalHistoricalData;
}
