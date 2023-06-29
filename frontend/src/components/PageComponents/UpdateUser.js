import React, { useEffect, useState } from "react";
import { Divider, Grid } from "@mui/material";
import "../../styles/dashboard.css";
import ClearIcon from "@mui/icons-material/Clear";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import { Form, Formik } from "formik";
import axios from "axios";
import TextField from "../FormsUI/TextField";
import SubmitButton from "../FormsUI/SubmitButton";
import { useNavigate } from "react-router-dom";
import SyncIcon from "@mui/icons-material/Sync";
import Notification from "../DispayComponents/Notification";
import EditIcon from "@mui/icons-material/Edit";
import {MenuItem, Select } from "@mui/material";


const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

 
//Update function
export default function UpdateUser(props){
  const fetched = props.userDetails;
  const token = localStorage.getItem("token");
  
  const [id, setID] = useState(' ');
  const [fullName, setFullName] = useState(' ');
  const [username, setUsername] = useState(' ');


  const { openPopup2, setOpenPopup2 } = props;
  const [notify, setNotify] = useState({
    isOpen: false,
    message: "",
    type: "",
  });

  
  
  useEffect(() => {
    // Update user state when fetched changes
    if(fetched){

     if(fetched.fullName == null){
        setFullName("");
     }else{
        setFullName(fetched.fullName);
     }

     if(fetched.username == null){
        setUsername("");
     }else{
        setUsername(fetched.username);
     }

     setID(fetched.id);

    }
  }, [fetched]);

  return(
    <Dialog
      open={openPopup2}
      maxWidth="lg"
      TransitionComponent={Transition}
      PaperProps={{
      style: { borderRadius: 10 },
    }}
    >
        <Notification notify={notify} setNotify={setNotify} />

        <div className="popup">
            <DialogTitle>
                <div className="d-flex justify-content-between">
                    <p className="popupTitle">
                    <EditIcon className="me-3" />
                    Update User
                    </p>
                    <ClearIcon
                    onClick={() => {
                        setOpenPopup2(false);
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
                    initialValues={{
                        fullName: fullName,
                        username: username,
                      }}

                      onSubmit={async (values) => {
                        if (
                          values.fullName === fullName &&
                          values.username === username
                        ) {
                          setNotify({
                            isOpen: true,
                            message: "No changes made!",
                            type: "warning",
                          });
                        } else {
                          await axios
                            .put(
                              "http://localhost:8070/user/updateUser/" +
                              fetched.id,
                              {
                                fullName: fullName,
                                username: username,
                              },
                        
                            )
                            .then((res) => {
                              sessionStorage.setItem("userUpdated", "1");
                              sessionStorage.setItem("userId", id);
                              setOpenPopup2(false);
                              window.location.reload(false);
                              
                            })
                            .catch((err) => {
                              if (
                                err.response &&
                                err.response.data &&
                                err.response.data.errorMessage
                              ) {
                                setNotify({
                                  isOpen: "true",
                                  message: err.response.data.errorMessage,
                                  type: "error",
                                });
                              }
                            });
                        }
                      }}
                >
                    <Form>
                        <Grid container sx={{ paddingTop: "10px" }} spacing={2}>
                            <Grid item xs={6}>
                                <TextField
                                    type = "text"
                                    name="fullName"
                                    label="Full Name"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    
                                />
                            </Grid>

                            <Grid item xs={6}>
                                <TextField
                                    name="username"
                                    label="Username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                            </Grid>

                            <div className="d-flex addButtons">
                                <SubmitButton startIcon={<SyncIcon />}>Update</SubmitButton>
                            </div>

                        </Grid>
                    </Form>

                </Formik>
            </DialogContent>
        </div>

    </Dialog>
  )
}