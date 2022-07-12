import * as React from 'react';

import { Box, Grid, Typography, Button } from "@mui/material";
import LoadingButton from '@mui/lab/LoadingButton';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';

import { ApiProduct, Credential, CredentialStatus } from "../../../services/apigee-api-types";
import ApiKeyCell from './ApiKeyCell';
import ApiKeySecretCell from './ApiKeySecretCell';
import ApiKeyStatusCell from './ApiKeyStatusCell';
import CreateNewApiKeyDialog from './CreateNewApiKeyDialog';

export function getReadableDate(date: number) {
  const localeStringOptions = {
    day: 'numeric' as const,
    month: 'short' as const,
    year: 'numeric' as const,
    hour: 'numeric' as const,
    minute: 'numeric' as const
  };
  return new window.Date(date).toLocaleString('en-US', localeStringOptions);
}

export default function ApiKeys({ credentials, appId, handleApiRevoke, isLoadingApiRevoke, addApiKey, isLoadingAddApiKey }: ApiKeysProps) {
  const getFilteredCredentials = () => {
    return credentials.filter((credential: Credential) => credential.status === CredentialStatus.APPROVED);
  }

  const [isRevokedVisible, setIsRevokedVisible] = React.useState(false);
  const [filteredCredentials, setFilteredCredentials] = React.useState(getFilteredCredentials());
  const revokedCredentials = credentials.filter((credential: Credential) => credential.status === CredentialStatus.REVOKED).length;

  const columns: GridColDef[] = [
    {
      field: 'consumerKey',
      headerName: 'Key',
      flex: 2,
      minWidth: 300,
      sortable: false,
      renderCell: (params: GridRenderCellParams<ApiProduct>) => (
        <ApiKeyCell consumerKey={params.row.consumerKey} />
      )
    },
    {
      field: 'consumerSecret',
      headerName: 'Secret',
      flex: 1,
      sortable: false,
      minWidth: 175,
      renderCell: (params: GridRenderCellParams<ApiProduct>) => (
        <ApiKeySecretCell consumerSecret={params.row.consumerSecret} />
      )
    },
    {
      field: 'status',
      headerName: 'Status',
      flex: 1,
      sortable: false,
      minWidth: 120,
      renderCell: (params: GridRenderCellParams<ApiProduct>) => (
        <ApiKeyStatusCell status={params.row.status} />
      )
    },
    {
      field: 'issuedAt',
      headerName: 'Created',
      flex: 1,
      sortable: false,
      minWidth: 170,
      renderCell: (params: GridRenderCellParams<ApiProduct>) => (
        <Box sx={{ display: 'flex' }}>
          {getReadableDate(params.row.issuedAt)}
        </Box>
      )
    },
    {
      field: 'expiresIn',
      headerName: 'Expires',
      sortable: false,
      flex: 1,
      minWidth: 170,
      renderCell: (params: GridRenderCellParams<ApiProduct>) => (
        <Box sx={{ display: 'flex' }}>
          {params.row.expiresAt > 0 ? getReadableDate(params.row.expiresAt) : 'Never'}
        </Box>
      )
    },
    {
      field: 'actions',
      headerName: 'Actions',
      sortable: false,
      width: 100,
      renderCell: (params: GridRenderCellParams<ApiProduct>) => (
        (params.row.status === CredentialStatus.APPROVED ?
          <LoadingButton
            size="small"
            onClick={() => revokeApi(params.row)}
            loading={isLoadingApiRevoke}
            loadingIndicator="Revoking"
            variant="outlined"
          >
            Revoke
          </LoadingButton> :
          '')
      )
    }
  ];

  const revokeApi = (credential: Credential) => {
    handleApiRevoke(credential);
  };

  const handleGetRowId = (credential: Credential) => {
    return `${appId}${credential.consumerKey}`;
  };

  const handleAddApiKey = () => {
    addApiKey();
  };

  const toggleRevokedKeys = () => {
    if (!isRevokedVisible) {
      setFilteredCredentials(credentials);
    } else {
      setFilteredCredentials(getFilteredCredentials());
    }
    setIsRevokedVisible(!isRevokedVisible);
  }

  return (
    <Grid container sx={{ pt: 5, pb: 2, maxWidth: '100%', overflow: 'auto' }}>
      <Grid item lg={3} xs={12}>
        <Typography variant="h5" gutterBottom component="div">
          API Keys
        </Typography>
      </Grid>
      <Grid item lg={9} xs={12}>
        <div style={{ display: 'flex', height: '100%', flexDirection: 'column' }}>
          <div style={{ flexGrow: 1 }}>
            <DataGrid
              rows={filteredCredentials}
              columns={columns}
              disableColumnMenu={true}
              pageSize={5}
              rowsPerPageOptions={[5]}
              autoHeight
              getRowId={handleGetRowId}
              disableSelectionOnClick
              onCellClick={(params, event) => {
                event.defaultMuiPrevented = true;
              }}
            />
          </div>
          {(revokedCredentials > 0 ?
            <Box sx={{ mt: 2 }}>
              <Button
                onClick={toggleRevokedKeys}
                variant="text"
                autoFocus
              >
                {isRevokedVisible ? `Hide ${revokedCredentials} revoked credentials` : `Show ${revokedCredentials} revoked credentials`}
              </Button>
            </Box> : '')}
          <Box sx={{ mt: 2 }}>
            <CreateNewApiKeyDialog
              onConfirmation={handleAddApiKey}
              isLoadingAddApiKey={isLoadingAddApiKey}
            />
          </Box>
        </div>
      </Grid>
    </Grid>
  );
}

interface ApiKeysProps {
  credentials: Credential[];
  appId: string;
  handleApiRevoke: (credential: Credential) => void;
  isLoadingApiRevoke: boolean;
  addApiKey: () => void;
  isLoadingAddApiKey: boolean;
}