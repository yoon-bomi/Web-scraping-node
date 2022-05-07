import { musicDB } from "../../../lib/auto-scraping";

export class MusicChartRepository {
  getMusicSummary(vendor: string) {
    return musicDB.getData(`/${vendor}/musicSummary`);
  }

  getMusicDetail(vendor: string) {
    return musicDB.getData(`/${vendor}/musicDetail`);
  }
}
