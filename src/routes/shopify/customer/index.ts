import { FastifyInstance } from "fastify";

import { getCustomerSchema, updateCustomerSchema } from "./schema";

import getCustomerFromShopify from "../../../services/getCustomerFromShopify";
import updateCustomerShopifyData from "../../../services/updateCustomerShopifyData";

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
    medical_aid: string;
    ma_number: string;
  };
}

export default function customersWebhooks(fastify: FastifyInstance, _opts, done) {
  fastify.get<{ Querystring: iQuery }>("/", async (request, reply) => {
    const { id } = request.query;

    const customerData = await getCustomerFromShopify(id);

    const customerFields = {
      first_name: customerData.first_name,
      last_name: customerData.last_name,
      email: customerData.email,
      id_number: customerData.id_number,
      medical_aid: customerData?.metafields?.edges[0]?.node?.value,
      ma_number: customerData?.metafields?.edges[1]?.node?.value,
      tags: customerData.tags,
    };

    await reply.send(customerFields);
  });

  fastify.post<{ Body: ICustomerBody }>("/", async (request, reply) => {
    const {
      id,
      state: {
        first_name: firstName,
        last_name: lastName,
        email,
        id_number: idNumber,
        medical_aid: medicalAid,
        ma_number: maNumber,
      },
    } = request.body;

    const updatedCustomer = await updateCustomerShopifyData(
      id,
      firstName,
      lastName,
      email,
      idNumber,
      medicalAid,
      maNumber,
    );

    console.log("updatedCustomer", JSON.stringify(updatedCustomer));

    const customerFields = {
      first_name: updatedCustomer.first_name,
      last_name: updatedCustomer.last_name,
      email: updatedCustomer.email,
      id_number: updatedCustomer.id_number,
      medical_aid: updatedCustomer?.metafields?.edges[0]?.node?.value,
      ma_number: updatedCustomer?.metafields?.edges[1]?.node?.value,
      tags: updatedCustomer.tags,
    };

    console.log({ customerFields });

    await reply.send(customerFields);
  });

  done();
}
