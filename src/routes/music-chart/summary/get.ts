import { Spec } from "koa-joi-router";
import * as Joi from "@hapi/joi";
import { MusicChartService } from "../../../services/musicChart/application/service";

const paramsSchema = Joi.object({
  vendor: Joi.string().valid("melon", "genie", "vibe"),
});

const outputSchema = Joi.array()
  .items(
    Joi.object({
      id: Joi.number().required(),
      ranking: Joi.string().required(),
      name: Joi.string().required(),
      singer: Joi.string().required(),
      album: Joi.string().required(),
    })
  )
  .required();

export default {
  path: "/:vendor/summary",
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
    const { vendor } = ctx.request.params;

    const musicChartService = new MusicChartService();

    const musics = await musicChartService.getList(vendor);

    ctx.body = musics;
  },
} as Spec;
