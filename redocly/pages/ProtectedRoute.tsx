import * as React from 'react';

import { Redirect } from '@reach/router';
import { getUserClaims, getIdPJwt } from '@redocly/developer-portal/ui';
import APIClientProvider from '../services/APIClientProvider';
import { ThemeProvider } from '@mui/material/styles';
import { themeMui } from '../../theme';

export default function ProtectedRoute({ component }: { component: any; path?: string }) {
  const userIdPJwt = getIdPJwt();
  const userClaims = getUserClaims();

  return (userIdPJwt && userClaims) || true ? (
    <ThemeProvider theme={themeMui}>
      <APIClientProvider user={userClaims} userIdPJwt={userIdPJwt}>
        {component}
      </APIClientProvider>
    </ThemeProvider>
  ) : (
    <Redirect from="" to="/" noThrow />
  );
}
