import React from "react";
import { useFormikContext } from "formik";
import { Button } from "@mui/material";

const SubmitButton = ({ children, ...otherProps }) => {
  const { submitForm } = useFormikContext();

  const handleSubmit = () => {
    submitForm();
  };

  const configBtn = {
    ...otherProps,
    variant: "contained",
    onClick: handleSubmit,
  };

  return (
    <Button
      {...configBtn}
      sx={{
        padding: "6px 20px",
        borderRadius: "10px",
        backgroundColor: "#1e6907",
        border: "1px solid #1e6907",
        color: "var(--white)",
        "&:last-child td, &:last-child th": { border: 0 },
        "&:hover": {
          backgroundColor: "var(--transparent)",
          color: "#1e6907",
        },
      }}
    >
      {children}
    </Button>
  );
};

export default SubmitButton;
