import { LoadingButton } from '@mui/lab';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import * as React from 'react';

export default function CreateNewApiKeyDialog({ onConfirmation, isLoadingAddApiKey }) {
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
        loading={isLoadingAddApiKey}
        loadingIndicator="Adding"
        color="primary"
        variant="contained"
      >
        Add Key
      </LoadingButton>
      <Dialog
        open={isOpen}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle sx={{ backgroundColor: 'primary.main', color: '#fff', mb: 3 }} id="alert-dialog-title">
          {"Create Key"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Do you really want to create a new API key for this app?
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
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}