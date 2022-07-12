import { ApiProductRef, ApiProductRefStatus, Attribute } from './apigee-api-types';

export function getAppDisplayName(attributes?: Attribute[]) {
  return attributes?.find(attr => attr?.name === 'DisplayName')?.value;
}

export function getReadableDate(date: string | number) {
  const localeStringOptions = {
    day: 'numeric' as const,
    month: 'short' as const,
    year: 'numeric' as const,
  };
  return new window.Date(parseInt(date as string, 10)).toLocaleString('en-US', localeStringOptions);
}

export function withPathPrefix(path, pathPrefix) {
  return pathPrefix ? (pathPrefix.startsWith('/') || (pathPrefix = `/${pathPrefix}`),
          pathPrefix.endsWith('/') || (pathPrefix = `${pathPrefix}/`),
          `${pathPrefix}${path}`) : `/${path}`;
}

export const getAppAttribute = (attributes: Attribute[], attrName: string): any => {
  return attributes?.find(attr => attr?.name === attrName)?.value;
}

export const getEnabledApiProduct = (apiProductRefs: ApiProductRef[]) => {
  return apiProductRefs.filter(({ status }) =>
    status !== ApiProductRefStatus.CANCEL_REQUEST &&
    status !== ApiProductRefStatus.DEFAULT &&
    status !== ApiProductRefStatus.REVOKED
  ).map(({apiproduct}) => apiproduct);
}