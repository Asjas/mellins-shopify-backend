import Fastify, { FastifyServerOptions } from "fastify";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import FastifyHelmet from "fastify-helmet";
import FastifyCors from "fastify-cors";
import FastifyCookie from "fastify-cookie";
import FastifySession from "fastify-session";
import AutoLoad from "fastify-autoload";
import FastifyNodemailer from "fastify-nodemailer";
import FastifyHealthcheck from "fastify-healthcheck";
import FastifyFavicon from "fastify-favicon";
import ShopifyGraphQLProxy, { ApiVersion } from "fastify-shopify-graphql-proxy";

import type { Config } from "./config";

const __filename = fileURLToPath(import.meta.url); // eslint-disable-line
const __dirname = dirname(__filename); // eslint-disable-line

async function createServer(config: Config) {
  const opts: FastifyServerOptions = {
    logger: {
      level: config.LOG_LEVEL,
      prettyPrint: config.PRETTY_PRINT,
    },
    ...config,
  };

  const server = Fastify(opts);

  await server.register(FastifyCors, {
    origin: "*",
  });

  await server.register(FastifyHelmet, {
    frameguard: false,
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        baseUri: ["'self'"],
        connectSrc: ["'self'", "https:"],
        fontSrc: ["'self'", "https:", "data:"],
        frameAncestors: ["'self'", "https://online-mellins.myshopify.com"],
        imgSrc: ["'self'", "data:"],
        objectSrc: ["'self'"],
        frameSrc: ["'self'"],
        styleSrc: ["'self'", "https:", "'unsafe-inline'"],
        scriptSrc: ["'self'", "'unsafe-eval'"],
        scriptSrcAttr: ["'self'"],
      },
    },
  });

  await server.register(FastifyFavicon);

  await server.register(FastifyHealthcheck);

  // await server.register(import("under-pressure"), {
  //   maxEventLoopDelay: 1000,
  //   maxHeapUsedBytes: 100000000,
  //   maxRssBytes: 100000000,
  //   maxEventLoopUtilization: 0.98,
  // });

  await server.register(FastifyCookie, {
    secret: config.COOKIE_SECRET,
  });

  await server.register(FastifySession, {
    secret: config.SESSION_SECRET,
    cookieName: "mellins-shopify-backend-sess",
    cookie: {
      httpOnly: true,
      secure: config.NODE_ENV === "production",
      sameSite: "Lax",
      maxAge: 1_800_0000,
    },
  });

  await server.register(FastifyNodemailer, {
    host: config.MAIL_HOST,
    port: config.MAIL_PORT,
    secure: false,
    auth: {
      user: config.MAIL_USER,
      pass: config.MAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  // @ts-ignore
  await server.register(ShopifyGraphQLProxy, {
    shop: config.SHOPIFY_HOST,
    password: config.SHOPIFY_ACCESS_TOKEN,
    version: ApiVersion.July21,
    prefix: config.SHOPIFY_GRAPHQL_PREFIX,
  });

  await server.register(AutoLoad, {
    dir: join(__dirname, "plugins"),
    dirNameRoutePrefix: false,
    forceESM: true,
  });

  await server.register(AutoLoad, {
    dir: join(__dirname, "routes"),
    dirNameRoutePrefix: false,
    forceESM: true,
  });

  return server;
}

export default createServer;
