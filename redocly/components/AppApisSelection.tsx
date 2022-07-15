import React from "react";

import { Grid, Typography, CircularProgress } from "@mui/material";
import { Lock } from '@mui/icons-material';

import ApiProductList from "./AppApiProductList";
import { ApiProduct, ApiProductRef } from "../services/apigee-api-types";

export default function AppApisSelection({
  isLoading,
  enabledApis,
  handleApisChange,
  error,
  apiProducts
}: AppApisListProps) {
  return (
    <Grid container sx={{ pt: 2, pb: 2 }}>
      <Grid item xs={12} lg={3}>
        <Typography variant="h5" gutterBottom component="div">
          APIs *
        </Typography>
      </Grid>
      <Grid item xs={12} lg={9}>
        <Typography variant="h6" gutterBottom component="div" sx={{display: 'flex', alignItems: 'center'}}>
          <Lock fontSize="small" />Indicates approval is required before access to the API is granted.
        </Typography>
        {isLoading ? (
          <CircularProgress />
        ) : (
          !error &&
          apiProducts && (
            <ApiProductList
              products={apiProducts}
              enabledApis={enabledApis}
              onChange={handleApisChange}
            />
          )
        )}
      </Grid>
    </Grid>
  );
}

interface AppApisListProps {
  isLoading: boolean;
  enabledApis: ApiProductRef[];
  error: any;
  apiProducts: ApiProduct[];
  handleApisChange: (apis: ApiProductRef[]) => void;
}