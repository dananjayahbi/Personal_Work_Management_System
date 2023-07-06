import React, { useState , useEffect } from "react";
import { Divider, Grid, MenuItem, Chip } from "@mui/material";
import "../../styles/dashboard.css";
import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import { Form, Formik } from "formik";
import axios from "axios";
import TextField from "../FormsUI/TextField";
import ButtonWrapper from "../FormsUI/Button";
import SubmitButton from "../FormsUI/SubmitButton";
import Notification from "../DispayComponents/Notification";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

// FORMIK
const INITIAL_FORM_STATE = {
  idea: "",
  tags: []
};

export default function AddUser(props) {
  const { openPopup3, setOpenPopup3 } = props;
  const [notify, setNotify] = useState({
    isOpen: false,
    message: "",
    type: ""
  });

  const [storedTags, setStoredTags] = useState([]); //The array of tags

  // Get all tags
  useEffect(() => {
    fetchStoredTags();
  }, [openPopup3]);

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

  // Close the popup when clicking away from the window
  const handleBackdropClick = () => {
    setOpenPopup3(false);
  };

  return (
    <Dialog
      open={openPopup3}
      TransitionComponent={Transition}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        style: { borderRadius: 10 }
      }}
      onBackdropClick={handleBackdropClick} // Close the popup when clicking away from the window
    >
      <div className="popup">
        <DialogTitle>
          <div className="d-flex justify-content-between">
            <p className="popupTitle">Add Idea</p>
            <ClearIcon
              onClick={() => {
                setOpenPopup3(false);
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

          <Divider
            sx={{
              height: "1px",
              backgroundColor: "var(--dark)",
              marginTop: "10px"
            }}
          />
        </DialogTitle>

        <DialogContent>
          <Formik
            initialValues={{ ...INITIAL_FORM_STATE }}
            onSubmit={async (values) => {
              const tagsString = values.tags;
              await axios
                .post("http://localhost:8070/ideas/newIdea", {
                  idea: values.idea,
                  tags: tagsString,
                  ideaStatus: "none",
                  bookmark: "false"
                })
                .then((res) => {
                  sessionStorage.setItem("ideaCreated", "1");
                  setOpenPopup3(false);
                })
                .catch((err) => {
                  if (
                    err.response &&
                    err.response.data &&
                    err.response.data.error === "Same idea already exists"
                  ) {
                    alert("Same idea already exists");
                  } else {
                    console.log(err.response.data.error);
                  }
                });
            }}
          >
            {({ values, handleChange, handleBlur, errors, touched }) => (
              <Form>
                <Grid container sx={{ paddingTop: "10px" }} spacing={2}>
                  <Grid item xs={12}>
                    <TextField name="idea" label="Idea" multiline minRows={10} />
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
                      onClick={() => setOpenPopup3(false)}
                    >
                      Cancel
                    </ButtonWrapper>

                    <SubmitButton startIcon={<AddIcon />}>Add</SubmitButton>
                  </div>
                </Grid>
              </Form>
            )}
          </Formik>
        </DialogContent>
      </div>
    </Dialog>
  );
}
