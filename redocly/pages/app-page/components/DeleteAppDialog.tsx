import * as React from 'react';

import { LoadingButton } from '@mui/lab';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { Delete } from '@mui/icons-material';

export default function ConfirmAppDeletionDialog({ onConfirmation, isLoadingAppDeletion }: ConfirmAppDeletionDialogProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  const handleClickOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const confirmAndClose = () => {
    setIsOpen(false);
    onConfirmation();
  };

  return (
    <Box>
      <LoadingButton
        onClick={handleClickOpen}
        loading={isLoadingAppDeletion}
        loadingIndicator="Adding"
        color="primary"
      >
        <Delete sx={{ mr: 1 }} /> Delete
      </LoadingButton>
      <Dialog
        open={isOpen}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle sx={{ backgroundColor: 'primary.main', color: '#fff', mb: 3 }} id="alert-dialog-title">
          {"Delete App"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Do you really want to delete this app? This action is irreversible.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleClose}
            variant="outlined"
          >
            Cancel
          </Button>
          <Button
            onClick={confirmAndClose}
            variant="contained"
            autoFocus
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

interface ConfirmAppDeletionDialogProps {
  onConfirmation: () => void;
  isLoadingAppDeletion: boolean;
};