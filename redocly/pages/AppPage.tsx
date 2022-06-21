import * as React from 'react';

import { Divider, Container, Button, Box, Alert } from '@mui/material';
import { Cancel, Save, Restore, Delete } from '@mui/icons-material';
import { navigate, Router, useParams } from '@reach/router';
import { usePathPrefix } from '@redocly/developer-portal/ui';
import CircularProgress from '../components/common-elements/CircularProgress';
import { APIClientContext } from '../services/APIClientProvider';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { QUERY_KEY_APP, QUERY_KEY_APPS, QUERY_KEY_PRODUCTS } from '../services/config';
import ProtectedRoute from './ProtectedRoute';
import AppOverview from '../components/app-form/Overview';
import AppOwner from '../components/app-form/Owner';
import AppApisSelection from '../components/app-form/ApisSelection';
import { App, Attribute } from '../services/apigee-api-types';
import ApiKeys from '../components/app-form/ApiKeys';

export function AppPage(_props: { path?: string }) {
  const pathPrefix = usePathPrefix();
  return (
    <Router basepath={`app/${pathPrefix}`}>
      <ProtectedRoute path={'/:appName'} component={<AppPageInternal />} />
    </Router>
  );
}

function AppPageInternal(_props: { path?: string }) {
  const params = useParams();
  const { apiClient } = React.useContext(APIClientContext);

  const queryClient = useQueryClient();

  const getAppDisplayName = (attributes?: Attribute[]) => {
    return attributes?.find(attr => attr?.name === 'DisplayName')?.value;
  }

  // Load App
  const setValues = (data: App) => {
    setName(getAppDisplayName(data?.attributes) || data.name || '');
    setAppId(data.appId);
    setAppData(data);
  }

  const { isLoading, error } = useQuery<any, Error, App>(QUERY_KEY_APP, () =>
    apiClient?.getDeveloperApp(params.appName),
    {
      onSuccess: setValues
    }
  );

  const { isLoading: isLoadingApiProducts, error: apiProductsError, data: apiProducts } = useQuery<any, Error, App>(QUERY_KEY_PRODUCTS, () =>
    apiClient?.getApiProducts(),
  );

  // Overview
  const [name, setName] = React.useState('');
  const [appData, setAppData] = React.useState({} as App);
  const [description, setDescription] = React.useState('');
  const [appId, setAppId] = React.useState('');
  const [inputTouched, setInputTouched] = React.useState(false);
  const nameIsValid = /^[a-z][a-z0-9._\-$%#\s]*$/gi.test(name);
  const nameIsTooLong = name.length >= 100;

  const { mutateAsync, isLoading: isLoadingResult, error: resultError } = useMutation(
    () => apiClient!.renameDeveloperApp(appData.name, name),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(QUERY_KEY_APPS);
      }
    }
  );

  const handleChangeName = (appName: string) => {
    setName(appName);
    setInputTouched(true);
  };

  const handleChangeDescription = (appDescription: string) => {
    setDescription(appDescription);
  };

  // Owner
  const appOwner = `Me(${apiClient.email})`;

  // APIs Keys
  const [enabledApis, setEnabledApis] = React.useState<string[]>([]);

  const { mutateAsync: revokeApi, isLoading: isLoadingApiRevoke } = useMutation(
    (consumerKey: string) => apiClient!.deleteDeveloperAppKey(appData.name, consumerKey)
  );

  const handleApiRevoke = (consumerKey: string) => {
    revokeApi(consumerKey);
  }

  const handleAddApiKey = () => {
    addApiKey();
  }

  // Enabled APIs
  const { mutateAsync: addApiKey, isLoading: isLoadingAddApiKey } = useMutation(
    () => apiClient!.createDeveloperAppKey(appData.name, getApiProductsName(), [])
  );

  const getApiProductsName = () => {
    return appData.credentials[0] ? appData.credentials[0].apiProducts.reduce((currList, currValue) => {
      currList.push(currValue.apiproduct);
      return currList;
    }, []) : [];
  }

  const handleApisChange = (apis: string[]) => {
    setEnabledApis(apis || []);
  };

  // Page
  const handleSave = async () => {
    mutateAsync();
  };

  const handleCancel = () => {
    navigate('/apps/');
  };

  const handleDelete = () => {
    //delete
  }

  const handleReset = () => {
    setValues(appData);
  };

  const canReset = () => {
    return getAppDisplayName(appData.attributes) !== name;
  }

  return (
    <Box>
      <Container maxWidth="xl">
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
            credentials={appData?.credentials || []}
            appId={appId}
            isLoadingApiRevoke={isLoadingApiRevoke}
            handleApiRevoke={handleApiRevoke}
          />
          <Button
            color="primary"
            variant="contained"
            sx={{ mb: 2 }}
            onClick={handleAddApiKey}
          >
            Add Key
          </Button>
          <Divider />
          <AppApisSelection
            isLoading={isLoadingApiProducts}
            enabledApis={enabledApis}
            handleApisChange={handleApisChange}
            error={apiProductsError}
            data={apiProducts}
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
            <Button
              color="primary"
              onClick={handleDelete}
            >
              <Delete sx={{ mr: 1 }} /> Delete
            </Button>
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
              {isLoadingResult && <CircularProgress size={18} />}
              <Save sx={{ mr: 1 }} /> Save
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
