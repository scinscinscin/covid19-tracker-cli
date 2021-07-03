// extend the locals to have data property
import "express";
import "express-serve-static-core";
import { Mode } from "./schema";
import { CallbackFunction, DashboardSize } from "./types";

interface Locals {
    data?: string;
    callback: CallbackFunction;
}

declare module "express" {
    export interface Response {
        locals: Locals;
    }

    export interface Request {
        params: {
            id: string;
            mode: Mode;
            size: DashboardSize;
        };
    }
}
