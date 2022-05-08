import { musicDB, musicInfo } from "../../../lib/auto-scraping";

export class MusicChartRepository {
  getMusicInfos(vendor: string): musicInfo[] {
    return musicDB.getData(`/${vendor}`);
  }
}
