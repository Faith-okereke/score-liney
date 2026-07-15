import type { FastifyPluginAsync } from "fastify";
import { txlineModule } from "../modules/txline/index.js";

export const authRoutes: FastifyPluginAsync = async (app) => {
  await app.register(txlineModule);
};
