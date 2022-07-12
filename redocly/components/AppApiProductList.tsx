import * as React from 'react';

import { Alert } from '@redocly/developer-portal/ui';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { Lock } from '@mui/icons-material';
import { Button } from '@mui/material';
import { Box } from '@mui/system';

import { ApiProduct, ApiProductRef, ApiProductRefStatus } from '../services/apigee-api-types';
import ApiProductsStatus from './ApiProductStatus';

export default function ApiProductList({ products = [], enabledApis, onChange }: ApiProductListProps) {
  const columns: GridColDef[] = [
    {
      field: 'displayName',
      headerName: 'Name',
      minWidth: 250,
      flex: 2,
      renderCell: (params: GridRenderCellParams<ApiProduct>) => (
        <Box sx={{ display: 'flex' }}>
          {params.row.approvalType === 'auto' ?
            ('') :
            (<Lock sx={{ mr: 0.5 }} fontSize="small" />)}{params.row.displayName}
        </Box>
      )
    },
    {
      field: 'description',
      headerName: 'Description',
      sortable: false,
      minWidth: 250,
      flex: 3,
    },
    {
      field: 'status',
      headerName: 'Status',
      sortable: false,
      minWidth: 165,
      flex: 1,
      renderCell: (params: GridRenderCellParams<ApiProduct>) => {
        const enabledApi = enabledApis.find((apiProductRef: ApiProductRef) => params.row.name === apiProductRef.apiproduct);
        return enabledApi ? <ApiProductsStatus status={enabledApi.status} /> : '';
      }
    },
    {
      field: 'createdAt',
      headerName: 'Actions',
      sortable: false,
      minWidth: 120,
      flex: 1,
      renderCell: (params: GridRenderCellParams<ApiProduct>) => (
        getActionButton(params.row)
      )
    },
  ];

  const handleGetRowId = (product: ApiProduct) => {
    return product.createdAt;
  }

  const sortedProducts = ([...products]).sort((a, b) => a.displayName.localeCompare(b.displayName));

  if (!products?.length) {
    return <Alert variant="warning" content="There are no API products yet." />;
  }

  const buildActionButton = (label: string, action: () => void) => {
    return (
      <Button
        variant="outlined"
        color="primary"
        size="small"
        sx={{ m: 'auto' }}
        onClick={action}
      >
        {label}
      </Button>
    );
  }

  const getActionButton = (product: ApiProduct) => {
    const selectedApiRef = enabledApis.find((apiProductRef: ApiProductRef) => product.name === apiProductRef.apiproduct);
    if (selectedApiRef) {
      switch (selectedApiRef.status) {
        case ApiProductRefStatus.APPROVED:
          return buildActionButton('Revoke', () => revokeAccess(selectedApiRef.apiproduct));
        case ApiProductRefStatus.PENDING_APPROVAL:
          return buildActionButton('Cancel', () => cancelRequest(selectedApiRef.apiproduct));
        case ApiProductRefStatus.SAVE_TO_ENABLE:
          return buildActionButton('Cancel', () => resetToDefault(selectedApiRef.apiproduct));
        case ApiProductRefStatus.REQUESTED_ACCESS:
          return buildActionButton('Cancel', () => resetToDefault(selectedApiRef.apiproduct));
        case ApiProductRefStatus.CANCEL_REQUEST:
          return buildActionButton('Reset', () => undoCancellation(selectedApiRef.apiproduct));
        case ApiProductRefStatus.REVOKED:
          return buildActionButton('Reset', () => undoRevogation(selectedApiRef.apiproduct));
      }
    }
    return product.approvalType === 'auto' ?
      buildActionButton('Enable', () => addToList(product.name)) :
      buildActionButton('Request', () => requestAccess(product.name));
  }

  const cancelRequest = (apiProductName: string) => {
    updateEnabledApis({ apiproduct: apiProductName, status: ApiProductRefStatus.CANCEL_REQUEST });
  }

  const revokeAccess = (apiProductName: string) => {
    updateEnabledApis({ apiproduct: apiProductName, status: ApiProductRefStatus.REVOKED });
  }

  const resetToDefault = (apiProductName: string) => {
    updateEnabledApis({ apiproduct: apiProductName, status: ApiProductRefStatus.DEFAULT });
  }

  const undoCancellation = (apiProductName: string) => {
    updateEnabledApis({ apiproduct: apiProductName, status: ApiProductRefStatus.PENDING_APPROVAL });
  }

  const requestAccess = (apiProductName: string) => {
    updateEnabledApis({ apiproduct: apiProductName, status: ApiProductRefStatus.REQUESTED_ACCESS });
  }

  const addToList = (apiProductName: string) => {
    updateEnabledApis({ apiproduct: apiProductName, status: ApiProductRefStatus.SAVE_TO_ENABLE });
  }

  const undoRevogation = (apiProductName: string) => {
    updateEnabledApis({ apiproduct: apiProductName, status: ApiProductRefStatus.APPROVED });
  }

  const updateEnabledApis = (apiProductRef: ApiProductRef) => {
    const apiProductIndex = enabledApis.findIndex(({ apiproduct }) => apiProductRef.apiproduct === apiproduct);
    if (apiProductIndex < 0) {
      onChange([...enabledApis, apiProductRef]);
    } else {
      const updatedApis = [...enabledApis];
      updatedApis[apiProductIndex].status = apiProductRef.status;
      onChange(updatedApis);
    }
  };

  return (
    <div style={{ display: 'flex', height: '100%' }}>
      <div style={{ flexGrow: 1 }}>
        <DataGrid
          rows={sortedProducts}
          columns={columns}
          disableColumnMenu={true}
          getRowId={handleGetRowId}
          pageSize={5}
          rowsPerPageOptions={[5]}
          autoHeight
          disableSelectionOnClick
          onCellClick={(params, event) => {
            event.defaultMuiPrevented = true;
          }}
        />
      </div>
    </div>
  );
}

interface ApiProductListProps {
  products?: ApiProduct[];
  enabledApis: ApiProductRef[];
  onChange: (enabledApis: ApiProductRef[]) => void;
}