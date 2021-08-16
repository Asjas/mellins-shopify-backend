import { FastifyInstance } from "fastify";

import createOrderHandler from "./createOrder";
import updateOrderHandler from "./updateOrder";
import fullfilledOrderHandler from "./fullfilledOrder";

export default function ordersWebhooks(fastify: FastifyInstance, _opts, done) {
  fastify.route({
    method: "POST",
    url: "/webhooks/orders/create",
    handler: createOrderHandler,
  });

  fastify.route({
    method: "POST",
    url: "/webhooks/orders/update",
    handler: updateOrderHandler,
  });

  fastify.route({
    method: "POST",
    url: "/webhooks/orders/fullfilled",
    handler: fullfilledOrderHandler,
  });

  done();
}
