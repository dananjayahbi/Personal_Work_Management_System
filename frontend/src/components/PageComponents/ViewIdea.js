import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import { Form, Formik } from "formik";
import TextField from "../FormsUI/TextField";
import SubmitButton from "../FormsUI/SubmitButton";
import Notification from "../DispayComponents/Notification";
import { Grid } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

const ViewIdea = ({ ideaID, openPopup, setOpenPopup }) => {
  const [notify, setNotify] = useState({
    isOpen: false,
    message: "",
    type: ""
  });

  const [formValues, setFormValues] = useState({
    idea: "",
    tags: []
  });
  const [loading, setLoading] = useState(true);

  //cancel functionality
  const handleClose = () => {
    setOpenPopup(false);
  };

  // Fetch idea data with the given ID
  useEffect(() => {
    if (ideaID) {
      setLoading(true);
      axios
        .get(`http://localhost:8070/ideas/getIdea/${ideaID}`)
        .then((res) => {
          const { idea, tags } = res.data;
          setFormValues({ idea, tags });
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching idea:", err);
          setLoading(false);
          // Handle any error during idea fetch
        });
    }
  }, [ideaID,openPopup]);

  if (loading) {
    return <div className="d-flex justify-content-center">Loading...</div>; // Render a loading state while data is being fetched
  }

  // Close the popup when clicking away from the window
  const handleBackdropClick = () => {
    setOpenPopup(false);
  };

  return (
    <Dialog
      open={openPopup}
      TransitionComponent={Transition}
      maxWidth="lg"
      fullWidth
      onBackdropClick={handleBackdropClick} // Close the popup when clicking away from the window
    >
      <div className="popup">
        <DialogTitle sx={{ marginBottom: '-25px' }}>
          <div className="d-flex justify-content-between">
            <p className="popupTitle">View Idea</p>
            <ClearIcon
              onClick={() => {
                setOpenPopup(false);
              }}
              sx={{
                cursor: "pointer",
                color: "var(--blue)",
                fontSize: "1.7rem",
                marginTop: "6px",
                marginRight: "10px"
              }}
            />
          </div>

          {/* NOTIFICATION */}
          <Notification notify={notify} setNotify={setNotify} />
        </DialogTitle>

        <DialogContent>
          <Formik
            initialValues={formValues}
            onSubmit={handleClose}
          >
            <Form>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField name="idea" label="Idea" sx={{ marginTop: '15px' , marginBottom: '15px' }} multiline minRows={10} />
                </Grid>

                <div className="d-flex addButtons">
                  <SubmitButton>Close</SubmitButton>
                </div>
              </Grid>
            </Form>
          </Formik>
        </DialogContent>
      </div>
    </Dialog>
  );
};

export default ViewIdea;
