import get from "./get";
import { musicIdRoutes } from "./_musicId";

export const songsRoutes = [get, ...musicIdRoutes];
