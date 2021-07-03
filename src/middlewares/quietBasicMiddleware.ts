import { plainHandler } from "../handlers/plainHandler";
import { regularHandler } from "../handlers/regularHandler";
import { plainPrefixes } from "../routers/mainRouter";
import { Middleware } from "./notFoundHandler";

export const quietBasicMiddleware: Middleware = (req, { locals }, next) => {
    let path = req.path;
    let quiet: boolean = path.startsWith("/quiet");
    if (quiet) path = path.replace("/quiet", "");

    let plain: boolean = false; // assume that it is a regular handler
    plainPrefixes.forEach((prefix) => {
        if (plain) return; // might save some cpu time not having to recheck.
        if (path.startsWith(prefix)) {
            plain = true;
        }
    });

    let curryFunc = plain ? plainHandler : regularHandler; // get the curry function based on the plain status
    locals.callback = curryFunc(quiet); // get the callback function from curryfunc
    next();
};
