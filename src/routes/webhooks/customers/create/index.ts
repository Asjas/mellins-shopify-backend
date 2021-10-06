import { FastifyInstance } from "fastify";

import getCustomerFromAtlasDb from "../../../../services/getCustomerFromAtlasDb";
import updateCustomerShopifyTags from "../../../../services/updateCustomerShopifyTags";

interface IBody {
  id: number;
  note: string;
}

export default function customersCreateWebhooks(fastify: FastifyInstance, _opts, done) {
  fastify.post<{ Body: IBody }>("/", async (request, reply) => {
    const { id, note: idNumber } = request.body;

    const isMellinsPatient = await getCustomerFromAtlasDb(idNumber);

    if (isMellinsPatient) {
      await updateCustomerShopifyTags(id);
    }

    // reply to shopify to stop the webhook from spamming
    await reply.status(200).send();
  });

  done();
}
