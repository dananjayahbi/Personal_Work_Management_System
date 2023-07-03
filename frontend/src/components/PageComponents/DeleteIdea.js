import React from 'react';
import axios from 'axios';
import Button from '@mui/material/Button';
import { Dialog, DialogActions, DialogTitle } from '@mui/material';

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
    <Dialog open={openPopup4} onClose={handleClose}>
      <DialogTitle>Confirm Delete</DialogTitle>
      <DialogActions>
        <Button variant="outlined"  onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="outlined" color="error" onClick={handleDelete}>
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteIdea;
