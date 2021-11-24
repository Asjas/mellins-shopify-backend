import AutoLoad from "fastify-autoload";
import Fastify, { FastifyServerOptions } from "fastify";
import FastifyCookie from "fastify-cookie";
import FastifyCors from "fastify-cors";
import FastifyHealthcheck from "fastify-healthcheck";
import FastifyHelmet from "fastify-helmet";
import FastifyNext from "fastify-nextjs";
import FastifyNodemailer from "fastify-nodemailer";
import FastifySession from "fastify-session";
import ShopifyGraphQLProxy, { ApiVersion } from "fastify-shopify-graphql-proxy";
import ShopifyAuth from "fastify-shopify-auth";
import FastifyStatic from "fastify-static";
import { join } from "path";

import type { Config } from "./config";

async function createServer(config: Config) {
  const opts: FastifyServerOptions = {
    logger: {
      level: config.LOG_LEVEL,
      prettyPrint: config.PRETTY_PRINT,
    },
    ...config,
    pluginTimeout: 50000,
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
        connectSrc: ["'self'", "https:", "http:"],
        fontSrc: ["'self'", "https:", "http:", "data:"],
        frameAncestors: [
          "'self'",
          "https://online-mellins.myshopify.com",
          "http://localhost:4000",
          "http://127.0.0.1:4000",
        ],
        imgSrc: ["'self'", "data:"],
        objectSrc: ["'self'"],
        frameSrc: ["'self'"],
        styleSrc: ["'self'", "https:", "http:", "'unsafe-inline'"],
        scriptSrc: ["'self'", "'unsafe-eval'"],
        scriptSrcAttr: ["'self'"],
      },
    },
  });

  await server.register(FastifyNext, {
    dev: config.NODE_ENV === "development",
  });

  await server.register((fastify, _opts, done) => {
    fastify.next("/");
    fastify.next("/orders/invoice");
    fastify.next("/customers/ma-details");
    fastify.next("/contact-lens/:id");
    fastify.next("/customers/verify/:id");

    done();
  });

  await server.register(FastifyStatic, {
    root: join(__dirname, "/static"),
  });

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

  //@ts-ignore
  await server.register(ShopifyAuth, {
    shop: "online-mellins.myshopify.com",
    host: "https://shopify2.mellins-backend.co.za",
    apiKey: "4241b7cfb7004e0143ba934a4abac7c9",
    secret: "4241b7cfb7004e0143ba934a4abac7c9",
  });

  // @ts-ignore
  await server.register(ShopifyGraphQLProxy, {
    scopes: [
      "read_customers",
      "write_customers",
      "read_order_edits",
      "write_order_edits",
      "read_orders",
      "write_orders",
    ],
    accessMode: "online",
    shop: config.SHOPIFY_HOST,
    password: config.SHOPIFY_ACCESS_TOKEN,
    version: "2021-07",
    prefix: config.SHOPIFY_GRAPHQL_PREFIX,
  });

  await server.register(AutoLoad, {
    dir: join(__dirname, "plugins"),
    dirNameRoutePrefix: false,
  });

  await server.register(AutoLoad, {
    dir: join(__dirname, "routes"),
    dirNameRoutePrefix: true,
  });

  return server;
}

export default createServer;
