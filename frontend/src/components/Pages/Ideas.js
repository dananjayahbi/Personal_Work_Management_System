import React from "react";
import { useEffect, useState } from "react";
import "../../styles/dashboard.css";
import axios from "axios";
import AddIdea from '../PageComponents/AddIdea';
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";


export default function Ideas() {

  const[fetIdeas, fetchedIdeas] = React.useState([]);


//Get all products
useEffect(() => {
  setTimeout(() => {
    axios
      .get("http://localhost:8070/ideas/getAllIdeas", {
      })
      .then((res) => {
        fetchedIdeas(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, 500);
}, []);

//The popup
const [openPopup3, setOpenPopup3] = useState(false);


  return(
    <>
      <div className="d-flex justify-content-cneter">
        {/*Add User button*/}
          <Button
            startIcon={<AddIcon />}
            variant="outlined"
            sx={{
              border: "1px solid #1e6907",
              color: "#1e6907",
              "&:last-child td, &:last-child th": { border: 0 },
              "&:hover": {
                backgroundColor: "#1e6907",
                color: "var(--white)",
                border: "1px solid var(--white)",
              },
              marginBottom: "25px",
            }}
            onClick={() => {
              setOpenPopup3(true); // open the popup
            }}
          >
            Add User
          </Button>

          <AddIdea openPopup3={openPopup3} setOpenPopup3={setOpenPopup3}></AddIdea>
      </div>
    </>
    
  )
}