export enum APIGEE_VERSION {
  edge = 'apigeeedge',
  x = 'apigeex',
}

export interface Attribute {
  name: string;
  value: string;
}

export interface ApiProductRef {
  apiproduct: string;
  status: ApiProductRefStatus;
}

export enum ApiProductRefStatus {
  APPROVED = 'approved',
  PENDING_APPROVAL = 'pending',
  SAVE_TO_ENABLE = 'save-to-enable',
  REQUESTED_ACCESS = 'requested-access',
  DEFAULT = 'defa0ult',
  REVOKED = 'revoked',
  CANCEL_REQUEST = 'cancel-request'
}

export interface Credential {
  apiProducts: ApiProductRef[];
  attributes: Attribute[];
  consumerKey: string;
  consumerSecret: string;
  expiresAt: string;
  issuedAt: string;
  scopes: string[];
  status: 'approved' | 'revoked';
}

export enum CredentialStatus {
  APPROVED = 'approved',
  REVOKED = 'revoked'
}

export interface App {
  appId?: string;
  attributes: Attribute[];
  callbackUrl?: string;
  createdAt: string;
  createdBy: string;
  credentials: Credential[];
  developerId: string;
  lastModifiedAt: string;
  name: string;
  scopes: string[];
  status: string;
  keyExpiresIn: string;
  appFamily: string;
  apiProducts: string[];
}
export interface ApiProduct {
  name: string;
  displayName: string;
  approvalType: 'manual' | 'auto';
  attributes: Attribute[];
  description: string;
  apiResources: string[];
  environments: string[];
  proxies: string[];
  quota: string;
  quotaInterval: string;
  quotaTimeUnit: string;
  scopes: string[];
  createdAt: string;
  lastModifiedAt: string;
}

export enum Attributes {
  description = 'description',
  displayName = 'displayName',
  apiProducts = 'apiProducts',
  owner = 'owner'
}
