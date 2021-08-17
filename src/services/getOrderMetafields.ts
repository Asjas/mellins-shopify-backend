/* eslint consistent-return: "off" */

import shopifyClient from "../api/shopifyClient";

import config from "../config";

export default async function getOrderMetafields(id: number) {
  try {
    const variables = {
      id: `gid://shopify/Order/${id}`,
    };

    const GET_ORDER_METAFIELDS = `
      query GET_ORDER_METAFIELDS($id: ID!) {
        order(id: $id) {
          id
          tags
          metafields(namespace: "CONTACT_LENS_ORDER", first: 25) {
            edges {
              node {
                id
                key
                value
              }
            }
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
      body: JSON.stringify({ query: GET_ORDER_METAFIELDS, variables }),
    });

    let data = "";

    for await (const chunk of body) {
      data += chunk;
    }

    const parsedData = JSON.parse(data);

    return parsedData.data.order;
  } catch (err) {
    console.error(err);
  }
}
