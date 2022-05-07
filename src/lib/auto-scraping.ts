import axios from "axios";
import * as cheerio from "cheerio";
import { JsonDB } from "node-json-db";
import { Config } from "node-json-db/dist/lib/JsonDBConfig";

export const musicDB = new JsonDB(new Config("musicDB", true, false, "/"));

const getHtml = (url: string) => {
  try {
    return axios.get(url);
  } catch (error) {
    console.error(error);
  }
};

export const autoScraping = async () => {
  const melon = await getHtml("https://www.melon.com/chart/index.htm").then(
    (html) => {
      const $ = cheerio.load(html.data);
      const musicList50 = $("#lst50").toArray();
      const musicList100 = $("#lst100").toArray();

      const musicList = [...musicList50, ...musicList100];

      const result = [];

      musicList.forEach((tr, i) => {
        const ranking = $(tr).find("td:nth-child(2) > div > span.rank").text();
        const name = $(tr)
          .find("td:nth-child(6) > div > div > div.ellipsis.rank01 > span > a")
          .text();
        const singer = $(tr)
          .find("td:nth-child(6) > div > div > div.ellipsis.rank02 > a")
          .text();
        const album = $(tr)
          .find("td:nth-child(7) > div > div > div > a")
          .text();

        result.push({
          id: i,
          ranking,
          name,
          singer,
          album,
        });
      });
      return result;
    }
  );

  const genie = await getHtml("https://www.genie.co.kr/chart/top200").then(
    (html) => {
      const $ = cheerio.load(html.data);
      const musicList = $(
        "#body-content > div.newest-list > div > table > tbody > tr"
      ).toArray();

      const result = [];

      musicList.forEach((tr, i) => {
        const ranking = $(tr).find("td.number").text().split("\n")[0];
        const name = $(tr)
          .find("td.info > a.title.ellipsis")
          .text()
          .replace(/\n/g, "")
          .trim();
        const singer = $(tr).find("td.info > a.artist.ellipsis").text();
        const album = $(tr).find("td.info > a.albumtitle.ellipsis").text();

        result.push({
          id: i,
          ranking,
          name,
          singer,
          album,
        });
      });

      return result;
    }
  );

  const vibe = await getHtml("https://vibe.naver.com/chart/total").then(
    (html) => {
      const $ = cheerio.load(html.data);
      const musicList = $(
        "#content > div.track_section > div:nth-child(2) > div > table > tbody > tr"
      ).toArray();

      console.log(musicList);

      const result = [];

      musicList.forEach((tr, i) => {
        const ranking = $(tr).find("td.rank > span").text();
        const name = $(tr)
          .find("td.song > div.title_badge_wrap > span > a")
          .text();
        const singer = $(tr)
          .find(
            "td.song > div.artist_sub > span:nth-child(1) > span > a > span"
          )
          .text();
        const album = $(tr).find("td.album > a").text();

        result.push({
          id: i,
          ranking,
          name,
          singer,
          album,
        });
      });

      return result;
    }
  );

  musicDB.push("/melon/musicSummary", melon);
  musicDB.push("/genie/musicSummary", genie);
  musicDB.push("/vibe/musicSummary", vibe);
};
