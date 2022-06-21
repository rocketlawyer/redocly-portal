import * as React from 'react';
import { Box, IconButton, Tooltip } from "@mui/material";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

export default function ApiKeyCell({consumerKey}) {
  const copySecret = () => {
    navigator.clipboard.writeText(consumerKey);
  }

  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      {consumerKey}
      <Tooltip title="Copy API Key">
        <IconButton onClick={copySecret} aria-label="copy-content">
          <ContentCopyIcon />
        </IconButton>
      </Tooltip>
    </Box>
  );
}