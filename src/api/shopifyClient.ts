import { Client } from "undici";

import config from "../config";

const shopifyClient = new Client(`http://localhost:${config.PORT}`);

export default shopifyClient;
