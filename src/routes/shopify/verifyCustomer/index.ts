import { FastifyInstance } from "fastify";

import getCustomerFromShopify from "../../../services/getCustomerFromShopify";
import getCustomerFromAtlasDb from "../../../services/getCustomerFromAtlasDb";
import updateCustomerShopifyTags from "../../../services/updateCustomerShopifyTags";

import { SHOPIFY_TAGS } from "../../../@types/shopify";

interface IBody {
  id: number;
  note: string;
}

export default function customersWebhooks(fastify: FastifyInstance, _opts, done) {
  fastify.post<{ Body: IBody }>("/verifyCustomer", async (request, reply) => {
    const { id } = request.body;

    const customerData = await getCustomerFromShopify(id);

    const isPatient = await getCustomerFromAtlasDb(customerData.id_number);

    if (isPatient && !customerData.tags.includes(SHOPIFY_TAGS.MELLINS_CUSTOMER)) {
      // update customer tag if they are a Mellins patient but not tagged yet
      await updateCustomerShopifyTags(id);

      await reply.send({ verified: SHOPIFY_TAGS.MELLINS_CUSTOMER });

      return;
    }

    await reply.send();
  });

  done();
}
