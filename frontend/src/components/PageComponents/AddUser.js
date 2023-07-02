import React, { useState } from "react";
import { Divider, Grid } from "@mui/material";
import "../../styles/dashboard.css";
import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import {Form, Formik } from "formik";
import axios from "axios";
import * as Yup from "yup";
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
    firstName: "",
    lastName: "",
    username: "",
    password: ""
  };

  // YUP
const FORM_VALIDATION = Yup.object().shape({
    firstName: Yup.string()
      .min(2, "Too short!")
      .max(50, "Too long!")
      .required("Required!"),
    lastName: Yup.string().required("Required!"),
    username: Yup.string()
      .min(5, "Too Short!")
      .max(50, "Too Long!")
      .required("Required!"),
    password: Yup.string()
      .min(8, "Too Short!")
      .max(50, "Too Long!")
      .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
      .matches(/[0-9]/, 'Password must contain at least one number')
      .matches(/[^A-Za-z0-9]/, 'Password must contain at least one special character')
      .matches(/^\S*$/, 'Password cannot contain spaces')
      .required("Required!")
  });




  //the AddUserfunction
  export default function AddUser(props){
    const navigate = useNavigate();
    const { openPopup, setOpenPopup } = props;
    const [notify, setNotify] = useState({
        isOpen: false,
        message: "",
        type: "",
      });

      

     return(
        <Dialog
            open={openPopup}
            maxWidth="sm"
            TransitionComponent={Transition}
            PaperProps={{
                style: { borderRadius: 10 },
            }}
        >
            <div className="popup">
            <DialogTitle>
            <div className="d-flex justify-content-between">
            <p className="popupTitle">Add User</p>
            <ClearIcon
              onClick={() => {
                setOpenPopup(false);
              }}
              sx={{
                cursor: "pointer",
                color: "var(--blue)",
                fontSize: "1.7rem",
                marginTop: "6px",
                marginRight: "10px",
              }}
            />
          </div>

          {/* NOTIFICATION */}
          <Notification notify={notify} setNotify={setNotify} />

          <Divider
            sx={{
              height: "1px",
              backgroundColor: "var(--dark)",
              marginTop: "10px",
            }}
          />
        </DialogTitle>

        <DialogContent>
            <Formik
                initialValues={{ ...INITIAL_FORM_STATE }}
                validationSchema={FORM_VALIDATION}
                onSubmit={async (values) => {
                  const fullName = `${values.firstName} ${values.lastName}`;

                  await axios
                    .post(
                      "http://localhost:8070/user/register",
                      {
                        fullName: fullName,
                        username: values.username,
                        password: values.password,
                      },
                      
                    )
                    .then((res) => {
                      sessionStorage.setItem("userCreated", "1");
                      setOpenPopup(false);
                      navigate("/users");
                      window.location.reload(false);
                    })
                    .catch((err) => {
                        if (
                          err.response &&
                          err.response.data &&
                          err.response.data.error === "A user with the same username already exists"
                        ) {
                          alert("A user with the same username already exists");
                        }else {
                          console.log(err.response.data.error);
                        }
                      });
                }}
            >

                <Form>
                    <Grid container sx={{ paddingTop: "10px" }} spacing={2}>
                        <Grid item xs={6}>
                        <TextField name="firstName" label="First Name" />
                        </Grid>

                        <Grid item xs={6}>
                        <TextField name="lastName" label="Last Name" />
                        </Grid>

                        <Grid item xs={12}>
                        <TextField name="username" label="Username" />
                        </Grid>

                        <Grid item xs={12}>
                        <TextField type="password" name="password" label="Password" />
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