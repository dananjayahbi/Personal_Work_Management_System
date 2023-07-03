import React, { useState } from "react";
import { Divider, Grid } from "@mui/material";
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
import { useNavigate } from "react-router-dom";
import Notification from "../DispayComponents/Notification";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

// FORMIK
const INITIAL_FORM_STATE = {
  idea: "",
  tags: ""
};

export default function AddUser(props) {
  const navigate = useNavigate();
  const { openPopup3, setOpenPopup3 } = props;
  const [notify, setNotify] = useState({
    isOpen: false,
    message: "",
    type: ""
  });

  return (
    <Dialog
      open={openPopup3}
      maxWidth="sm"
      TransitionComponent={Transition}
      PaperProps={{
        style: { borderRadius: 10 }
      }}
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
              const tagsArray = values.tags.split(",").map((tag) => tag.trim());
              await axios
                .post("http://localhost:8070/ideas/newIdea", {
                  idea: values.idea,
                  tags: tagsArray
                })
                .then((res) => {
                  sessionStorage.setItem("ideaCreated", "1");
                  setOpenPopup3(false);
                  //window.location.href = "./ideas";
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
            <Form>
              <Grid container sx={{ paddingTop: "10px" }} spacing={2}>
                <Grid item xs={12}>
                  <TextField name="idea" label="Idea" multiline minRows={10} />
                </Grid>

                <Grid item xs={12}>
                  <TextField name="tags" label="Tags" />
                </Grid>

                <div className="d-flex addButtons">
                  <ButtonWrapper
                    startIcon={<ClearIcon />}
                    style={{ marginRight: "15px" }}
                  >
                    Clear
                  </ButtonWrapper>

                  <SubmitButton startIcon={<AddIcon />}>Add</SubmitButton>
                </div>
              </Grid>
            </Form>
          </Formik>
        </DialogContent>
      </div>
    </Dialog>
  );
}
