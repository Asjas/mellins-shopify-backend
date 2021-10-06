import { useState, useCallback } from "react";
import { Page, Layout, TextField, Form, FormLayout, Button } from "@shopify/polaris";
import { gql, useQuery, useMutation } from "@apollo/client";
import { useRouter } from "next/router";

import Nav from "../../components/Nav";
import PageLoadingSpinner from "../../components/PageLoadingSpinner";

const SINGLE_CUSTOMER_QUERY = gql`
  query SINGLE_CUSTOMER_QUERY($id: ID!) {
    customer(id: $id) {
      id
      first_name: firstName
      last_name: lastName
      email
      id_number: note
      tags
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
  }
`;

const UPDATE_CUSTOMER_MUTATION = gql`
  mutation UPDATE_CUSTOMER_MUTATION($input: CustomerInput!) {
    customerUpdate(input: $input) {
      customer {
        id
        first_name: firstName
        last_name: lastName
        email
        id_number: note
        metafields(namespace: "MEDICAL_AID", first: 2) {
          edges {
            node {
              id
              updatedAt
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

function CustomerMAPage() {
  const [medicalAid, setMedicalAid] = useState("");
  const [maNumber, setMANumber] = useState("");
  const router = useRouter();

  const { id } = router.query;

  const {
    loading: isLoading,
    error,
    data,
  } = useQuery(SINGLE_CUSTOMER_QUERY, { variables: { id: `gid://shopify/Customer/${id}` } });

  const [updateCustomer, { loading: isMutationLoading, error: mutationError, data: mutationData }] = useMutation(
    UPDATE_CUSTOMER_MUTATION,
    {
      variables: {
        input: {
          id: `gid://shopify/Customer/${id}`,
          metafields: [
            {
              id: data?.customer?.metafields?.edges[0]?.node?.id,
              namespace: "MEDICAL_AID",
              type: "single_line_text_field",
              key: "Medical Aid",
              value: medicalAid,
            },
            {
              id: data?.customer?.metafields?.edges[1]?.node?.id,
              namespace: "MEDICAL_AID",
              type: "single_line_text_field",
              key: "MA Number",
              value: maNumber,
            },
          ],
        },
      },
    },
  );

  const handleSubmit = useCallback(async () => {
    await updateCustomer();

    setMedicalAid("");
    setMANumber("");
  }, []);

  const handleMedicalAidChange = useCallback((value) => setMedicalAid(value), []);

  const handleMANumberChange = useCallback((value) => setMANumber(value), []);

  if (isLoading) {
    return <PageLoadingSpinner />;
  }

  return (
    <Page fullWidth>
      <Layout>
        <Layout.Section>
          <header>
            <Nav />
            <h1 className="mt-6 mb-6 text-3xl font-bold">Customer Details</h1>
          </header>

          <section>
            <p className="text-lg">First Name: {data?.customer?.first_name}</p>
            <p className="pt-1 text-lg">Last Name: {data?.customer?.last_name}</p>
            <p className="pt-1 text-lg">Email: {data?.customer?.email}</p>
            <p className="pt-1 text-lg">RSA ID: {data?.customer?.id_number}</p>
            <div>
              <p className="pt-1 text-lg">
                Tags:{" "}
                {data?.customer?.tags?.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </p>
            </div>
            <div>
              <p className="pt-1 text-lg">
                Medical Aid:{" "}
                {data?.customer?.metafields?.edges?.map((metafield) => (
                  <span className="mr-4" key={metafield?.node?.id}>
                    {metafield?.node?.value}
                  </span>
                ))}
              </p>
            </div>
          </section>

          <section>
            <hr />
            <h2 className="mt-6 text-2xl font-bold mb-14">Update Customer MA Details</h2>
            <Form onSubmit={handleSubmit}>
              <FormLayout>
                <TextField
                  value={medicalAid}
                  onChange={handleMedicalAidChange}
                  label="Medical Aid Name"
                  type="text"
                  placeholder="Discovery"
                  helpText={<span>This is the Medical Aid you want to set for the patient.</span>}
                />

                <TextField
                  value={maNumber}
                  onChange={handleMANumberChange}
                  label="Medical Aid Number"
                  type="text"
                  placeholder="1284732"
                  helpText={<span>This is the Medical Aid number you want to set for the patient.</span>}
                />

                <Button submit>Update Customer</Button>
              </FormLayout>
            </Form>
          </section>
        </Layout.Section>
      </Layout>
    </Page>
  );
}

export default CustomerMAPage;

export function getServerSideProps(context) {
  return {
    props: {}, // will be passed to the page component as props
  };
}
