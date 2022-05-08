import { Spec } from "koa-joi-router";
import * as Joi from "@hapi/joi";
import { MusicChartService } from "../../../../services/musicChart/application/service";

const paramsSchema = Joi.object({
  vendor: Joi.string().valid("melon", "genie", "vibe"),
  musicId: Joi.number(),
});

const outputSchema = Joi.object({
  id: Joi.number().required(),
  ranking: Joi.number().required(),
  name: Joi.string().required(),
  singer: Joi.string().required(),
  album: Joi.string().required(),
  publisher: Joi.string().required(),
  agency: Joi.string().required(),
}).required();

export default {
  path: "/:vendor/song/:musicId",
  method: "get",
  validate: {
    params: paramsSchema,
    output: {
      200: {
        body: outputSchema,
      },
    },
  },
  handler: async (ctx) => {
    const { vendor, musicId } = ctx.request.params;

    const musicChartService = new MusicChartService();

    const music = await musicChartService.getMusicDetail(
      vendor,
      Number(musicId)
    );

    ctx.body = music;
  },
} as Spec;
