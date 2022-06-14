import * as React from 'react';

import { APIClient, APIGEE_VERSION, APIGEE_PROXY_URL, APIGEE_ORG_NAME } from '@redocly/developer-portal/apigee';
import { QueryClient, QueryClientProvider, setLogger } from 'react-query';

export const APIClientContext = React.createContext<{ apiClient: APIClient | null }>({
  apiClient: null,
});

setLogger({
  log: () => {},
  warn: () => {},
  error: () => {},
});

if (!APIGEE_PROXY_URL) {
  throw new Error('APIGEE_PROXY_URL is not defined.');
}
if (!APIGEE_ORG_NAME) {
  throw new Error('APIGEE_ORG_NAME is not defined.');
}

export default function APIClientProvider(props: {
  children: JSX.Element;
  user: any;
  userIdPJwt: string | null;
}) {
  const { user, userIdPJwt } = props;
  const apiClient = new APIClient({
    apiUrl: APIGEE_PROXY_URL,
    accessToken: userIdPJwt,
    organizationName: APIGEE_ORG_NAME,
    email: user?.email,
    version: APIGEE_VERSION,
  });

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <APIClientContext.Provider value={{ apiClient }}>{props.children}</APIClientContext.Provider>
    </QueryClientProvider>
  );
}
