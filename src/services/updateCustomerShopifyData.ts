/* eslint consistent-return: "off" */

import shopifyClient from "../api/shopifyClient";

import config from "../config";

export default async function updateCustomerShopifyData(id, first_name, last_name, email, id_number) {
  try {
    const variables = {
      input: {
        id: `gid://shopify/Customer/${id}`,
        firstName: first_name,
        lastName: last_name,
        email,
        note: id_number,
      },
    };

    const CUSTOMER_MUTATION = `
    mutation CUSTOMER_MUTATION($input: CustomerInput!) {
      customerUpdate(input: $input) {
        customer {
          first_name: firstName
          last_name: lastName
          email
          id_number: note
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
      body: JSON.stringify({ query: CUSTOMER_MUTATION, variables }),
    });

    let data = "";

    for await (const chunk of body) {
      data += chunk;
    }

    const parsedData = JSON.parse(data);

    console.log("customer updated data", parsedData);

    return parsedData.data.customerUpdate;
  } catch (err) {
    console.error(err);
  }
}
