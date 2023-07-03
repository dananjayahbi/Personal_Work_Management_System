import React from 'react';
import axios from 'axios';
import Button from '@mui/material/Button';

const DeleteIdea = ({ ideaID }) => {
  const handleDelete = () => {
    axios
      .delete(`http://localhost:8070/ideas/deleteIdea/${ideaID}`)
      .then((res) => {
        console.log('Idea deleted successfully!');
        // Perform any additional actions after successful deletion
      })
      .catch((err) => {
        console.error('Error deleting idea:', err);
        // Handle any error during deletion
      });
  };

  return (
    <Button variant="outlined" color="error" onClick={handleDelete}>
      Delete
    </Button>
  );
};

export default DeleteIdea;
