import { useEffect, useState, useCallback } from "react";
import { Page, Layout, TextField, Form, FormLayout, Button } from "@shopify/polaris";
import { useRouter } from "next/router";

import Nav from "../../../components/Nav";

function CustomerMAPage() {
  const router = useRouter();
  const { id } = router.query;

  if (!id) return null;

  const [order, setOrder] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = useCallback(() => {
    setEmail("");
    setOrder("");
  }, []);

  const handleOrderChange = useCallback((value) => setOrder(value), []);

  const handleEmailChange = useCallback((value) => setEmail(value), []);

  return (
    <Page fullWidth>
      <Layout>
        <Layout.Section>
          <header>
            <Nav />
            <h1 className="mt-6 text-3xl font-bold mb-14">Invoices</h1>
          </header>
          <div>
            <Form onSubmit={handleSubmit}>
              <FormLayout>
                <TextField
                  value={order}
                  onChange={handleOrderChange}
                  label="Order number"
                  type="text"
                  placeholder="3456"
                  helpText={<span>This is the Shopify order you want to send an invoice for.</span>}
                />

                <TextField
                  value={email}
                  onChange={handleEmailChange}
                  label="Email address"
                  type="email"
                  placeholder="user@pienaarpartners.co.za"
                  helpText={<span>This is the email that the invoice will be sent to.</span>}
                />

                <Button submit>Send invoice</Button>
              </FormLayout>
            </Form>
          </div>
        </Layout.Section>
      </Layout>
    </Page>
  );
}

export default CustomerMAPage;
