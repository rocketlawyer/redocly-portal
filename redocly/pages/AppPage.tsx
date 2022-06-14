import * as React from 'react';

import { Box, Flex, Alert, usePathPrefix } from '@redocly/developer-portal/ui';
import { useParams, Router } from '@reach/router';
import styled from 'styled-components';
import { Link } from 'gatsby';
import { Container, Paper } from '../components/common-elements/styled.elements';
import CircularProgress from '../components/common-elements/CircularProgress';
import { APIClientContext } from '../services/APIClientProvider';
import { getAppDisplayName } from '../services/helpers';
import { useQuery } from 'react-query';
import { QUERY_KEY_APP } from '../services/config';
import { App } from '../services/apigee-api-types';
import { replaceHashInColor } from '../../appTheme';
import ProtectedRoute from './ProtectedRoute';
import { withPathPrefix } from '../../utils';

export function AppPage(_props: { path?: string }) {
  const pathPrefix = usePathPrefix();
  return (
    <Router basepath={withPathPrefix('app', pathPrefix)}>
      <ProtectedRoute path={'/:appName'} component={<AppPageInternal />} />
    </Router>
  );
}

function AppPageInternal(_props: { path?: string }) {
  const params = useParams();
  const { apiClient } = React.useContext(APIClientContext);

  const { isLoading, data, error } = useQuery<any, Error, App>(QUERY_KEY_APP, () =>
    apiClient?.getDeveloperApp(params.appName),
  );

  const displayName = !isLoading && getAppDisplayName(data?.attributes);

  return (
    <Box mb={'4em'} mt={'4em'}>
      <Container>
        <StyledLink to="/apps/">
          <ArrowIcon />
          Back to apps
        </StyledLink>
        <Paper py={{ xs: '2em', medium: '3em' }} px={{ xs: '1em', medium: '0' }}>
          {isLoading ? (
            <Flex justifyContent="center" mt={'2em'}>
              <CircularProgress />
            </Flex>
          ) : (
            <Box maxWidth={{ xs: '100%', medium: '80%' }} mx="auto">
              {error ? (
                <Alert variant="danger" content={error?.message ?? 'Something went wrong'} />
              ) : data ? (
                <>
                  {/* <AppOverview
                    app={{
                      displayName: displayName as string,
                      name: data?.name,
                      appId: data?.appId,
                      createdAt: data?.createdAt,
                    }}
                  /> */}
                  {/* <ApiKeys credentials={data?.credentials} attributes={data?.attributes} /> */}
                </>
              ) : null}
            </Box>
          )}
        </Paper>
      </Container>
    </Box>
  );
}

const StyledLink = styled(Link)`
  display: inline-block;
  color: ${({ theme }) => theme.colors.primary.main};
  text-decoration: none;

  i {
    transform: translateX(-4px) rotate(90deg);
  }

  margin-bottom: 2em;
  &:hover {
    opacity: 0.75;
  }
`;

// prettier-ignore
export const ArrowIcon = styled.i`
  display: inline-block;
  width: 12px;
  height: 12px;
  background-repeat: no-repeat;
  background-size: 12px 12px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='${({ theme }) => replaceHashInColor(theme.colors.primary.main)}' viewBox='0 0 451.847 451.847' width='12px' height='12px' %3E%3Cpath d='M225.923 354.706c-8.098 0-16.195-3.092-22.369-9.263L9.27 151.157c-12.359-12.359-12.359-32.397 0-44.751 12.354-12.354 32.388-12.354 44.748 0l171.905 171.915 171.906-171.909c12.359-12.354 32.391-12.354 44.744 0 12.365 12.354 12.365 32.392 0 44.751L248.292 345.449c-6.177 6.172-14.274 9.257-22.369 9.257z' /%3E%3C/svg%3E");
`;
