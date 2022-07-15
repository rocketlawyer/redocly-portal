import React from "react";

import { Grid, MenuItem, Select, Typography } from "@mui/material";

export default function AppOwner({ appOwner }: { appOwner: string }) {
  return (
    <Grid container sx={{ pt: 2, pb: 2 }}>
      <Grid item lg={3} xs={12}>
        <Typography variant="h5" gutterBottom component="div">
          Owner
        </Typography>
      </Grid>
      <Grid item lg={9} xs={12}>
        <Select
          fullWidth
          id="app-owner"
          label="App Owner"
          variant="standard"
          value={appOwner}
          required
          disabled
        >
          <MenuItem value={appOwner}>{appOwner}</MenuItem>
        </Select>
      </Grid>
    </Grid>
  );
}