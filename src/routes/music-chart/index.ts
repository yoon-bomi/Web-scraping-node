import { songsRoutes } from "./songs";
import { summaryRoutes } from "./summary";

export const musicChartRoutes = [...songsRoutes, ...summaryRoutes];
