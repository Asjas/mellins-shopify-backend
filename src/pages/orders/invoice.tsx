import { useState, useCallback } from "react";
import { useRouter } from "next/router";
import { Page, Layout, TextField, Form, FormLayout, Button } from "@shopify/polaris";

import Nav from "../../components/Nav";

function InvoicePage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

  async function sendInvoice() {
    const { id } = router.query;

    const res = await fetch("/shopify/invoice", {
      method: "POST",
      body: JSON.stringify({
        id,
        email,
      }),
    });

    const data = await res.json();

    setMessage(data.message);
  }

  async function handleSubmit(event) {
    event.preventDefault();

    await sendInvoice();
  }

  const handleEmailChange = useCallback((value) => setEmail(value), []);

  return (
    <Page fullWidth>
      <Layout>
        <Layout.Section>
          <header>
            <Nav />
            <h1 className="mt-6 text-3xl font-bold mb-14">Invoices</h1>
          </header>
          {message ? <h2 className="py-6 text-lg text-green-600">{message}</h2> : null}
          <div>
            <Form onSubmit={handleSubmit}>
              <FormLayout>
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

export default InvoicePage;
