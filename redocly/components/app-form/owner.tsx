import { Grid, MenuItem, Select, Typography } from "@mui/material";
import React from "react";

export default function AppOwner({appOwner}) {
  return (
    <Grid container sx={{ pt: 2, pb: 2 }}>
      <Grid item sm={4}>
        <Typography variant="h5" gutterBottom component="div">
          Owner
        </Typography>
      </Grid>
      <Grid item sm={8}>
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