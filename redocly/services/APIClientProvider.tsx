import * as React from 'react';

import { APIClient, APIGEE_VERSION, APIGEE_PROXY_URL, APIGEE_ORG_NAME } from '@redocly/developer-portal/apigee';
import { QueryClient, QueryClientProvider, setLogger } from 'react-query';
import { Attributes } from './apigee-api-types';

export const APIClientContext = React.createContext<{ apiClient: CustomApiClient | null }>({
  apiClient: null,
});

export class CustomApiClient extends APIClient {
  createCustomDeveloperApp(appName: string, apiProducts: string[], description: string) {
    return this.fetchData(`${this.developerUrl}/apps`, {
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({
        name: appName,
        apiProducts,
        attributes: [
          { name: Attributes.displayName, value: appName },
          { name: Attributes.description, value: description },
          { name: Attributes.owner, value: this.email },
          { name: Attributes.apiProducts, value: JSON.stringify(apiProducts) },
        ]
      }),
      method: "POST"
    });
  }
  updateCustomDeveloperApp(appName: string, apiProducts: string[], description: string, appOwner: string) {
    return this.fetchData(`${this.developerUrl}/apps/${appName}`, {
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({
        attributes: [
          { name: Attributes.displayName, value: appName },
          { name: Attributes.description, value: description },
          { name: Attributes.owner, value: appOwner },
          { name: Attributes.apiProducts, value: JSON.stringify(apiProducts) },
        ]
      }),
      method: "PUT"
    });
  }
}

setLogger({
  log: () => { },
  warn: () => { },
  error: () => { },
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
  const apiClient = new CustomApiClient({
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
