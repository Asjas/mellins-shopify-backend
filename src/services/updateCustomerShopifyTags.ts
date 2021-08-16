/* eslint consistent-return: "off" */

import shopifyClient from "../api/shopifyClient";

import config from "../config";
import { SHOPIFY_TAGS } from "../@types/shopify";

async function updateCustomerShopifyTags(id: number) {
  try {
    const updatedCustomerTags = [SHOPIFY_TAGS.MELLINS_CUSTOMER];

    const variables = {
      input: {
        id: `gid://shopify/Customer/${id}`,
        tags: updatedCustomerTags,
      },
    };

    const UPDATE_CUSTOMER_TAGS_SHOPIFY = `
      mutation UPDATE_CUSTOMER_TAGS_SHOPIFY($input: CustomerInput!) {
        customerUpdate(input: $input) {
          customer {
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
      body: JSON.stringify({ query: UPDATE_CUSTOMER_TAGS_SHOPIFY, variables }),
    });

    let data = "";

    for await (const chunk of body) {
      data += chunk;
    }

    const parsedData = JSON.parse(data);

    console.log("customer updated data", parsedData);

    return parsedData;
  } catch (error) {
    console.error(error);
  }
}

export default updateCustomerShopifyTags;
