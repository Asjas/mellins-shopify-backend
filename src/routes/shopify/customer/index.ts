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
  fastify.get<{ Querystring: iQuery }>("/", { schema: getCustomerSchema }, async (request, reply) => {
    const { id } = request.query;

    const customerData = await getCustomerFromShopify(id);

    await reply.send(customerData);
  });

  fastify.post<{ Body: ICustomerBody }>("/", { schema: updateCustomerSchema }, async (request, reply) => {
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

    console.log(updatedCustomer);

    await reply.send(updatedCustomer);
  });

  done();
}
