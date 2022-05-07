import { Inject } from "typedi";
import { MusicChartRepository } from "../infrastructure/repository";

export class MusicChartService {
  @Inject()
  private musicChartRepository!: MusicChartRepository;

  async getAllList(vendor: string) {
    console.log("test ok");
  }

  async getList(vendor: string) {}

  async getMusicDetail(vendor: string, musicId: number) {
    console.log("test ok");
  }
}
