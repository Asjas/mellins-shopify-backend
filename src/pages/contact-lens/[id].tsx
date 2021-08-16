import { useState, useRef } from "react";
import { Page, Layout, Card } from "@shopify/polaris";
import { useQuery, useMutation, gql } from "@apollo/client";
import { useRouter } from "next/router";

import CustomerOrderCard from "../../components/CustomerOrderCard";
import FormCard from "../../components/FormCard";
import ItemsOrderCard from "../../components/ItemsOrderCard";
import PageLoadingSpinner from "../../components/PageLoadingSpinner";

export const path = "/contact-lens/:id";

const calculateDefaultValues = (data) => {
  const { metafields } = data.order;

  if (metafields.edges.length === 0) return null;

  const metafieldObject = metafields.edges.reduce((accum, currentValue) => {
    const { key, value } = currentValue.node;

    accum[key] = value;

    return accum;
  }, {});

  return metafieldObject;
};

const calculateMetafields = (data) => {
  const { metafields } = data.order;

  if (metafields.edges.length === 0) return null;

  const metafieldObject = metafields.edges.reduce((accum, currentValue) => {
    const { id, key, value } = currentValue.node;
    const metafieldData = { id, key, value };

    accum.push(metafieldData);
    return accum;
  }, []);

  return metafieldObject;
};

const calculateOrderVariables = (metafields, inputData) => {
  const orderVariables = Object.entries(inputData).map((input) => {
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

    obj.namespace = "CONTACT_LENS_ORDER";
    obj.valueType = "STRING";

    const [key, value] = input;

    obj.key = key;
    obj.value = value;

    console.log({ obj });

    return obj;
  });

  return orderVariables;
};

const GET_CONTACT_LENS_ORDER = gql`
  query GET_CONTACT_LENS_ORDER($id: ID!) {
    order(id: $id) {
      id
      name
      customer {
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
      lineItems(first: 15) {
        edges {
          node {
            id
            name
            quantity
            vendor
            customAttributes {
              key
              value
            }
          }
        }
      }
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

const UPDATE_CONTACT_LENS_ORDER = gql`
  mutation UPDATE_CONTACT_LENS_ORDER($input: OrderInput!) {
    orderUpdate(input: $input) {
      order {
        id
        metafields(namespace: "CONTACT_LENS_ORDER", first: 30) {
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

function IndividualContactLensOrder() {
  const router = useRouter();
  const { id } = router.query;

  if (!id) return null;

  const [isDirty, setDirty] = useState(false);
  const [formData, setFormData] = useState({});
  const formSubmitRef = useRef(null);

  const { loading, error, data } = useQuery(GET_CONTACT_LENS_ORDER, {
    variables: { id: `gid://shopify/Order/${id}` },
  });

  const [updateOrder, { loading: mutationLoading, error: mutationError, data: mutationData }] =
    useMutation(UPDATE_CONTACT_LENS_ORDER);

  if (loading) {
    return <PageLoadingSpinner />;
  }

  if (error) return <p>`Error: ${error}`</p>;

  const defaultValues = calculateDefaultValues(data);
  const metafields = calculateMetafields(data);

  const handleFormSubmit = () => {
    const variables = calculateOrderVariables(metafields, formData);

    updateOrder({ variables: { input: { id: `gid://shopify/Order/${id}`, metafields: variables } } });
    if (!mutationLoading) {
      router.push("/");
    }
  };

  const handleAction = () => {
    const event = new MouseEvent("click", { bubbles: true, cancelable: true });
    formSubmitRef.current.dispatchEvent(event);
  };

  return (
    <Page
      fullWidth
      title="Order Approval"
      primaryAction={{ content: "Save", disabled: !isDirty, onAction: handleAction }}
      secondaryActions={[{ content: "Go Back", url: "/" }]}
    >
      <Layout>
        <Layout.Section>
          <Card sectioned>
            <FormCard
              setDirty={setDirty}
              handleFormSubmit={handleFormSubmit}
              setFormData={setFormData}
              formData={formData}
              defaultValues={defaultValues}
              formSubmitRef={formSubmitRef}
            />
          </Card>
        </Layout.Section>
        <Layout.Section secondary>
          <Card sectioned>
            <CustomerOrderCard customer={data.order.customer} />
            <ItemsOrderCard order={data.order} />
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}

export default IndividualContactLensOrder;
