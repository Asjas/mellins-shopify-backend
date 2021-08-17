import { useMemo } from "react";
import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";

let apolloClient;

function createApolloClient() {
  return new ApolloClient({
    ssrMode: typeof window === "undefined",
    link: new HttpLink({
      uri: "http://localhost:4000/shopify/graphql",
      credentials: "same-origin",
    }),
    cache: new InMemoryCache({}),
  });
}

export function initializeApollo(initialState = {}) {
  const APOLLO_CLIENT = apolloClient ?? createApolloClient();

  // If your page has Next.js data fetching methods that use Apollo Client, the initial state
  // gets hydrated here
  if (initialState) {
    // Get existing cache, loaded during client side data fetching
    const existingCache = APOLLO_CLIENT.extract();
    // Restore the cache using the data passed from getStaticProps/getServerSideProps
    // combined with the existing cached data
    APOLLO_CLIENT.cache.restore({ ...existingCache, ...initialState });
  }
  // For SSG and SSR always create a new Apollo Client
  if (typeof window === "undefined") return APOLLO_CLIENT;
  // Create the Apollo Client once in the client
  if (!apolloClient) apolloClient = APOLLO_CLIENT;

  return APOLLO_CLIENT;
}

export function useApollo(initialState = {}) {
  const store = useMemo(() => initializeApollo(initialState), [initialState]);
  return store;
}
