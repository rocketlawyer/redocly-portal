import * as React from 'react';

import { Divider, Container, Button, Box, Alert, CircularProgress, AppBar, Toolbar, Typography } from '@mui/material';
import { Cancel, Save, Restore } from '@mui/icons-material';
import { navigate } from '@reach/router';
import { APIClientContext } from '../../services/APIClientProvider';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { QUERY_KEY_APPS, QUERY_KEY_PRODUCTS } from '../../services/config';
import ProtectedRoute from '../ProtectedRoute';
import AppOverview from '../../components/AppOverview';
import AppOwner from '../../components/AppOwner';
import AppApisSelection from '../../components/AppApisSelection';
import { ApiProductRef } from '../../services/apigee-api-types';
import { getEnabledApiProduct } from '../../services/helpers';

export function CreateAppPage() {
  return <ProtectedRoute component={<CreateAppPageInternal />} />;
}

function CreateAppPageInternal() {
  const { apiClient } = React.useContext(APIClientContext);

  const queryClient = useQueryClient();

  // const creatingAppResult = useMutation(() => apiClient!.createCustomDeveloperApp(name, enabledApis, description), {
  const creatingAppResult = useMutation(() => apiClient!.createCustomDeveloperApp(name, getEnabledApiProduct(enabledApis), description), {
    onSuccess: () => {
      queryClient.invalidateQueries(QUERY_KEY_APPS);
    },
  });

  // Overview
  const [name, setName] = React.useState('');
  const [description, setDescription] = React.useState('');
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
  const appOwner = `Me(${apiClient!.email})`;

  // APIs selection
  const [enabledApis, setEnabledApis] = React.useState<ApiProductRef[]>([]);

  const handleApisChange = (apis: ApiProductRef[]) => {
    setEnabledApis(apis || []);
  };

  const { isLoading, error, data } = useQuery(QUERY_KEY_PRODUCTS, () =>
    apiClient?.getApiProducts(),
  );

  // Page
  const handleSave = async () => {
    await creatingAppResult.mutateAsync();
    navigate('/apps/');
  };

  const handleCancel = () => {
    navigate('/apps/');
  };

  const handleClear = () => {
    setName('');
    setInputTouched(false);
    setEnabledApis([]);
    setDescription('');
  };

  return (
    <Box>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h5" component="div" sx={{ flexGrow: 1 }}>
            New App
          </Typography>
        </Toolbar>
      </AppBar>
      <Container>
        <Box>
          <AppOverview
            appName={name}
            appDescription={description}
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
          <AppApisSelection
            isLoading={isLoading}
            enabledApis={enabledApis}
            handleApisChange={handleApisChange}
            error={error}
            apiProducts={data?.apiProduct || []}
          />
          {error &&
            <Alert severity="error">
              {(error as Error).message}
            </Alert>}
          {creatingAppResult.error &&
            <Alert severity="error">
              {(creatingAppResult.error as Error).message}
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
              onClick={handleClear}
            >
              <Restore sx={{ mr: 1 }} /> Clear
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSave}
              sx={{ ml: 2 }}
              disabled={creatingAppResult.isLoading || !nameIsValid || enabledApis.length < 1}
            >
              {creatingAppResult.isLoading && <CircularProgress size={18} />}
              <Save sx={{ mr: 1 }} /> Save
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
