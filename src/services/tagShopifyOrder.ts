/* eslint consistent-return: "off" */

import shopifyClient from "../api/shopifyClient";

import config from "../config";

export default async function tagShopifyOrder(orderId: number, updatedTags) {
  try {
    const variables = {
      input: {
        id: `gid://shopify/Order/${orderId}`,
        tags: updatedTags,
      },
    };

    const UPDATE_ORDER_TAGS_SHOPIFY = `
    mutation UPDATE_ORDER_TAGS_SHOPIFY($input: OrderInput!) {
      orderUpdate(input: $input) {
        order {
          id
          tags
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

    const { body } = await shopifyClient.request({
      method: "POST",
      path: `${config.SHOPIFY_GRAPHQL_PREFIX}/graphql`,
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
      },
      body: JSON.stringify({ query: UPDATE_ORDER_TAGS_SHOPIFY, variables }),
    });

    let data = "";

    for await (const chunk of body) {
      data += chunk;
    }

    const parsedData = JSON.parse(data);

    console.log("customer updated data", parsedData);

    return parsedData;
  } catch (err) {
    console.error(err);
  }
}
