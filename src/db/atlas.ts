import mysql from "mysql";
import { promisify } from "util";

import config from "../config";

function atlasDb() {
  try {
    const connection = mysql.createConnection({
      host: config.MELLINS_DB_HOST,
      user: config.MELLINS_DB_USER,
      password: config.MELLINS_DB_PASS,
      database: config.MELLINS_DB,
    });

    connection.connect();

    const promisifiedQuery = promisify(connection.query).bind(connection);

    return promisifiedQuery;
  } catch (err) {
    console.error(err);
    console.error("this happened at:", new Date());
    return err;
  }
}

export { atlasDb };
