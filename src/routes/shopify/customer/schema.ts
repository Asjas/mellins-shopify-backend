export const getCustomerSchema = {
  summary: "Get Shopify Customer",
  description: "Get Customer data from Shopify",
  query: {
    id: { type: "string" },
  },
  response: {
    200: {
      type: "object",
      properties: {
        status: {
          type: "string",
        },
        first_name: {
          type: "string",
        },
        last_name: {
          type: "string",
        },
        email: {
          type: "string",
        },
        id_number: {
          type: "string",
        },
        tags: {
          type: "array",
          items: {
            type: "string",
          },
        },
      },
    },
  },
};

export const updateCustomerSchema = {
  summary: "Update Shopify Customer",
  description: "Update Customer data on Shopify",
  body: {
    type: "object",
    properties: {
      id: { type: "string" },
      status: {
        type: "object",
        properties: {
          first_name: {
            type: "string",
          },
          last_name: {
            type: "string",
          },
          email: {
            type: "string",
          },
          id_number: {
            type: "string",
          },
        },
      },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        customer: {
          type: "object",
          properties: {
            status: {
              type: "string",
            },
            first_name: {
              type: "string",
            },
            last_name: {
              type: "string",
            },
            email: {
              type: "string",
            },
            id_number: {
              type: "string",
            },
          },
        },
      },
    },
  },
};
