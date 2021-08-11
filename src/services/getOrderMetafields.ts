export default async function getOrderMetafields(id: number) {
  const { HOST, GRAPHQL_PREFIX } = process.env;

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

  const client = new GraphQLClient(`${HOST}${GRAPHQL_PREFIX}/graphql`);

  const orderData = await client
    .request(GET_ORDER_METAFIELDS, variables)
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
