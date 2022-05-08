import { JsonDB } from "node-json-db";
import { Config } from "node-json-db/dist/lib/JsonDBConfig";
import { Builder, By, until } from "selenium-webdriver";

export const musicDB = new JsonDB(new Config("musicDB", true, false, "/"));

export const autoScraping = async () => {
  const melon = async () => {
    const driver = await new Builder().forBrowser("chrome").build();

    try {
      await driver.get("https://www.melon.com/chart/index.htm");

      const musicList = await driver.findElements(
        By.css("#frm > div > table > tbody > tr")
      );

      const result = await Promise.all(
        musicList.map(async (tr, i) => {
          const ranking = await tr.findElement(
            By.css("td:nth-child(2) > div > span.rank")
          );
          const name = await tr.findElement(
            By.css(
              "td:nth-child(6) > div > div > div.ellipsis.rank01 > span > a"
            )
          );
          const singer = await tr.findElement(
            By.css("td:nth-child(6) > div > div > div.ellipsis.rank02 > a")
          );
          const album = await tr.findElement(
            By.css("td:nth-child(7) > div > div > div > a")
          );

          return {
            id: i,
            ranking: await ranking.getText(),
            name: await name.getText(),
            singer: await singer.getText(),
            album: await album.getText(),
          };
        })
      );

      return result;
    } catch (err) {
      console.log(err);
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

      const result = await Promise.all(
        musicList.map(async (tr, i) => {
          const ranking = await tr.findElement(By.css("td.number"));
          const name = await tr.findElement(
            By.css("td.info > a.title.ellipsis")
          );
          const singer = await tr.findElement(
            By.css("td.info > a.artist.ellipsis")
          );
          const album = await tr.findElement(
            By.css("td.info > a.albumtitle.ellipsis")
          );

          return {
            id: i,
            ranking: await (await ranking.getText()).split("\n")[0],
            name: await name.getText(),
            singer: await singer.getText(),
            album: await album.getText(),
          };
        })
      );

      return result;
    } catch (err) {
      console.log(err);
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
      const closetButton = driver.findElement(
        By.css(`#app > div.modal > div > div > a.btn_close`)
      );
      await driver.wait(until.elementIsEnabled(closetButton), 20000);
      await closetButton.click();

      // css selector로 가져온 element가 위치할때까지 최대 10초간 기다린다.
      await driver.wait(
        until.elementLocated(
          By.css(
            "#content > div.track_section > div:nth-child(2) > div > table > tbody"
          )
        ),
        10000
      );

      const resultElements = await driver.findElements(
        By.css(
          "#content > div.track_section > div:nth-child(2) > div > table > tbody > tr"
        )
      );

      const result = await Promise.all(
        resultElements.map(async (tr, i) => {
          const ranking = await tr.findElement(By.className("rank"));
          const name = await tr.findElement(By.className("inner_cell"));
          const singer = await tr.findElement(By.className("artist"));
          const album = await tr.findElement(By.css("td.album > a"));

          return {
            id: i,
            ranking: (await ranking.getText()).split("\n")[0],
            name: await name.getText(),
            singer: await singer.getText(),
            album: await album.getText(),
          };
        })
      );

      return result;
    } catch (err) {
      console.log(err);
    } finally {
      driver.quit();
    }
  };

  const melonList = await melon();
  const genieList = await genie();
  const vibeList = await vibe();

  musicDB.push("/melon/musicSummary", melonList);
  musicDB.push("/genie/musicSummary", genieList);
  musicDB.push("/vibe/musicSummary", vibeList);
};
