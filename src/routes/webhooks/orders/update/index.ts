import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";

import { collectionRequest } from "../../../../mjml/collectionRequest";
import { refundRequest } from "../../../../mjml/refundRequest";
import { ibtRequest } from "../../../../mjml/ibtRequest";
import { voucherRequest } from "../../../../mjml/voucherRequest";

import getOrderMetafields from "../../../../services/getOrderMetafields";
import tagContactLensOrder from "../../../../services/tagContactLensOrder";

import {
  getOptomName,
  getRefundRequested,
  getIBTRequested,
  getVoucherRequested,
  getOrderApproved,
  getOrderStatusReady,
} from "./utils";

import { SHOPIFY_TAGS } from "../../../../@types/shopify";

export default function ordersWebhooks(fastify: FastifyInstance, _opts, done) {
  fastify.route({
    method: "POST",
    url: "/",
    handler: async (request: FastifyRequest, reply: FastifyReply) => {
      const {
        id: orderId,
        customer: { first_name: firstName, last_name: lastName },
        order_number: orderNumber,
      } = request.body as any;

      const optometrists = {
        "Rudine Diedericks": "rudinec@mellins.co.za",
        "Bernardine Flynn": "bernardinef@mellins.co.za",
        "Inge Loubser": "ingel@mellins.co.za",
      };

      const orderMetafieldsData = await getOrderMetafields(orderId);
      const optomName = await getOptomName(orderMetafieldsData);
      const isRefund = await getRefundRequested(orderMetafieldsData);
      const isIBT = await getIBTRequested(orderMetafieldsData);
      const isVoucher = await getVoucherRequested(orderMetafieldsData);
      const isOrderApproved = await getOrderApproved(orderMetafieldsData);
      const isOrderReady = await getOrderStatusReady(orderMetafieldsData);
      const optomEmail = optometrists[optomName];

      console.log("incoming order update webhook triggered");
      console.log(`${firstName} ${lastName}`);
      console.log("orderMetafieldsData", JSON.stringify(orderMetafieldsData.tags));
      console.log({ optomName });
      console.log({ optomEmail });
      console.log({ isIBT });
      console.log({ isRefund });
      console.log({ isVoucher });
      console.log({ isOrderApproved });
      console.log({ isOrderReady });

      if (orderMetafieldsData.tags.includes(SHOPIFY_TAGS.INTERNAL_ORDER)) {
        return reply.status(200).send();
      }

      if (isIBT && !orderMetafieldsData.tags.includes(SHOPIFY_TAGS.IBT_REQUESTED)) {
        const updatedTags = [...orderMetafieldsData.tags, SHOPIFY_TAGS.IBT_REQUESTED];
        await tagContactLensOrder(orderId, updatedTags);

        const emailContents = {
          firstName,
          orderId,
          lastName,
          orderNumber,
        };

        const { html } = ibtRequest(emailContents);

        const message = {
          from: '"Mellins i-Style" online@mellins.co.za',
          replyTo: "online@mellins.co.za",
          to: ["luzanne@pienaarpartners.co.za", optomEmail, "aj@pienaarconsulting.co.za"],
          subject: `Shopify order #${orderNumber} IBT requested.`,
          html,
        };

        // @ts-ignore
        fastify.nodemailer.sendMail(message, (err, info) => {
          if (err) throw new Error(err);

          fastify.log.info(info);
          fastify.log.info(`Contact Lens order #${orderNumber} refund request email emailed to Luzanne.`);
        });
      }

      if (isRefund && !orderMetafieldsData.tags.includes(SHOPIFY_TAGS.REFUND_REQUESTED)) {
        const updatedTags = [...orderMetafieldsData.tags, SHOPIFY_TAGS.REFUND_REQUESTED];
        await tagContactLensOrder(orderId, updatedTags);

        const emailContents = {
          firstName,
          orderId,
          lastName,
          orderNumber,
        };

        const { html } = refundRequest(emailContents);

        const message = {
          from: '"Mellins i-Style" online@mellins.co.za',
          replyTo: "online@mellins.co.za",
          to: ["luzanne@pienaarpartners.co.za", optomEmail, "aj@pienaarconsulting.co.za"],
          subject: `Shopify order #${orderNumber} refund requested.`,
          html,
        };

        // @ts-ignore
        fastify.nodemailer.sendMail(message, (err, info) => {
          if (err) throw new Error(err);

          fastify.log.info(info);
          fastify.log.info(`Contact Lens order #${orderNumber} refund request email emailed to Luzanne.`);
        });
      }

      if (isVoucher && !orderMetafieldsData.tags.includes(SHOPIFY_TAGS.VOUCHER_REQUESTED)) {
        const updatedTags = [...orderMetafieldsData.tags, SHOPIFY_TAGS.VOUCHER_REQUESTED];
        await tagContactLensOrder(orderId, updatedTags);

        const emailContents = {
          firstName,
          orderId,
          lastName,
          orderNumber,
        };

        const { html } = voucherRequest(emailContents);

        const message = {
          from: '"Mellins i-Style" online@mellins.co.za',
          replyTo: "online@mellins.co.za",
          to: ["colette@pienaarpartners.co.za", optomEmail, "aj@pienaarconsulting.co.za"],
          subject: `Shopify order #${orderNumber} voucher requested`,
          html,
        };

        // @ts-ignore
        fastify.nodemailer.sendMail(message, (err, info) => {
          if (err) throw new Error(err);

          fastify.log.info(info);
          fastify.log.info(`Contact Lens order #${orderNumber} voucher request email emailed to Colette.`);
        });
      }

      if (
        isOrderApproved &&
        isOrderReady &&
        !orderMetafieldsData.tags.includes(SHOPIFY_TAGS.APPROVED) &&
        !orderMetafieldsData.tags.includes(SHOPIFY_TAGS.ORDER_READY)
      ) {
        const ibtTag = isRefund ? SHOPIFY_TAGS.IBT_REQUESTED : "";
        const refundTag = isRefund ? SHOPIFY_TAGS.REFUND_REQUESTED : "";
        const voucherTag = isVoucher ? SHOPIFY_TAGS.VOUCHER_REQUESTED : "";

        const updatedTags = [
          SHOPIFY_TAGS.CONTACT_LENSES,
          SHOPIFY_TAGS.APPROVED,
          SHOPIFY_TAGS.ORDER_READY,
          ibtTag,
          refundTag,
          voucherTag,
        ];
        await tagContactLensOrder(orderId, updatedTags);

        const emailContents = {
          firstName,
          orderId,
          lastName,
          orderNumber,
        };

        const { html } = collectionRequest(emailContents);

        const message = {
          from: '"Mellins i-Style" online@mellins.co.za',
          replyTo: "online@mellins.co.za",
          to: ["lauren@pienaarpartners.co.za", optomName, "aj@pienaarconsulting.co.za"],
          subject: `Shopify Contact Lens order #${orderNumber} ready for collection arrangement`,
          html,
        };

        // @ts-ignore
        fastify.nodemailer.sendMail(message, (err, info) => {
          if (err) throw new Error(err);

          fastify.log.info(info);
          fastify.log.info(`Contact Lens order #${orderNumber} collection email emailed to Lauren Rheeder.`);
        });

        return reply.status(200).send();
      }

      if (isOrderApproved && !orderMetafieldsData.tags.includes(SHOPIFY_TAGS.APPROVED)) {
        const ibtTag = isIBT ? SHOPIFY_TAGS.IBT_REQUESTED : "";
        const refundTag = isRefund ? SHOPIFY_TAGS.REFUND_REQUESTED : "";
        const voucherTag = isVoucher ? SHOPIFY_TAGS.VOUCHER_REQUESTED : "";

        const updatedTags = [SHOPIFY_TAGS.CONTACT_LENSES, SHOPIFY_TAGS.APPROVED, ibtTag, refundTag, voucherTag];
        await tagContactLensOrder(orderId, updatedTags);

        return reply.status(200).send();
      }

      // reply to shopify to stop the webhook from spamming
      return reply.status(200).send();
    },
  });

  done();
}
