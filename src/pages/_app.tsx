import { AppProps } from "next/app";
import translations from "@shopify/polaris/locales/en.json";
import { ApolloProvider } from "@apollo/client";
import { AppProvider } from "@shopify/polaris";
import { Provider } from "@shopify/app-bridge-react";
import "@shopify/polaris/dist/styles.css";

import Meta from "../components/Meta";

import { useApollo } from "../lib/apolloClient";

import "../styles/tailwind.css";

function MyApp({ Component, pageProps }: AppProps) {
  const shop = "online-mellins.myshopify.com";
  const host = Buffer.from(`${shop}/admin`).toString("base64");

  const config = {
    apiKey: "b3e0198d258f45dd9be7b3d88f808fa4",
    host,
  };

  const apolloClient = useApollo(pageProps.initialApolloState);

  return (
    <AppProvider i18n={translations}>
      <Provider config={config}>
        <ApolloProvider client={apolloClient}>
          <Meta />
          <Component {...pageProps} />
        </ApolloProvider>
      </Provider>
    </AppProvider>
  );
}

export default MyApp;
