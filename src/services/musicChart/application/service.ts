import { badRequest, lengthRequired } from "@hapi/boom";
import { MusicChartRepository } from "../infrastructure/repository";

export class MusicChartService {
  async getAllList(vendor: string) {
    const musicChartRepository = new MusicChartRepository();
    const musicInfos = await musicChartRepository.getMusicInfos(vendor);

    if (musicInfos.length === 0) {
      throw lengthRequired(`data is empty in ${vendor}`);
    }

    return musicInfos.map((info) => {
      return {
        id: info.id,
        ranking: info.musicSummary.ranking,
        name: info.musicSummary.name,
        singer: info.musicSummary.singer,
        album: info.musicSummary.album,
        publisher: info.musicDetail.publisher,
        agency: info.musicDetail.agency,
      };
    });
  }

  async getList(vendor: string) {
    const musicChartRepository = new MusicChartRepository();
    const musicInfos = await musicChartRepository.getMusicInfos(vendor);

    if (musicInfos.length === 0) {
      throw lengthRequired(`data is empty in ${vendor}`);
    }

    return musicInfos.map((info) => {
      return {
        id: info.id,
        ranking: info.musicSummary.ranking,
        name: info.musicSummary.name,
        singer: info.musicSummary.singer,
        album: info.musicSummary.album,
      };
    });
  }

  async getMusicDetail(vendor: string, musicId: number) {
    const musicChartRepository = new MusicChartRepository();
    const musicInfos = await musicChartRepository.getMusicInfos(vendor);

    const [music] = musicInfos.filter((info) => info.id === musicId);

    if (music === undefined) {
      throw badRequest(`not found (${musicId})`);
    }

    return {
      id: music.id,
      ranking: music.musicSummary.ranking,
      name: music.musicSummary.name,
      singer: music.musicSummary.singer,
      album: music.musicSummary.album,
      publisher: music.musicDetail.publisher,
      agency: music.musicDetail.agency,
    };
  }
}
