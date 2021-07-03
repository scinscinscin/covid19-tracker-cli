// main entrypoint for the project
import "colors";
import express from "express";
import morgan from "morgan";
import { mainRouter } from "./routers/mainRouter";
import { notFoundHandler } from "./middlewares/notFoundHandler";
import { userAgentMiddleware } from "./middlewares/userAgentMiddleware";
import { debugMiddleware } from "./middlewares/debugMiddleware";
import { advertisedRoutes } from "./middlewares/advertisedRoutes";
import { dashboardRouter } from "./routers/dashboardRouter";

const port = process.env.PORT ?? 5000;
// create server without x-powered-by or etag
const app = express().disable("x-powered-by").disable("etag");
app.use(morgan("common")); // logging middleware
app.use(debugMiddleware);

// please consult before changing the order of this
app.get("/routes", advertisedRoutes);
app.use("/", dashboardRouter);
app.use("/", mainRouter); // main router for the project
app.use("*", notFoundHandler); // handle non existent routes
app.use(userAgentMiddleware); // convert non terminal requests to html

app.listen(port);
