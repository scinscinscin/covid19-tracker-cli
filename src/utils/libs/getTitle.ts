const { version } = require("../../../package.json");
// prettier-ignore
export const getTitle = (country = "Global", historical: boolean): string => `COVID-19 Tracker & CLI v${version} - ${country} ${historical ? "Historical Update" : "Update"}`
