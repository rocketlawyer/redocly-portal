import * as React from 'react';

import { Box, IconButton, Button, Tooltip } from "@mui/material";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

export default function ApiKeySecretCell({ consumerSecret }: { consumerSecret: string }) {
  const [isSecretVisible, setIsSecretVisible] = React.useState(false);

  const showSecret = () => {
    setIsSecretVisible(true);
  }

  const copySecret = () => {
    navigator.clipboard.writeText(consumerSecret);
  }

  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      {isSecretVisible ? (consumerSecret) : (
        <Button
          variant="outlined"
          color="primary"
          size="small"
          sx={{ m: 'auto' }}
          onClick={showSecret}
        >
          Show secret
        </Button>
      )}
      <Tooltip title="Copy Secret">
        <IconButton onClick={copySecret} aria-label="copy-secret">
          <ContentCopyIcon />
        </IconButton>
      </Tooltip>
    </Box>
  );
}