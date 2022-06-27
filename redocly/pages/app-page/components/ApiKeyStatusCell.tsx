import * as React from 'react';

import { Box } from "@mui/material";
import { Block, Check, LockClock } from '@mui/icons-material';

export default function ApiKeyStatusCell({ status }: { status: 'pending' | 'approved' | 'revoked' }) {
  const KEY_STATUSES_ICON = {
    pending: {
      icon: <LockClock />,
      text: 'Pending'
    },
    approved: {
      icon: <Check />,
      text: 'Approved'
    },
    revoked: {
      icon: <Block />,
      text: 'Revoked'
    },
  };

  return (
    <Box sx={{alignItems: 'center', display: 'flex'}}>
      { KEY_STATUSES_ICON[status].icon } { KEY_STATUSES_ICON[status].text }
    </Box>
  );
}