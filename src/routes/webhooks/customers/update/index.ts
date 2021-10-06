import { FastifyInstance } from "fastify";

import getCustomerFromAtlasDb from "../../../../services/getCustomerFromAtlasDb";
import updateCustomerShopifyTags from "../../../../services/updateCustomerShopifyTags";

import { SHOPIFY_TAGS } from "../../../../@types/shopify";

interface IBody {
  id: number;
  note: string;
  tags: string;
}

export default function customersUpdateWebhooks(fastify: FastifyInstance, _opts, done) {
  fastify.post<{ Body: IBody }>("/", async (request, reply) => {
    const { id, note: idNumber, tags } = request.body;

    const tagsArray = tags.split(", ");

    const isTaggedAsMellinsCustomer = tagsArray.includes(SHOPIFY_TAGS.MELLINS_CUSTOMER);

    if (isTaggedAsMellinsCustomer) {
      return reply.status(200).send();
    }

    const isMellinsPatient = await getCustomerFromAtlasDb(idNumber.trim());

    if (isMellinsPatient) {
      await updateCustomerShopifyTags(id);
    }

    // reply to shopify to stop the webhook from spamming
    return reply.status(200).send();
  });

  done();
}
