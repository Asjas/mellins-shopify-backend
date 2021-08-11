import { useState, useCallback } from "react";
import { Page, Layout, Button, TextField } from "@shopify/polaris";
import { useQuery, useLazyQuery, gql } from "@apollo/client";

import PageLoadingSpinner from "../components/PageLoadingSpinner";
import OrdersTable from "../components/OrdersTable";

const GET_SINGLE_CONTACT_LENS_ORDER = gql`
  query GET_SINGLE_CONTACT_LENS_ORDER($query: String!) {
    orders(first: 1, query: $query) {
      edges {
        cursor
        node {
          id
          name
          createdAt
          customer {
            firstName
            lastName
            addresses {
              province
            }
          }
          metafields(namespace: "CONTACT_LENS_ORDER", first: 20) {
            edges {
              node {
                key
                value
              }
            }
          }
        }
      }
    }
  }
`;

const GET_ALL_CONTACT_LENS_ORDERS = gql`
  query GET_ALL_CONTACT_LENS_ORDERS {
    orders(first: 20, query: "CONTACT_LENSES Unfulfilled", reverse: true) {
      pageInfo {
        hasNextPage
      }
      edges {
        cursor
        node {
          id
          name
          createdAt
          customer {
            firstName
            lastName
            addresses {
              province
            }
          }
          metafields(namespace: "CONTACT_LENS_ORDER", first: 20) {
            edges {
              node {
                key
                value
              }
            }
          }
        }
      }
    }
  }
`;

function Home() {
  const [orderFieldValue, setOrderField] = useState("");
  const { loading, error, data } = useQuery(GET_ALL_CONTACT_LENS_ORDERS);
  const [getOrder, { loading: singleLoading, data: singleData }] = useLazyQuery(GET_SINGLE_CONTACT_LENS_ORDER);

  const handleChange = useCallback((newValue) => setOrderField(newValue), []);

  const GET_ORDER = () => {
    if (orderFieldValue.length !== 0) {
      getOrder({
        variables: {
          query: `name:${orderFieldValue}`,
        },
      });
    }
  };

  if (loading) {
    return <PageLoadingSpinner />;
  }

  if (error) return <p>{error.message}</p>;

  const RenderTable = () => {
    if (singleLoading) {
      return <PageLoadingSpinner />;
    }

    if (singleData) {
      return <OrdersTable tableData={singleData.orders.edges} />;
    }

    if (data) {
      return <OrdersTable tableData={data.orders.edges} />;
    }

    return null;
  };

  return (
    <Page fullWidth>
      <Layout>
        <Layout.Section>
          <h1 className="mt-6 text-3xl font-bold mb-14">Contact Lens Orders</h1>
          <div className="flex mb-8">
            <TextField label="Search single order" placeholder="1158" value={orderFieldValue} onChange={handleChange} />
            <div className="self-end h-12 mb-3 ml-4">
              <Button primary onClick={GET_ORDER}>
                Search
              </Button>
            </div>
          </div>
          <RenderTable />
        </Layout.Section>
      </Layout>
    </Page>
  );
}

export default Home;
