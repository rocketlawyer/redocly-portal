import * as React from 'react';

import { Container, Box, Card, CardHeader, CardContent, CircularProgress, AppBar, Button, Toolbar, Typography } from '@mui/material';
import { APIClientContext } from '../../services/APIClientProvider';
import { useQuery } from 'react-query';
import { QUERY_KEY_APPS } from '../../services/config';
import ProtectedRoute from '../ProtectedRoute';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { App, Attributes } from '../../services/apigee-api-types';
import { getAppAttribute, getReadableDate } from '../../services/helpers';
import { navigate } from '@redocly/developer-portal/ui';
import TableTextCell from '../../components/TableTextCell';

export function AppsPage() {
  return <ProtectedRoute component={<AppsPageInternal />} />;
}

function AppsPageInternal() {
  const { apiClient } = React.useContext(APIClientContext);

  const { isLoading, data: appsData } = useQuery(QUERY_KEY_APPS, () => apiClient?.getDeveloperApps());

  const handleGetRowId = (app: App) => {
    return `${app.appId}`;
  };

  const handleRowClick = ({ row }) => {
    navigate(`/app/${row.name}`);
  }

  const handleNewApp = () => {
    navigate('/create-app/');
  }

  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: 'Name',
      flex: 2,
      minWidth: 300,
      renderCell: (params: GridRenderCellParams<App>) => (
        <TableTextCell text={getAppAttribute(params.row.attributes, Attributes.displayName) || params.row.name} />
      )
    },
    {
      field: 'appId',
      headerName: 'Description',
      flex: 3,
      sortable: false,
      minWidth: 200,
      renderCell: (params: GridRenderCellParams<App>) => (
        <TableTextCell text={getAppAttribute(params.row.attributes, Attributes.description)} />
      )
    },
    {
      field: 'owner',
      headerName: 'Owner',
      flex: 2,
      sortable: false,
      minWidth: 120,
      renderCell: (params: GridRenderCellParams<App>) => (
        <TableTextCell text={getAppAttribute(params.row.attributes, Attributes.owner)} />
      )
    },
    {
      field: 'createdAt',
      headerName: 'Created',
      flex: 1,
      minWidth: 170,
      renderCell: (params: GridRenderCellParams<App>) => (
        <Box sx={{ display: 'flex' }}>
          {getReadableDate(params.row.createdAt)}
        </Box>
      )
    }
  ];

  return (
    <Box>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h5" component="div" sx={{ flexGrow: 1 }}>
            My Apps
          </Typography>
          <Button color="secondary" onClick={handleNewApp} variant="contained">+ NEW APP</Button>
        </Toolbar>
      </AppBar>
      <Container>
        {!isLoading ? (
          <Box>
            <Card sx={{ mt: 2 }}>
              <CardHeader
                title="My Apps"
              />
              <CardContent>
                <DataGrid
                  rows={appsData?.app || []}
                  columns={columns}
                  disableColumnMenu={true}
                  pageSize={5}
                  rowsPerPageOptions={[5]}
                  autoHeight
                  getRowId={handleGetRowId}
                  onRowClick={handleRowClick}
                  getRowClassName={() => 'pointer'}
                  onCellClick={(params, event) => {
                    event.defaultMuiPrevented = true;
                  }}
                />
              </CardContent>
            </Card>
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
