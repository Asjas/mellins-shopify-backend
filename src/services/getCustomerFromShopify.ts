/* eslint consistent-return: "off" */

import shopifyClient from "../api/shopifyClient";

import config from "../config";

export default async function getCustomerFromShopify(id: number) {
  try {
    const variables = {
      id: `gid://shopify/Customer/${id}`,
    };

    const CUSTOMER_QUERY = `
      query CUSTOMER_QUERY($id: ID!) {
        customer(id: $id) {
          first_name: firstName
          last_name: lastName
          email
          id_number: note
          tags
        }
      }
    `;

    const { body } = await shopifyClient.request({
      method: "POST",
      path: `${config.SHOPIFY_GRAPHQL_PREFIX}/graphql`,
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
      },
      body: JSON.stringify({ query: CUSTOMER_QUERY, variables }),
    });

    let data = "";

    for await (const chunk of body) {
      data += chunk;
    }

    const parsedData = JSON.parse(data);

    return parsedData.data.customer;
  } catch (err) {
    console.error(err);
  }
}
