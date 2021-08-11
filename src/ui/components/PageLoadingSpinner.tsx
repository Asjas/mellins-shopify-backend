import { Layout, Spinner } from "@shopify/polaris";

export default function PageLoadingSpinner() {
  return (
    <Layout>
      <Layout.Section>
        <div className="spinner-container">
          <Spinner accessibilityLabel="Loading contact lens orders" size="large" />
        </div>
      </Layout.Section>
    </Layout>
  );
}
