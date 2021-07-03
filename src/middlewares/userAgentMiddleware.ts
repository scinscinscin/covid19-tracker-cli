import { generateWebDashboard } from "../utils/graphics/generateXterm";
import { Middleware } from "./notFoundHandler";

/**
 *
 * @param userAgent The user agent of the requester
 * @returns true if the user agent matches curl / wget / httpie
 */
export const isTerminal: (userAgent: string | undefined) => boolean = (
    userAgent
) => {
    if (userAgent === undefined) return false;
    if (/curl|wget|httpie/i.test(userAgent)) return true;
    return false;
};

// prettier-ignore
export const userAgentMiddleware: Middleware = (req, res) => {
    let data = res.locals.data ?? "Internal server error"; // set to ise if data is undefined

	// remove any empty lines to save space
	// add padding to the side
	// add newline to the end for terminal
    data = data.split("\n").map(str => `    ` + str).join("\n") + "\n";
    
	const terminal = isTerminal(req.headers["user-agent"]);
    if (terminal === false) data = generateWebDashboard(data); // convert to html if the user is not on terminal
    
	res.send(data).end();
};
