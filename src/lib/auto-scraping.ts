import { JsonDB } from "node-json-db";
import * as Sentry from "@sentry/node";
import { Config } from "node-json-db/dist/lib/JsonDBConfig";
import { Builder, By, Key, until } from "selenium-webdriver";

export type musicInfo = {
  id: number;
  musicSummary: {
    ranking: number;
    name: string;
    singer: string;
    album: string;
  };
  musicDetail: {
    publisher: string;
    agency: string;
  };
};

export const musicDB = new JsonDB(new Config("musicDB", true, false, "/"));

export const autoScraping = async () => {
  const melon = async () => {
    const driver = await new Builder().forBrowser("chrome").build();

    try {
      await driver.get("https://www.melon.com/chart/index.htm");

      const musicList = await driver.findElements(
        By.css("#frm > div > table > tbody > tr")
      );

      const selectors = [
        "td:nth-child(2) > div > span.rank",
        "td:nth-child(6) > div > div > div.ellipsis.rank01 > span > a",
        "td:nth-child(6) > div > div > div.ellipsis.rank02 > a",
        "td:nth-child(7) > div > div > div > a",
        "#conts > div.section_info > div > div.entry > div.meta > dl > dd:nth-child(6)",
        "#conts > div.section_info > div > div.entry > div.meta > dl > dd:nth-child(8)",
      ];

      const result: musicInfo[] = [];

      for (const music of musicList) {
        const rankingElement = await music.findElement(By.css(selectors[0]));
        const ranking = await rankingElement.getText();

        const nameElement = await music.findElement(By.css(selectors[1]));
        const name = await nameElement.getText();

        const singerElement = await music.findElement(By.css(selectors[2]));
        const singer = await singerElement.getText();

        const albumElement = await music.findElement(By.css(selectors[3]));
        const album = await albumElement.getText();

        await albumElement.click();

        const publisherElement = await driver.findElement(By.css(selectors[4]));
        const publisher = await publisherElement.getText();

        const agencyElement = await driver.findElement(By.css(selectors[5]));
        const agency = await agencyElement.getText();

        await result.push({
          id: Number(ranking) - 1,
          musicSummary: {
            ranking: Number(ranking),
            name,
            singer,
            album,
          },
          musicDetail: {
            publisher,
            agency,
          },
        });

        await driver.navigate().back();

        await driver.sleep(3000);
      }

      return result;
    } catch (err) {
      console.log(err);
      Sentry.captureException(err);
    } finally {
      driver.quit();
    }
  };

  const genie = async () => {
    const driver = await new Builder().forBrowser("chrome").build();

    try {
      await driver.get("https://www.genie.co.kr/chart/top200");

      const musicList = await driver.findElements(
        By.css("#body-content > div.newest-list > div > table > tbody > tr")
      );

      const selectors = [
        "td.number",
        "td.info > a.title.ellipsis",
        "td.info > a.artist.ellipsis",
        "td.info > a.albumtitle.ellipsis",
        "#body-content > div.album-detail-infos > div.info-zone > ul > li:nth-child(3) > span.value",
        "#body-content > div.album-detail-infos > div.info-zone > ul > li:nth-child(4) > span.value",
      ];

      const musics = [...Array(musicList.length)].map((e, i) => i);

      const result: musicInfo[] = [];

      for (const i of musics) {
        const musics = await driver.findElements(
          By.css("#body-content > div.newest-list > div > table > tbody > tr")
        );

        const music = await musics[i];

        await driver.wait(until.elementIsEnabled(await music), 10000);

        const rankingElement = await music.findElement(By.css(selectors[0]));
        const ranking = await rankingElement.getText();

        const nameElement = await music.findElement(By.css(selectors[1]));
        const name = await nameElement.getText();

        const singerElement = await music.findElement(By.css(selectors[2]));
        const singer = await singerElement.getText();

        const albumElement = await music.findElement(By.css(selectors[3]));
        const album = await albumElement.getText();

        await albumElement.sendKeys(Key.ENTER);

        const publisherElement = await driver.findElement(By.css(selectors[4]));
        const publisher = await publisherElement.getText();

        const agencyElement = await driver.findElement(By.css(selectors[5]));
        const agency = await agencyElement.getText();

        await result.push({
          id: i,
          musicSummary: {
            ranking: Number(ranking.split("\n")[0]),
            name,
            singer,
            album,
          },
          musicDetail: {
            publisher,
            agency,
          },
        });

        await driver.navigate().back();

        await driver.sleep(3000);
      }

      return result;
    } catch (err) {
      console.log(err);
      Sentry.captureException(err);
    } finally {
      driver.quit();
    }
  };

  const vibe = async () => {
    const driver = await new Builder().forBrowser("chrome").build();

    await driver
      .manage()
      .window()
      .setRect({ x: 0, y: 0, width: 1500, height: 800 });

    try {
      await driver.get("https://vibe.naver.com/chart/total");

      await driver.wait(
        until.elementLocated(
          By.css(`#app > div.modal > div > div > a.btn_close`)
        ),
        20000
      );
      const closetButton = await driver.findElement(
        By.css(`#app > div.modal > div > div > a.btn_close`)
      );
      await driver.wait(until.elementIsEnabled(closetButton), 20000);
      await closetButton.click();

      await driver.wait(
        until.elementLocated(
          By.css(
            "#content > div.track_section > div:nth-child(2) > div > table > tbody"
          )
        ),
        10000
      );

      const musicList = await driver.findElements(
        By.css(
          "#content > div.track_section > div:nth-child(2) > div > table > tbody > tr"
        )
      );

      const selectors = [
        "td.rank > span",
        "td.song > div.title_badge_wrap > span > a",
        "td.artist > span > span > span > a > span",
        "td.album > a",
        "#app > div.modal > div > div > div.ly_contents > div > table > tbody > tr:nth-child(1) > td",
        "#app > div.modal > div > div > div.ly_contents > div > table > tbody > tr:nth-child(2) > td",
      ];

      const musics = [...Array(musicList.length)].map((e, i) => i);

      const result: musicInfo[] = [];

      for (const i of musics) {
        const musics = await driver.findElements(
          By.css(
            "#content > div.track_section > div:nth-child(2) > div > table > tbody > tr"
          )
        );

        const music = await musics[i];

        await driver.wait(until.elementIsEnabled(await music), 10000);

        const rankingElement = await music.findElement(By.css(selectors[0]));
        const ranking = await rankingElement.getText();

        const nameElement = await music.findElement(By.css(selectors[1]));
        const name = await nameElement.getText();

        const singerElement = await music.findElement(By.css(selectors[2]));
        const singer = await singerElement.getText();

        const albumElement = await music.findElement(By.css(selectors[3]));
        const album = await albumElement.getText();

        await driver.executeScript(
          "arguments[0].scrollIntoView()",
          albumElement
        );

        await albumElement.sendKeys(Key.ENTER);

        console.log(name);

        let publisher = "unknown";
        let agency = "unknown";

        try {
          await driver.wait(
            until.elementLocated(
              By.css(
                "#content > div:nth-child(1) > div.summary_section > div.summary > div.option_area > div > div.more_option > div > a"
              )
            ),
            10000
          );

          const moreButton = await driver.findElement(
            By.css(
              "#content > div:nth-child(1) > div.summary_section > div.summary > div.text_area > div.info > div > a"
            )
          );

          await driver.sleep(1500);

          if (await moreButton.isDisplayed()) {
            await driver.wait(until.elementIsVisible(await moreButton), 10000);

            await moreButton.sendKeys(Key.ENTER);

            const publisherElement = await driver.findElement(
              By.css(selectors[4])
            );
            publisher = await publisherElement.getText();

            const agencyElement = await driver.findElement(
              By.css(selectors[4])
            );
            agency = await agencyElement.getText();

            const closeButton = await driver.findElement(
              By.css("#app > div.modal > div > div > a")
            );

            await closeButton.sendKeys(Key.ENTER);
          }
        } catch (NoSuchElementException) {
          console.log(`There is no More button - ${name}`);
        } finally {
          await result.push({
            id: i,
            musicSummary: {
              ranking: Number(ranking.split("\n")[0]),
              name,
              singer,
              album,
            },
            musicDetail: {
              publisher,
              agency,
            },
          });

          await driver.navigate().back();

          await driver.sleep(3000);
        }
      }

      return result;
    } catch (err) {
      console.log(err);
      Sentry.captureException(err);
    } finally {
      // driver.quit();
    }
  };

  // const melonList = await melon();
  // const genieList = await genie();
  const vibeList = await vibe();

  // musicDB.push("/melon", melonList);
  // musicDB.push("/genie", genieList);
  musicDB.push("/vibe", vibeList);
};
