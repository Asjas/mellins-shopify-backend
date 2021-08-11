export default async function tagContactLensOrder(id: number, updatedTags) {
  const { HOST, GRAPHQL_PREFIX } = process.env;

  const variables = {
    input: {
      id: `gid://shopify/Order/${id}`,
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

  const client = new GraphQLClient(`${HOST}${GRAPHQL_PREFIX}/graphql`);

  const orderData = await client
    .request(UPDATE_ORDER_TAGS_SHOPIFY, variables)
    .then((data) => {
      if (data.userErrors) {
        throw new Error(data.userErrors);
      }

      const { order } = data;

      return order;
    })
    .catch((error) => {
      console.error(error);
    });

  return orderData;
}
