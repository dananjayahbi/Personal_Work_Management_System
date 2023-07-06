import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import { Form, Formik } from "formik";
import TextField from "../FormsUI/TextField";
import ButtonWrapper from "../FormsUI/Button";
import SubmitButton from "../FormsUI/SubmitButton";
import Notification from "../DispayComponents/Notification";
import { Chip, Grid, MenuItem } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

const UpdateIdea = ({ ideaID, openPopup, setOpenPopup }) => {
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
  const [storedTags, setStoredTags] = useState([]); // The array of tags

  // Get all tags
  useEffect(() => {
    fetchStoredTags();
  }, [openPopup]);

  const fetchStoredTags = () => {
    axios
      .get("http://localhost:8070/tags/getTags")
      .then((res) => {
        setStoredTags(res.data.tags);
      })
      .catch((err) => {
        console.log(err);
      });
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

  const handleUpdate = (values) => {
    axios
      .put(`http://localhost:8070/ideas/updateIdea/${ideaID}`, {
        idea: values.idea,
        tags: values.tags
      })
      .then((res) => {
        console.log('Idea updated successfully!');
        setOpenPopup(false);
        // Perform any additional actions after successful update
      })
      .catch((err) => {
        console.error("Error updating idea:", err);
        // Handle any error during idea update
      });
  };

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
      PaperProps={{
        style: { borderRadius: 10 }
      }}
      onBackdropClick={handleBackdropClick} // Close the popup when clicking away from the window
    >
      <div className="popup">
        <DialogTitle sx={{ marginBottom: '-25px' }}>
          <div className="d-flex justify-content-between">
            <p className="popupTitle">Edit Idea</p>
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
            onSubmit={handleUpdate}
          >
            {({ values, handleChange, handleBlur, errors, touched }) => (
              <Form>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField name="idea" label="Idea" sx={{ marginTop: '15px' , marginBottom: '15px' }} multiline minRows={10} />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      name="tags"
                      label="Tags"
                      select
                      SelectProps={{
                        multiple: true,
                        renderValue: (selected) => (
                          <div>
                            {selected.map((value) => (
                              <Chip key={value} label={value} style={{ margin: 2 }} />
                            ))}
                          </div>
                        ),
                      }}
                      value={values.tags}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.tags && Boolean(errors.tags)}
                      helperText={touched.tags && errors.tags}
                      InputProps={{
                        style: { minHeight: 'unset' }
                      }}
                      inputProps={{
                        style: {
                          minHeight: 'unset',
                          maxHeight: 'unset'
                        },
                        rows: values.tags.length === 0 ? 1 : values.tags.length
                      }}
                    >
                      {storedTags.map((tag) => {
                      if (tag !== "bookmarked") {
                        return (
                          <MenuItem key={tag} value={tag}>
                            {tag}
                          </MenuItem>
                        );
                      }
                      return null;
                    })}
                    </TextField>
                  </Grid>

                  <div className="d-flex addButtons">
                    <ButtonWrapper
                      style={{ marginRight: "15px" }}
                      onClick={() => setOpenPopup(false)}
                    >
                      Cancel
                    </ButtonWrapper>

                    <SubmitButton>Update</SubmitButton>
                  </div>
                </Grid>
              </Form>
            )}
          </Formik>
        </DialogContent>
      </div>
    </Dialog>
  );
};

export default UpdateIdea;
