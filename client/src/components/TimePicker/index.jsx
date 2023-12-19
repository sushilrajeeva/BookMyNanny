import React from "react";
import { FormControl } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";

const TimePickerFormInput = ({
  field,
  form: { setFieldValue, errors, touched, handleBlur },
  label,
  disabled = false,
  required = false,
}) => {
  return (
    <FormControl>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <TimePicker
          label={label}
          disabled={disabled}
          value={field.value ? field.value : null}
          // format="MM-DD-YYYY"
          onChange={(newValue) => {
            setFieldValue(field.name, newValue ? newValue : null);
          }}
          slotProps={{
            textField: {
              name: field.name,
              error: touched[field.name] && Boolean(errors[field.name]),
              helperText: touched[field.name] && errors[field.name],
              required,
              onBlur: handleBlur,
            },
          }}
        />
      </LocalizationProvider>
    </FormControl>
  );
};

export default TimePickerFormInput;
