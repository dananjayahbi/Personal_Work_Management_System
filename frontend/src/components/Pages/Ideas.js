import React from "react";
import { useEffect } from "react";
import "../../styles/dashboard.css";
import axios from "axios";


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


  return(
    <>
      <div className="d-flex justify-content-cneter">
        Hello world
      </div>
    </>
    
  )
}