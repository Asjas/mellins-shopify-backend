import { FastifyInstance } from "fastify";

import { getCustomerSchema, updateCustomerSchema } from "./schema";

import getCustomerFromShopify from "../../../services/getCustomerFromShopify";
import getCustomerFromAtlasDb from "../../../services/getCustomerFromAtlasDb";
import updateCustomerShopifyTags from "../../../services/updateCustomerShopifyTags";
import updateCustomerShopifyData from "../../../services/updateCustomerShopifyData";

import { SHOPIFY_TAGS } from "../../../@types/shopify";

interface iQuery {
  id: number;
}

interface ICustomerBody {
  id: number;
  state: {
    first_name: string;
    last_name: string;
    email: string;
    id_number: string;
  };
}

interface IBody {
  id: number;
  note: string;
}

export default function customersWebhooks(fastify: FastifyInstance, _opts, done) {
  fastify.get<{ Querystring: iQuery }>("/shopify/customer", { schema: getCustomerSchema }, async (request, reply) => {
    const { id } = request.query;

    const customerData = await getCustomerFromShopify(id);

    await reply.send(customerData);
  });

  fastify.post<{ Body: ICustomerBody }>(
    "/shopify/customer",
    { schema: updateCustomerSchema },
    async (request, reply) => {
      const {
        id,
        state: { first_name: firstName, last_name: lastName, email, id_number: idNumber },
      } = request.body;

      const updatedCustomer = await updateCustomerShopifyData(id, firstName, lastName, email, idNumber);

      await reply.send(updatedCustomer);
    },
  );

  fastify.post<{ Body: IBody }>("/shopify/verifyCustomer", async (request, reply) => {
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

  fastify.post<{ Body: IBody }>("/webhooks/customers/create", async (request, reply) => {
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
