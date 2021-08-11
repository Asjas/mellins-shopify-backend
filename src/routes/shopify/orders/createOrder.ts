import { FastifyRequest, FastifyReply } from "fastify";

import { incomingOrder } from "../../../mjml/incomingOrder";
import tagShopifyOrder from "../../../services/tagShopifyOrder";

import { CONTACT_LENS_VENDORS, SHOPIFY_TAGS } from "../../../@types/shopify";

export default async function createOrderHandler(request: FastifyRequest, reply: FastifyReply) {
  const {
    customer: { first_name: firstName, last_name: lastName, tags: customerTags },
    id: orderId,
    order_number: orderNumber,
    line_items: lineItems,
  } = request.body as any;

  const isInternalMellinsOrder = customerTags.includes(SHOPIFY_TAGS.MELLINS_PRACTICE);

  if (isInternalMellinsOrder) {
    await tagShopifyOrder(orderId, SHOPIFY_TAGS.INTERNAL_ORDER);

    // reply with `200` to stop the Shopify webhook from spamming
    return reply.status(200).send();
  }

  const possibleContactLensItems = lineItems.map((item) => {
    if (item.vendor === CONTACT_LENS_VENDORS.ACUVUE || item.vendor === CONTACT_LENS_VENDORS.COOPERVISION) {
      return true;
    }

    return false;
  });

  if (possibleContactLensItems.includes(true)) {
    const updatedTags = [SHOPIFY_TAGS.CONTACT_LENSES, SHOPIFY_TAGS.NEEDS_REVIEW];

    await tagShopifyOrder(orderId, updatedTags);

    const namesOfLineItems = lineItems.map((item) => item.title);

    const emailContents = {
      orderId,
      orderNumber,
      firstName,
      lastName,
      lineItems: namesOfLineItems.join(", "),
    };

    const { html } = incomingOrder(emailContents);

    const message = {
      from: '"Mellins i-Style" online@mellins.co.za',
      replyTo: "online@mellins.co.za",
      to: ["rudinec@mellins.co.za", "bernardinef@mellins.co.za", "ingel@mellins.co.za", "aj@pienaarconsulting.co.za"],
      subject: `Mellins i-Style - Shopify Contact Lens Order #${emailContents.orderNumber}`,
      html,
    };

    this.nodemailer.sendMail(message, (err, info) => {
      if (err) throw new Error(err);

      this.log.info(info);
      this.log.info(
        `Email for order ${emailContents.orderNumber} of customer ${emailContents.firstName} ${emailContents.lastName} was sent to the optoms.`,
      );
    });
  }

  return reply.status(200).send();
}
