import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import { Form, Formik } from "formik";
import TextField from "../FormsUI/TextField";
import ButtonWrapper from "../FormsUI/Button";
import SubmitButton from "../FormsUI/SubmitButton";
import { useNavigate } from "react-router-dom";
import Notification from "../DispayComponents/Notification";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

const UpdateIdea = ({ ideaID, openPopup, setOpenPopup }) => {
  const navigate = useNavigate();
  const [notify, setNotify] = useState({
    isOpen: false,
    message: "",
    type: ""
  });
  const [initialValues, setInitialValues] = useState({
    idea: "",
    tags: ""
  });
  const [formValues, setFormValues] = useState({
    idea: "",
    tags: ""
  });
  const [loading, setLoading] = useState(true);

  // Fetch idea data with the given ID
  useEffect(() => {
    if (ideaID) {
      setLoading(true);
      axios
        .get(`http://localhost:8070/ideas/getIdea/${ideaID}`)
        .then((res) => {
          const { idea, tags } = res.data;
          setInitialValues({ idea, tags: tags.join(",") });
          setFormValues({ idea, tags: tags.join(",") });
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching idea:", err);
          setLoading(false);
          // Handle any error during idea fetch
        });
    }
  }, [ideaID]);

  const handleUpdate = (values) => {
    const tagsArray = values.tags.split(",").map((tag) => tag.trim());
    axios
      .put(`http://localhost:8070/ideas/updateIdea/${ideaID}`, {
        idea: values.idea,
        tags: tagsArray
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

  return (
    <Dialog
      open={openPopup}
      TransitionComponent={Transition}
      PaperProps={{
        style: { borderRadius: 10 }
      }}
    >
      <div className="popup">
        <DialogTitle sx={{ marginBottom: '-25px' }}>
          <div className="d-flex justify-content-between">
            <p className="popupTitle">Update Idea</p>
          </div>

          {/* NOTIFICATION */}
          <Notification notify={notify} setNotify={setNotify} />
        </DialogTitle>

        <DialogContent>
          <Formik
            initialValues={formValues}
            onSubmit={handleUpdate}
          >

              <Form>
                <TextField name="idea" label="Idea" sx={{ marginTop: '15px' , marginBottom: '15px' }} multiline minRows={10} />

                <TextField name="tags" label="Tags" />

                <div className="d-flex addButtons">
                  <ButtonWrapper
                    style={{ marginRight: "15px" }}
                    onClick={() => setOpenPopup(false)}
                  >
                    Cancel
                  </ButtonWrapper>

                  <SubmitButton>Update</SubmitButton>
                </div>
              </Form>

          </Formik>
        </DialogContent>
      </div>
    </Dialog>
  );
};

export default UpdateIdea;
