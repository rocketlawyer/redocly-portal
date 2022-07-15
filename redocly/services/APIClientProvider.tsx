import * as React from 'react';

import { APIClient, APIGEE_VERSION, APIGEE_PROXY_URL, APIGEE_ORG_NAME } from '@redocly/developer-portal/apigee';
import { QueryClient, QueryClientProvider, setLogger } from 'react-query';
import { Attribute, Attributes, Credential, CredentialStatus } from './apigee-api-types';

export const APIClientContext = React.createContext<{ apiClient: CustomApiClient | null }>({
  apiClient: null,
});

export class CustomApiClient extends APIClient {
  createCustomDeveloperApp(appName: string, apiProducts: string[], description: string) {
    return this.fetchData(`${this.developerUrl}/apps`, {
      headers: { 'Content-type': 'application/json' },
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
      method: 'POST'
    });
  }
  updateCustomDeveloperApp(name: string, description: string, appOwner: string, apiProducts: string[]) {
    return this.fetchData(`${this.developerUrl}/apps/${name}`, {
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify({
        apiProducts,
        name,
        attributes: [
          { name: Attributes.displayName, value: name },
          { name: Attributes.description, value: description },
          { name: Attributes.owner, value: appOwner },
          { name: Attributes.apiProducts, value: JSON.stringify(apiProducts) },
        ]
      }),
      method: 'PUT'
    });
  }
  updateCredential(appName: string, consumerKey: string, apiProducts: string[], attributes: Attribute[]) {
    return this.fetchData(`${this.developerUrl}/apps/${appName}/keys/${consumerKey}`, {
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify({
        apiProducts,
        attributes
      }),
      method: 'POST' // as described in the documentation: https://apidocs.apigee.com/docs/developer-app-keys/1/routes/organizations/%7Borg_name%7D/developers/%7Bdeveloper_email%7D/apps/%7Bapp_name%7D/keys/%7Bconsumer_key%7D/post
    });
  }
  revokeCredential(appName: string, credential: Credential) {
    const requestData = {
      headers: { 'Content-type': 'application/octet-stream' },
      method: 'POST' // as described in the documentation: https://apidocs.apigee.com/docs/developer-app-keys/1/routes/organizations/%7Borg_name%7D/developers/%7Bdeveloper_email%7D/apps/%7Bapp_name%7D/keys/%7Bconsumer_key%7D/post
    };
    const finalRequest = this.setAuthHeader(requestData);
    return fetch(`${this.developerUrl}/apps/${appName}/keys/${credential.consumerKey}?action=revoke`, finalRequest);
  }
  addApiProduct(appName: string, credential: Credential, apiProduct: string) {
    return this.fetchData(`${this.developerUrl}/apps/${appName}/keys/${credential.consumerKey}/apiproducts/${apiProduct}`, {
      headers: { 'Content-type': 'application/octet-stream' },
      body: JSON.stringify(credential),
      method: 'POST'
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
