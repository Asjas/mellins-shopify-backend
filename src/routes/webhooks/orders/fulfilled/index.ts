import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";

import { createInvoice } from "../../../../services/createInvoice";
import getCustomerFromShopify from "../../../../services/getCustomerFromShopify";

import { customerInvoice } from "../../../../mjml/customerInvoice";

export default function ordersWebhooks(fastify: FastifyInstance, _opts, done) {
  fastify.route({
    method: "POST",
    url: "/",
    handler: async (request: FastifyRequest, reply: FastifyReply) => {
      const { line_items: clLineItems } = request.body as any;

      const updatedLineItems = clLineItems.map((lineItem) => {
        if (lineItem.properties.length !== 0) {
          const lineItemProperty = lineItem.properties[3].value.replace(") \r\n OS (", ")\nOS (");

          lineItem.title = `${lineItem.title}\n${lineItemProperty}`;
        }

        return lineItem;
      });

      const {
        id: orderId,
        customer: { id, first_name: firstName, last_name: lastName, email: emailAddress },
        order_number: orderNumber,
        subtotal_price: subtotalPrice,
        line_items: lineItems,
        total_price: totalPrice,
        total_discounts: totalDiscounts,
        billing_address: { name, address1, address2, city, zip, province },
      } = request.body as any;

      const shopifyCustomer = await getCustomerFromShopify(id);

      console.log("shopifyCustomer", JSON.stringify(shopifyCustomer));

      const shopifyMAFields = {
        medical_aid: shopifyCustomer?.metafields?.edges[0]?.node?.value,
        ma_number: shopifyCustomer?.metafields?.edges[1]?.node?.value,
      };

      const invoice = {
        mellins: {
          name: "Mellins i-Style",
          address: "113 Zastron Street",
          suburb: "Westdene",
          city: "Bloemfontein",
          state: "Free State",
          postal_code: 9301,
        },
        shipping: {
          medical: `${shopifyMAFields.medical_aid ?? "Empty"}, ${shopifyMAFields.ma_number ?? "Empty"}`,
          name,
          address: address1,
          suburb: address2,
          city,
          state: province,
          postal_code: zip,
        },
        items: updatedLineItems,
        subtotal: subtotalPrice,
        discount: totalDiscounts,
        paid: totalPrice,
        invoice_nr: orderNumber,
      };

      console.log("INVOICE", JSON.stringify(invoice));

      const generatedInvoice = createInvoice(invoice);

      const emailContents = {
        orderId,
        orderNumber,
        firstName,
        lastName,
      };

      const { html } = customerInvoice(emailContents);

      const message = {
        from: '"Mellins i-Style" online@mellins.co.za',
        replyTo: "online@mellins.co.za",
        to: emailAddress,
        subject: `Mellins i-Style - Invoice for order #${emailContents.orderNumber}`,
        html,
        attachments: [
          {
            filename: `Invoice-${invoice.invoice_nr}.pdf`,
            content: generatedInvoice,
            contentType: "application/pdf",
          },
        ],
      };

      // @ts-ignore
      fastify.nodemailer.sendMail(message, (err, info) => {
        if (err) throw new Error(err);

        fastify.log.info(info);
        fastify.log.info(`Invoice ${orderNumber} generated and emailed to ${name}.`);
      });

      // reply to shopify to stop the webhook from spamming
      return reply.status(200).send();
    },
  });

  done();
}
