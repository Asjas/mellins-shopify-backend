/* eslint consistent-return: "off" */

import shopifyClient from "../api/shopifyClient";

import getCustomerFromShopify from "./getCustomerFromShopify";

import config from "../config";

const calculateMetafields = (customer) => {
  const { metafields } = customer;

  if (metafields.edges.length === 0) return null;

  const metafieldObject = metafields.edges.reduce((accum, currentValue) => {
    const { id, key, value } = currentValue.node;
    const metafieldData = { id, key, value };

    accum.push(metafieldData);
    return accum;
  }, []);

  return metafieldObject;
};

const calculateCustomerVariables = (metafields, inputData) => {
  const customerVariables = inputData.map((input) => {
    const obj: any = {};

    const metafield = metafields?.filter((field) => {
      if (field.key === input[0]) {
        return field;
      }

      return null;
    });

    if (metafield && metafield[0]?.id) {
      obj.id = metafield[0].id;
    }

    obj.namespace = "MEDICAL_AID";
    obj.type = "single_line_text_field";

    const [key, value] = input;

    obj.key = key;
    obj.value = value;

    return obj;
  });

  return customerVariables;
};

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
    const customer = await getCustomerFromShopify(id);

    console.log({ customer });

    const metafields = calculateMetafields(customer);

    console.log({ metafields });

    const metafieldsVariables = calculateCustomerVariables(metafields, [
      ["Medical Aid", "Discovery"],
      ["MA Number", "123456"],
    ]);

    console.log(metafieldsVariables);

    const variables = {
      input: {
        id: `gid://shopify/Customer/${id}`,
        firstName: first_name,
        lastName: last_name,
        email,
        note: id_number,
        metafields: metafieldsVariables,
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

    console.log("parsedData", JSON.stringify(parsedData));

    return parsedData.data.customerUpdate;
  } catch (err) {
    console.error(err);
  }
}
