import { Grid, Typography, CircularProgress } from "@mui/material";
import { Lock } from '@mui/icons-material';
import ApisList from "../ApisList";
import React from "react";

export default function AppApisSelection({
  isLoading,
  enabledApis,
  handleApisChange,
  error,
  data
}) {
  return (
    <Grid container sx={{ pt: 2, pb: 2 }}>
      <Grid item xs={12} lg={3}>
        <Typography variant="h5" gutterBottom component="div">
          APIs *
        </Typography>
      </Grid>
      <Grid item xs={12} lg={9}>
        <Typography variant="h6" gutterBottom component="div">
          <Lock fontSize="small" />Indicates approval is required before access to the API is granted.
        </Typography>
        {isLoading ? (
          <CircularProgress />
        ) : (
          !error &&
          data?.apiProduct && (
            <ApisList
              products={data.apiProduct}
              enabledApis={enabledApis}
              onChange={handleApisChange}
            />
          )
        )}
      </Grid>
    </Grid>
  );
}