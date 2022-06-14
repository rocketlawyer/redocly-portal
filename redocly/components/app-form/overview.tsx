import { Grid, Typography, TextField, Alert } from "@mui/material";
import React from "react";

export default function AppOverview(props: AppOverviewProps) {
  const changeAppName = (event) => {
    props.handleChangeName(event.target.value);
  }

  const changeAppDescription = (event) => {
    props.handleChangeDescription(event.target.value);
  }

  return (
    <Grid container sx={{ pt: 5, pb: 2 }}>
      <Grid item xs={4}>
        <Typography variant="h5" gutterBottom component="div">
          Overview
        </Typography>
      </Grid>
      <Grid item xs={8}>
        <TextField
          fullWidth
          id="app-name"
          label="App name"
          required
          value={props.appName}
          onChange={changeAppName}
          variant="standard"
        />
        {!props.nameIsValid && props.nameTouched && (
          <Alert severity="error" sx={{mt: 2}}>
            The app name can include only alphanumeric, space, and the following: _ - . # $ %. Must begin with an alpha character.
          </Alert>
        )}
        {props.nameIsTooLong &&
          <Alert severity="error" sx={{mt: 2}}>
            App name is too long
          </Alert>
        }
        <TextField
          fullWidth
          id="app-description"
          label="Description"
          value={props.appDescription}
          variant="standard"
          onChange={changeAppDescription}
          sx={{ mt: 2 }}
        />
      </Grid>
    </Grid>
  );
}

interface AppOverviewProps {
  appName: string;
  handleChangeName: (appName: string) => void;
  nameTouched: boolean;
  nameIsValid: boolean;
  nameIsTooLong: boolean;
  appDescription: string;
  handleChangeDescription: (appDescription: string) => void;
  appId?: string;
}