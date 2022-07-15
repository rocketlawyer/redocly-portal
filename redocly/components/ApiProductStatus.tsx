import * as React from 'react';

import { Box } from "@mui/material";
import { Block, Check, Close, LockClock, Save } from '@mui/icons-material';
import { ApiProductRefStatus } from '../services/apigee-api-types';

export default function ApiProductsStatus({ status }: { status: ApiProductRefStatus }) {
  const KEY_STATUSES_ICON = {
    [ApiProductRefStatus.PENDING_APPROVAL]: {
      icon: <LockClock sx={{ mr: 0.5 }} fontSize="small" />,
      label: 'Waiting for approval'
    },
    [ApiProductRefStatus.SAVE_TO_ENABLE]: {
      icon: <Save sx={{ mr: 0.5 }} fontSize="small" />,
      label: 'Save to enable'
    },
    [ApiProductRefStatus.REQUESTED_ACCESS]: {
      icon: <Save sx={{ mr: 0.5 }} fontSize="small" />,
      label: 'Save to request'
    },
    [ApiProductRefStatus.APPROVED]: {
      icon: <Check sx={{ mr: 0.5 }} fontSize="small" />,
      label: 'Approved'
    },
    [ApiProductRefStatus.REVOKED]: {
      icon: <Block sx={{ mr: 0.5 }} fontSize="small" />,
      label: 'Save to revoke'
    },
    [ApiProductRefStatus.DEFAULT]: {
      icon: '',
      label: ''
    },
    [ApiProductRefStatus.CANCEL_REQUEST]: {
      icon: <Close sx={{ mr: 0.5 }} fontSize="small" />,
      label: 'Save to cancel'
    },
  };

  return (
    <Box sx={{alignItems: 'center', display: 'flex'}}>
      { KEY_STATUSES_ICON[status].icon } { KEY_STATUSES_ICON[status].label }
    </Box>
  );
}