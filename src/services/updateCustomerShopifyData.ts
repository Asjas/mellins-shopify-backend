/* eslint consistent-return: "off" */

import shopifyClient from "../api/shopifyClient";

import config from "../config";

export default async function updateCustomerShopifyData(
  id,
  first_name,
  last_name,
  email,
  id_number,
  medical_aid,
  ma_number,
) {
  try {
    console.log(id, first_name, last_name, email, id_number, medical_aid, ma_number);
    const variables = {
      input: {
        id: `gid://shopify/Customer/${id}`,
        first_name,
        last_name,
        email,
        note: id_number,
        metafields: [
          {
            namespace: "MEDICAL_AID",
            valueType: "STRING",
            key: "Medical Aid",
            value: medical_aid ?? "",
          },
          {
            namespace: "MEDICAL_AID",
            valueType: "STRING",
            key: "MA Number",
            value: ma_number ?? "",
          },
        ],
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
            metafields(namespace: "MEDICAL_AID", first: 2) {
              edges {
                node {
                  id
                  key
                  value
                }
              }
            }
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

    console.log({ parsedData });

    return parsedData.data.customerUpdate;
  } catch (err) {
    console.error(err);
  }
}
