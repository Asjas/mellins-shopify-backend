/* eslint consistent-return: "off" */

import shopifyClient from "../api/shopifyClient";

import config from "../config";

export default async function getOrderFromShopify(order: number) {
  try {
    const variables = {
      id: `gid://shopify/Order/${order}`,
    };

    const GET_ORDER = `
      query GET_ORDER($id: ID!) {
        order(id: $id) {
          id
          name
          tags
          createdAt
          subtotalPriceSet {
            presentmentMoney {
              amount
            }
          }
          totalPriceSet {
            presentmentMoney {
              amount
            }
          }
          totalDiscountsSet {
            presentmentMoney {
              amount
            }
          }
          customer {
            id
            firstName
            lastName
            email
            idNumber: note
            addresses {
              address1
              address2
              city
              province
              phone
            }
          }
          lineItems(first: 10) {
            edges {
              node {
                id
                name
                sku
                quantity
                vendor
                originalUnitPriceSet {
                  presentmentMoney {
                    amount
                  }
                }
                customAttributes {
                  key
                  value
                }
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
      body: JSON.stringify({ query: GET_ORDER, variables }),
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
