import React from "react";
import { FormControl } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import moment from "moment";
// import { FieldProps } from "formik";

const DatePickerInput = ({
  field,
  form: { setFieldValue, errors, touched, handleBlur },
  label,
  disabled = false,
  minDate = moment().subtract(100, "y"),
  maxDate = moment(),
  required = false,
}) => {
  return (
    <FormControl fullWidth>
      <LocalizationProvider dateAdapter={AdapterMoment}>
        <DatePicker
          label={label}
          disabled={disabled}
          value={field.value ? moment(field.value, "MM-DD-YYYY") : null}
          format="MM-DD-YYYY"
          minDate={minDate}
          maxDate={maxDate}
          onChange={(newValue) => {
            setFieldValue(
              field.name,
              newValue ? newValue.format("MM-DD-YYYY") : null
            );
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

export default DatePickerInput;
