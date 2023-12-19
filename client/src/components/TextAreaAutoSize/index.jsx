import React from "react";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/system";

// Create a styled component for the TextareaAutosize
const CustomTextarea = styled(TextareaAutosize)(
  () => `
  width: 320px;
  font-family: IBM Plex Sans, sans-serif;
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1.5;
  padding: 8px 12px;
  border-radius: 8px;
  color: #1C2025;
  background: #fff;
  border: 1px solid #DAE2ED;
  box-shadow: 0px 2px 2px #F3F6F9;
  };

  &:hover {
    border-color: #3399FF;
  }

  &:focus {
    border-color: #3399FF;
    
  }

  // firefox
  &:focus-visible {
    outline: 0;
  }
  `
);

const CustomTextareaAutosize = ({
  label,
  minRows,
  name,
  placeholder,
  value,
  onInput,
  onChange,
  onBlur,
  required,
  error,
}) => (
  <div>
    {/* Use the CustomTextarea styled component */}
    <CustomTextarea
      aria-label={label}
      minRows={minRows}
      name={name}
      placeholder={placeholder}
      value={value}
      onInput={(e) => {
        onInput(e);
        setTimeout(() => onBlur(e), 0);
      }}
      onChange={onChange}
      onBlur={onBlur}
      required={required}
      style={{ width: "100%", marginTop: "16px", border: "1px solid black" }}
    />

    {error && (
      <Typography variant="caption" color="error" textAlign="left">
        {error}
      </Typography>
    )}
  </div>
);

export default CustomTextareaAutosize;
