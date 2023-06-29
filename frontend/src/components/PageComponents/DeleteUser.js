import "../../styles/dashboard.css";
import axios from "axios";


export default function DeleteUser(useUID) {


    console.log(useUID);
    axios
      .delete(`http://localhost:8070/user/deleteUser/${useUID}`, {
      })
      .then((res) => {
        sessionStorage.setItem("userDeleted", "1");
        window.location.reload(false);

      })
      .catch((err) => {
        console.log(err);
      });
  }

