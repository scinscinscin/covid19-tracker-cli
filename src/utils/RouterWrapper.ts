import { Router } from "express";
import handleAsync, { AsyncFn } from "./handleAsync";

export interface RouterWrapperOptions {
    addQuiet: boolean; // whether to add the quiet versions or not
    onlyPrefixPrepended: boolean; // whether to add the standard strings themselves
}

/**
 * Wraps a router to make registering routes easier
 */
export class RouterWrapper {
    constructor(
        public router: Router,
        public prefixes: string[],
        public options: RouterWrapperOptions
    ) {}

    /**
     * register routes
     * @param path path to that route
     * @param asyncFn callback
     */
    register = (path: string, asyncFn: AsyncFn): void => {
        let routes: string[] = [];

        // add the base string to routes
        if (this.options.onlyPrefixPrepended === false) routes.push(path);
        this.prefixes.forEach((prefix) => routes.unshift(prefix + path));

        // if addQuiet is true then add quiet versions to all the routes
        if (this.options.addQuiet === true)
            routes = routes.map((route) => `/quiet${route}`).concat(routes);

        // console.log(routes);
        this.router.get(routes, handleAsync(asyncFn));
    };
}
