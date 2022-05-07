import * as Router from "koa-joi-router";
import { musicChartRoutes } from "./music-chart";

export const router = Router();

router.route([...musicChartRoutes]);
