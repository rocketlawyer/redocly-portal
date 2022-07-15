import * as React from 'react';

import { useMutation, useQuery, useQueryClient } from 'react-query';
import { navigate, Router, useParams } from '@reach/router';
import { Divider, Container, Button, Box, Alert, CircularProgress, AppBar, Toolbar, Typography } from '@mui/material';
import { Cancel, Save, Restore, Delete } from '@mui/icons-material';
import { usePathPrefix } from '@redocly/developer-portal/ui';

import { APIClientContext } from '../../services/APIClientProvider';
import { ApiProduct, ApiProductRef, App, Attributes, Credential, CredentialStatus } from '../../services/apigee-api-types';
import { getAppAttribute, getAppDisplayName, getEnabledApiProduct, withPathPrefix } from '../../services/helpers';
import { QUERY_KEY_APP, QUERY_KEY_APPS, QUERY_KEY_PRODUCTS } from '../../services/config';
import ProtectedRoute from '../ProtectedRoute';
import AppOverview from '../../components/AppOverview';
import AppOwner from '../../components/AppOwner';
import AppApisSelection from '../../components/AppApisSelection';
import ApiKeys from './components/ApiKeys';
import ConfirmAppDeletionDialog from './components/DeleteAppDialog';

export function AppPage(_props: { path?: string }) {
  const pathPrefix = usePathPrefix();
  return (
    <Router basepath={withPathPrefix('apps', pathPrefix)}>
      <ProtectedRoute path={'/:appName'} component={<AppPageInternal />} />
    </Router>
  );
}

function AppPageInternal(_props: { path?: string }) {
  const params = useParams();
  const { apiClient } = React.useContext(APIClientContext);

  const queryClient = useQueryClient();

  // Load App
  const setValues = (data: App) => {
    setName(getAppAttribute(data?.attributes, Attributes.displayName) || data.name || '');
    setAppId(data.appId || '');
    setAppData(data);
    setDescription(getAppAttribute(data?.attributes, Attributes.description) || '');
    setEnabledApis(getApiProductsFromCredentials(data.credentials));
    setCredentials(data?.credentials || []);

    const appOwner = getAppAttribute(data?.attributes, Attributes.owner);
    setAppOwner(appOwner === apiClient?.email ? `Me(${apiClient!.email})` : appOwner);
  }

  const { isLoading, error, refetch: refechAppData } = useQuery<any, Error, App>(QUERY_KEY_APP, () =>
    apiClient?.getDeveloperApp(params.appName),
    {
      onSuccess: setValues
    }
  );

  // Overview
  const [name, setName] = React.useState('');
  const [appData, setAppData] = React.useState({} as App);
  const [description, setDescription] = React.useState('');
  const [appId, setAppId] = React.useState('');
  const [credentials, setCredentials] = React.useState([]as Credential[]);
  const [inputTouched, setInputTouched] = React.useState(false);
  const nameIsValid = /^[a-z][a-z0-9._\-$%#\s]*$/gi.test(name);
  const nameIsTooLong = name.length >= 100;

  const handleChangeName = (appName: string) => {
    setName(appName);
    setInputTouched(true);
  };

  const handleChangeDescription = (appDescription: string) => {
    setDescription(appDescription);
  };

  // Owner
  const [appOwner, setAppOwner] = React.useState('');

  // APIs Keys

  const { mutateAsync: revokeApi, isLoading: isLoadingApiRevoke } = useMutation(
    (credential: Credential) => apiClient!.revokeCredential(appData.name, credential),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(QUERY_KEY_APP);
      }
    }
  );

  const { mutateAsync: addApiKey, isLoading: isLoadingAddApiKey } = useMutation(
    () => apiClient!.createDeveloperAppKey(appData.name, getEnabledApiProduct(enabledApis), appData.attributes),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(QUERY_KEY_APP);
      }
    }
  );

  const { mutateAsync: updateApiKey, isLoading: isLoadingUpdateApiKey } = useMutation(
    (credential: Credential) => apiClient!.updateCredential(appData.name, credential.consumerKey, getEnabledApiProduct(enabledApis), appData.attributes),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(QUERY_KEY_APP);
      },
    }
  );

  const handleApiRevoke = (credential: Credential) => {
    revokeApi(credential);
  }

  const handleAddApiKey = () => {
    addApiKey();
  }

  // Enabled APIs product
  const [enabledApis, setEnabledApis] = React.useState<ApiProductRef[]>([]);

  const { data: apiProductData, isLoading: isLoadingApiProducts, error: apiProductsError, } = useQuery<any, Error, { apiProduct: ApiProduct[] }>(
    QUERY_KEY_PRODUCTS,
    () => apiClient?.getApiProducts()
  );

  const getApiProductsFromCredentials = (credentials = appData.credentials) => {
    const approvedCredential = credentials?.find((credential: Credential) => credential.status === CredentialStatus.APPROVED);
    return approvedCredential?.apiProducts || [];
  }

  const handleApisChange = (apis: ApiProductRef[]) => {
    setEnabledApis(apis || []);
  };

  // Page
  const { mutateAsync: saveAppAsync, isLoading: isLoadingResult, error: resultError } = useMutation(
    () => apiClient!.updateCustomDeveloperApp(appData.name, description, appOwner, getEnabledApiProduct(enabledApis)),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(QUERY_KEY_APPS);
      }
    }
  );

  const { mutateAsync: deleteAppAsync, isLoading: isDeleting, error: errorOnDeletion } = useMutation(
    () => apiClient!.deleteDeveloperApp(appData.name),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(QUERY_KEY_APPS);
      }
    }
  );

  const handleSave = async () => {
    appData.credentials.forEach(async (credential) => {
      await updateApiKey(credential);
    });
    await saveAppAsync();
    navigate('../apps');
  };

  const handleCancel = () => {
    navigate('../apps');
  };

  const handleDelete = async () => {

    await deleteAppAsync();
    navigate('../apps');
  }

  const handleReset = () => {
    setValues(appData);
  };

  const canReset = () => {
    return getAppAttribute(appData?.attributes, Attributes.displayName) !== name;
  }

  return (
    <Box>
      <AppBar position="static">
        <Toolbar>
          <Container maxWidth="xl">
            <Typography variant="h5" component="div" sx={{ flexGrow: 1 }}>
              {getAppDisplayName(appData.attributes) || appData.name}
            </Typography>
          </Container>
        </Toolbar>
      </AppBar>
      <Container maxWidth="xl">
        {!isLoading && !isDeleting ? (
          <Box>
            <AppOverview
              appName={name}
              appDescription={description}
              appId={appId}
              nameTouched={inputTouched}
              nameIsValid={nameIsValid}
              nameIsTooLong={nameIsTooLong}
              handleChangeName={handleChangeName}
              handleChangeDescription={handleChangeDescription}
            ></AppOverview>
            <Divider />
            <AppOwner
              appOwner={appOwner}
            />
            <Divider />
            <ApiKeys
              credentials={credentials || []}
              appId={appId}
              isLoadingApiRevoke={isLoadingApiRevoke}
              handleApiRevoke={handleApiRevoke}
              addApiKey={handleAddApiKey}
              isLoadingAddApiKey={isLoadingAddApiKey}
            />
            <Divider />
            <AppApisSelection
              isLoading={isLoadingApiProducts}
              enabledApis={enabledApis}
              handleApisChange={handleApisChange}
              error={apiProductsError}
              apiProducts={apiProductData?.apiProduct || []}
            />
            {error &&
              <Alert severity="error">
                {(error as Error).message}
              </Alert>}
            {error &&
              <Alert severity="error">
                {(error as Error).message}
              </Alert>
            }
            <Box sx={{ justifyContent: 'flex-end', display: 'flex', mt: 2 }}>
              <Button
                color="primary"
                onClick={handleCancel}
              >
                <Cancel sx={{ mr: 1 }} /> Cancel
              </Button>
              <ConfirmAppDeletionDialog
                onConfirmation={handleDelete}
                isLoadingAppDeletion={isDeleting}/>
              <Button
                color="primary"
                disabled={!canReset()}
                onClick={handleReset}
              >
                <Restore sx={{ mr: 1 }} /> Reset
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSave}
                sx={{ ml: 2 }}
                disabled={isLoadingResult || !nameIsValid}
              >
                {(isLoadingResult || isLoadingUpdateApiKey) && <CircularProgress size={18} />}
                <Save sx={{ mr: 1 }} /> Save
              </Button>
            </Box>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <CircularProgress size={50} />
          </Box>
        )}
      </Container>
    </Box>
  );
}
