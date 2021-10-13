import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";

import { createInvoice } from "../../../services/createInvoice";
import getCustomerFromShopify from "../../../services/getCustomerFromShopify";
import getOrderFromShopify from "../../../services/getOrderFromShopify";

import { customerInvoice } from "../../../mjml/customerInvoice";

export default function invoiceWebhooks(fastify: FastifyInstance, _opts, done) {
  fastify.route({
    method: "POST",
    url: "/",
    handler: async (request: FastifyRequest, reply: FastifyReply) => {
      const { email, id: order } = JSON.parse(request.body as any);

      const shopifyOrder = await getOrderFromShopify(order);

      const updatedLineItems = shopifyOrder.lineItems.edges.map((lineItem) => {
        const item = {
          id: lineItem.node.id,
          sku: lineItem.item.sku,
          name: lineItem.node.name,
          quantity: lineItem.node.quantity,
          vendor: lineItem.node.vendor,
          title: lineItem.node.name,
          price: parseFloat(lineItem.node.originalUnitPriceSet.presentmentMoney.amount).toFixed(2),
        };

        if (lineItem.node.customAttributes.length !== 0) {
          const lineItemProperty = lineItem.node.customAttributes[3].value;
          item.title = `${lineItem.node.name}\n${lineItemProperty}`;
        }

        return item;
      });

      const customerId = shopifyOrder.customer.id.replace("gid://shopify/Customer/", "");

      const shopifyCustomer = await getCustomerFromShopify(customerId);

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
          name: `${shopifyOrder.customer.firstName} ${shopifyOrder.customer.lastName}`,
          address: shopifyOrder.customer.addresses[0].address1,
          suburb: shopifyOrder.customer.addresses[0].address2,
          city: shopifyOrder.customer.addresses[0].city,
          state: shopifyOrder.customer.addresses[0].province,
          postal_code: shopifyOrder.customer.addresses[0].zip ?? "",
        },
        items: updatedLineItems,
        subtotal: shopifyOrder.subtotalPriceSet.presentmentMoney.amount,
        discount: shopifyOrder.totalDiscountsSet.presentmentMoney.amount,
        paid: shopifyOrder.totalPriceSet.presentmentMoney.amount,
        invoice_nr: shopifyOrder.name,
      };

      const generatedInvoice = createInvoice(invoice);

      const emailContents = {
        orderId: order,
        orderNumber: shopifyOrder.name,
        firstName: shopifyOrder.customer.firstName,
        lastName: shopifyOrder.customer.lastName,
      };

      const { html } = customerInvoice(emailContents);

      const message = {
        from: '"Mellins i-Style" online@mellins.co.za',
        replyTo: "online@mellins.co.za",
        to: email,
        subject: `Mellins i-Style - Invoice for order ${emailContents.orderNumber}`,
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
        fastify.log.info(`Invoice ${shopifyOrder.name} generated and emailed to ${email}.`);
      });

      return reply
        .status(200)
        .send({ message: `Invoice ${shopifyOrder.name} has been generated and emailed to ${email}.` });
    },
  });

  done();
}
