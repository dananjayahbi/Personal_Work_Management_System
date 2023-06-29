import React from "react";
import { Button } from "@mui/material";

const ButtonWrapper = ({ children, ...otherProps }) => {
  const configBtn = {
    ...otherProps,
    variant: "outlined",
  };

  return (
    <Button
      {...configBtn}
      sx={{
        padding: "6px 20px",
        borderRadius: "10px",
        border: "1px solid #1e6907",
        color: "#1e6907",
        "&:last-child td, &:last-child th": { border: 0 },
        "&:hover": {
          backgroundColor: "#1e6907",
          color: "var(--white)",
          border: "1px solid var(--white)",
        },
      }}
    >
      {children}
    </Button>
  );
};

export default ButtonWrapper;
