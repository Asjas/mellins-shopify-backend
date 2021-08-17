import createServer from "./server";
import config from "./config";

async function start() {
  try {
    const PORT = Number(config.PORT) || 3000;
    const app = await createServer(config);

    await app.listen(PORT);
    console.log(app.printRoutes());
  } catch (err) {
    console.error(err);
  }
}

void start();
