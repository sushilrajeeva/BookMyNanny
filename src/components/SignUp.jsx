import React, { useState } from "react";
import ParentSignUp from "./ParentSignUp"; // Import your ParentSignUp component
import NannySignUp from "./NannySignUp"; // Import your NannySignUp component
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
const SignUp = () => {
  const [alignment, setAlignment] = useState("parent");

  const handleChange = (event, newAlignment) => {
    setAlignment(newAlignment);
  };

  return (
    <div>
      <ToggleButtonGroup
        color="primary"
        value={alignment}
        exclusive
        onChange={handleChange}
        aria-label="Platform"
      >
        <ToggleButton value="parent">Parent Sign Up </ToggleButton>
        <ToggleButton value="nanny">Nanny Sign Up</ToggleButton>
      </ToggleButtonGroup>
      {alignment === "parent" ? <ParentSignUp /> : <NannySignUp />}
    </div>
  );
};

export default SignUp;
