import * as React from 'react';

import { Typography, Flex } from '@redocly/developer-portal/ui';
import Checkbox from './common-elements/Checkbox';
import { ApiProduct } from '../services/apigee-api-types';
import { theme } from '../../theme';

export default function ApiItem(props: {
  product: ApiProduct;
  enabled: boolean;
  onChange: (apiName: string, enabled: boolean) => void;
}) {
  const { product, onChange, enabled } = props;

  const handleEnabled = e => {
    onChange(product.name, e.target.checked);
  };

  return (
    <Flex alignItems="baseline" mb={'0.75em'}>
      <Checkbox
        id={product.name}
        checked={enabled}
        onChange={handleEnabled}
        label={
          <>
            <Typography mt={'0'} mb={'0'}>
              {product.displayName}
            </Typography>
            {product.description && (
              <Typography mt={'0'} mb={'0'} color={theme.colors.text.secondary}>
                {product.description}
              </Typography>
            )}
          </>
        }
      />
    </Flex>
  );
}
