import { useEffect, useState, useCallback } from "react";
import { Page, Layout, Button, TextField } from "@shopify/polaris";
import { useLazyQuery, gql } from "@apollo/client";
import createPersistedState from "use-persisted-state";

import PageLoadingSpinner from "../components/PageLoadingSpinner";
import OrdersTable from "../components/OrdersTable";
import OrdersToggle from "../components/OrdersToggle";
import Nav from "../components/Nav";

const useCounterState = createPersistedState("orders");

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
  query GET_ALL_CONTACT_LENS_ORDERS($first: Int, $last: Int, $query: String!, $before: String, $after: String) {
    orders(first: $first, last: $last, query: $query, reverse: true, before: $before, after: $after) {
      pageInfo {
        hasNextPage
        hasPreviousPage
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

const ALL_CONTACT_LENS_VARIABLES = {
  first: 10,
  last: null,
  query: "CONTACT_LENSES Unfulfilled",
  before: null,
  after: null,
};

function Home() {
  const [orderToggle] = useCounterState();
  const [orderFieldValue, setOrderField] = useState("");
  const [getOrders, { loading: isLoading, error, data }] = useLazyQuery(GET_ALL_CONTACT_LENS_ORDERS, {
    variables: ALL_CONTACT_LENS_VARIABLES,
  });
  const [getOrder, { loading: isSingleLoading, data: singleData }] = useLazyQuery(GET_SINGLE_CONTACT_LENS_ORDER);

  function setNextPageCursor(pageData) {
    ALL_CONTACT_LENS_VARIABLES.before = null;
    ALL_CONTACT_LENS_VARIABLES.after = pageData.orders.edges[9].cursor;
    ALL_CONTACT_LENS_VARIABLES.first = 10;
    ALL_CONTACT_LENS_VARIABLES.last = null;
  }

  function setPreviousPageCursor(pageData) {
    ALL_CONTACT_LENS_VARIABLES.before = pageData.orders.edges[0].cursor;
    ALL_CONTACT_LENS_VARIABLES.after = null;
    ALL_CONTACT_LENS_VARIABLES.first = null;
    ALL_CONTACT_LENS_VARIABLES.last = 10;
  }

  function resetQuery(isAllOrders) {
    if (isAllOrders) {
      ALL_CONTACT_LENS_VARIABLES.first = 10;
      ALL_CONTACT_LENS_VARIABLES.last = null;
      ALL_CONTACT_LENS_VARIABLES.before = null;
      ALL_CONTACT_LENS_VARIABLES.after = null;
      ALL_CONTACT_LENS_VARIABLES.query = "CONTACT_LENSES Unfulfilled";
    } else {
      ALL_CONTACT_LENS_VARIABLES.first = 10;
      ALL_CONTACT_LENS_VARIABLES.last = null;
      ALL_CONTACT_LENS_VARIABLES.before = null;
      ALL_CONTACT_LENS_VARIABLES.after = null;
      ALL_CONTACT_LENS_VARIABLES.query = "CONTACT_LENSES";
    }
  }

  const handleChange = useCallback((newValue) => setOrderField(newValue), []);

  useEffect(() => {
    resetQuery(orderToggle);

    getOrders();
  }, [orderToggle]);

  const GET_ORDER = () => {
    if (orderFieldValue.length !== 0) {
      getOrder({
        variables: {
          query: `name:${orderFieldValue}`,
        },
      });
    }
  };

  if (isLoading) {
    return <PageLoadingSpinner />;
  }

  if (error) return <p>{error.message}</p>;

  function navigatePreviousPage() {
    if (data.orders.edges.length !== 0) {
      setPreviousPageCursor(data);

      getOrders();
    } else {
      resetQuery(orderToggle);

      getOrders();
    }
  }

  function navigateNextPage() {
    setNextPageCursor(data);

    getOrders();
  }

  const RenderTable = () => {
    if (isSingleLoading) {
      return <PageLoadingSpinner />;
    }

    if (singleData) {
      return (
        <OrdersTable
          tableData={singleData.orders.edges}
          hasPreviousPage={false}
          navigatePreviousPage={null}
          hasNextPage={false}
          navigateNextPage={null}
        />
      );
    }

    if (data) {
      return (
        <OrdersTable
          tableData={data.orders.edges}
          hasPreviousPage={data.orders.pageInfo.hasPreviousPage}
          navigatePreviousPage={navigatePreviousPage}
          hasNextPage={data.orders.pageInfo.hasNextPage}
          navigateNextPage={navigateNextPage}
        />
      );
    }

    return null;
  };

  return (
    <Page fullWidth>
      <Layout>
        <Layout.Section>
          <header>
            <Nav />
            <h1 className="mt-6 text-3xl font-bold mb-14">Contact Lens Orders</h1>
          </header>
          <div className="flex mb-8">
            <TextField label="Search single order" placeholder="1158" value={orderFieldValue} onChange={handleChange} />
            <div className="self-end h-12 mb-3 ml-4">
              <Button primary onClick={GET_ORDER}>
                Search
              </Button>
            </div>
          </div>
          <OrdersToggle toggleQueryType={resetQuery} getOrders={getOrders} />
          <RenderTable />
        </Layout.Section>
      </Layout>
    </Page>
  );
}

export default Home;
