import React from 'react';
import axios from 'axios';
import { Dialog, DialogTitle, DialogActions, Button, IconButton, DialogContentText, DialogContent } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const DeleteIdea = ({ ideaID, openPopup4, setOpenPopup4 }) => {
  const handleDelete = () => {
    axios
      .delete(`http://localhost:8070/ideas/deleteIdea/${ideaID}`)
      .then((res) => {
        console.log('Idea deleted successfully!');
        // Perform any additional actions after successful deletion
        setOpenPopup4(false);
        //window.location.href = "./ideas";
      })
      .catch((err) => {
        console.error('Error deleting idea:', err);
        // Handle any error during deletion
      });
  };

  const handleClose = () => {
    setOpenPopup4(false);
  };

  return (
    <Dialog open={openPopup4} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        Confirm Delete
        <IconButton
          aria-label="close"
          sx={{ position: 'absolute', top: 8, right: 8 }}
          onClick={handleClose}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <DialogContentText>
          Are you sure you want to delete this item?
        </DialogContentText>
        <DialogActions sx={{ justifyContent: 'flex-end' }}>
          <Button variant="outlined" color="success" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="outlined" color="error" onClick={handleDelete}>
            Delete
          </Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
  
};

export default DeleteIdea;
