import envSchema from "env-schema";
import S from "fluent-json-schema";

const schema = S.object()
  .prop("NODE_ENV", S.string().default("production"))
  .prop("PORT", S.number().required())
  .prop("LOG_LEVEL", S.string().default("info"))
  .prop("PRETTY_PRINT", S.boolean().default(false))
  .prop("COOKIE_SECRET", S.string())
  .prop("SESSION_SECRET", S.string())
  .prop("SHOPIFY_HOST", S.string())
  .prop("SHOPIFY_ACCESS_TOKEN", S.string())
  .prop("SHOPIFY_GRAPHQL_PREFIX", S.string())
  .prop("MELLINS_DB_HOST", S.string())
  .prop("MELLINS_DB_USER", S.string())
  .prop("MELLINS_DB_PASS", S.string())
  .prop("MELLINS_DB", S.string())
  .prop("MAIL_HOST", S.string())
  .prop("MAIL_PORT", S.number())
  .prop("MAIL_USER", S.string())
  .prop("MAIL_PASS", S.string());

export type Config = {
  logger: boolean;
  NODE_ENV: string;
  PORT: number;
  LOG_LEVEL: string;
  PRETTY_PRINT: boolean;
  COOKIE_SECRET: string;
  SESSION_SECRET: string;
  SHOPIFY_HOST: string;
  SHOPIFY_ACCESS_TOKEN: string;
  SHOPIFY_GRAPHQL_PREFIX: string;
  MELLINS_DB_HOST: string;
  MELLINS_DB_USER: string;
  MELLINS_DB_PASS: string;
  MELLINS_DB: string;
  MAIL_HOST: string;
  MAIL_PORT: number;
  MAIL_USER: string;
  MAIL_PASS: string;
};

const EnvSchema: Config = envSchema({
  schema,
  dotenv: true,
});

export default EnvSchema;
