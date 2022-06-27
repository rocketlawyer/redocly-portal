import * as React from 'react';

import { Box, Grid, Typography } from "@mui/material";
import LoadingButton from '@mui/lab/LoadingButton';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { Credential } from '@redocly/developer-portal/dist/engine/src/apigee/services/apigee-api-types';

import { ApiProduct } from "../../../services/apigee-api-types";
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
        <LoadingButton
          size="small"
          onClick={() => revokeApi(params.row.consumerKey)}
          loading={isLoadingApiRevoke}
          loadingIndicator="Revoking"
          variant="outlined"
        >
          Revoke
        </LoadingButton>
      )
    }
  ];

  const revokeApi = (consumerKey: string) => {
    handleApiRevoke(consumerKey);
  };

  const handleGetRowId = (credential: Credential) => {
    return `${appId}${credential.consumerKey}`;
  };

  const handleAddApiKey = () => {
    addApiKey();
  };

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
              rows={credentials}
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
  handleApiRevoke: (consumerKey: string) => void;
  isLoadingApiRevoke: boolean;
  addApiKey: () => void;
  isLoadingAddApiKey: boolean;
}