import { GlobalHistoricalData, ModeOrAll, Timeline } from "./schema";

export type DashboardSize = "sm" | "md" | "lg";

/**
 * interface whose keys is a string and values are K
 */
export interface ObjectIface<K> {
    [key: string]: K;
}

export interface Metadata {
    updated: number;
    country?: string;
    mode?: ModeOrAll;
}

export type CallbackFunction = (
    metadata: Metadata,
    data: [ObjectIface<number>, ObjectIface<number>],
    historicalData?: Timeline | GlobalHistoricalData
) => Promise<string> | string;

export type CallbackCurry = (
    quiet: boolean,
    size?: DashboardSize
) => CallbackFunction;

export type MainFunction = (
    callback: CallbackFunction,
    data: {
        mode?: ModeOrAll;
        id?: string;
    }
) => Promise<string>;
