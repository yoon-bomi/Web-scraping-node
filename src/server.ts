import "reflect-metadata";
import * as Sentry from "@sentry/node";
import * as Koa from "koa";
import * as cors from "@koa/cors";
import { router } from "./routes";
import { autoScraping } from "./lib/auto-scraping";

function startInterval(callback) {
  let count = 0;
  count++;
  console.log(`run interval, ${count}`);
  callback();
  const intervalId = setInterval(callback, 1000 * 60 * 30);
}

(async () => {
  require("dotenv").config();

  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    tracesSampleRate: 1.0,
  });

  const app = new Koa();

  app.use(cors());
  app.use(router.prefix("/music-chart/").middleware());

  app.listen(3000, () => {
    console.log(`Server running on port ${3000}`);
    startInterval(autoScraping);
  });
})();
