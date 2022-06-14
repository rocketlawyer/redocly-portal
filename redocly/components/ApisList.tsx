import * as React from 'react';

import { Alert } from '@redocly/developer-portal/ui';
import { ApiProduct } from '../services/apigee-api-types';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { Lock, Save } from '@mui/icons-material';

import { Button } from '@mui/material';
import { Box } from '@mui/system';

export default function ApisList(props: {
  products?: ApiProduct[];
  enabledApis: string[];
  onChange: (enabledApis: string[]) => void;
}) {
  const columns: GridColDef[] = [
    {
      field: 'displayName',
      headerName: 'Name',
      width: 250,
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
      width: 250
    },
    {
      field: 'status',
      headerName: 'Status',
      sortable: false,
      width: 140,
      renderCell: (params: GridRenderCellParams<ApiProduct>) => (
        <Box sx={{ display: 'flex' }}>
          {isApiSelected(params.row.displayName) ? (
            <Save sx={{ mr: 0.5 }} fontSize="small" />
          ) : ''}{getStatus(params.row)}
        </Box>
      )
    },
    {
      field: 'createdAt',
      headerName: 'Actions',
      sortable: false,
      width: 120,
      renderCell: (params: GridRenderCellParams<ApiProduct>) => (
        <Button
          variant="outlined"
          color="primary"
          size="small"
          sx={{ m: 'auto' }}
          tabIndex={params.hasFocus ? 0 : -1}
          onClick={() => { handleChange(params.row.displayName) }}
        >
          {getButtonLabel(params.row)}
        </Button>
      )
    },
  ];

  const handleGetRowId = (product: ApiProduct) => {
    return product.createdAt;
  }

  const { products, enabledApis, onChange } = props;
  const sortedProducts = ([...products]).sort((a, b) => a.displayName.localeCompare(b.displayName));

  if (!products?.length) {
    return <Alert variant="warning" content="There are no API products yet." />;
  }

  const isApiSelected = (apiName: string) => {
    return enabledApis.some((displayName) => apiName === displayName);
  }

  const getButtonLabel = (product: ApiProduct) => {
    if (product.approvalType === 'auto') {
      return isApiSelected(product.displayName) ? 'Cancel' : 'Enable';
    }
    return isApiSelected(product.displayName) ? 'Cancel' : 'Request';
  }

  const getStatus = (product: ApiProduct) => {
    if (product.approvalType === 'auto') {
      return !isApiSelected(product.displayName) ? '-' : 'Save to enable';
    }
    return !isApiSelected(product.displayName) ? '-' : 'Save to request';
  }


  const handleChange = (apiName: string) => {
    const updatedApis = !isApiSelected(apiName)
      ? [...enabledApis, apiName]
      : enabledApis.filter(api => api !== apiName);

    onChange(updatedApis);
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