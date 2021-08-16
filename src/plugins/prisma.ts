import { PrismaClient } from "@prisma/client";
import fp from "fastify-plugin";
import { FastifyInstance } from "fastify";

const prismaClient = new PrismaClient();

function PrismaPlugin(fastify: FastifyInstance, _opts, done) {
  fastify.decorate("db", prismaClient);

  done();
}

export default fp(PrismaPlugin);
