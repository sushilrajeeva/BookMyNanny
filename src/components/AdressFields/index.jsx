import React from "react";
import { Stack, TextField } from "@mui/material";

const AdressFields = ({
  values,
  handleChange,
  handleBlur,
  touched,
  errors,
}) => {
  return (
    <>
      <TextField
        variant="standard"
        label="Street"
        name="street"
        value={values.street}
        onInput={(e) => {
          handleChange(e);
          setTimeout(() => handleBlur(e), 0);
        }}
        onChange={handleChange}
        onBlur={handleBlur}
        error={touched.street && Boolean(errors.street)}
        helperText={touched.street && errors.street}
        fullWidth
        required
      />

      <TextField
        variant="standard"
        label="City"
        name="city"
        value={values.city}
        onInput={(e) => {
          handleChange(e);
          setTimeout(() => handleBlur(e), 0);
        }}
        onChange={handleChange}
        onBlur={handleBlur}
        error={touched.city && Boolean(errors.city)}
        helperText={touched.city && errors.city}
        fullWidth
        required
      />
      <Stack
        direction="row"
        spacing={2}
        sx={{
          width: "100%",
        }}
      >
        <TextField
          variant="standard"
          label="State"
          name="state"
          value={values.state}
          onInput={(e) => {
            handleChange(e);
            setTimeout(() => handleBlur(e), 0);
          }}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.state && Boolean(errors.state)}
          helperText={touched.state && errors.state}
          fullWidth
          required
        />
        <TextField
          variant="standard"
          label="Country"
          name="country"
          value={values.country}
          onInput={(e) => {
            handleChange(e);
            setTimeout(() => handleBlur(e), 0);
          }}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.country && Boolean(errors.country)}
          helperText={touched.country && errors.country}
          fullWidth
          required
        />
      </Stack>

      <TextField
        sx={{ marginBottom: "15px" }}
        variant="standard"
        label="Pincode"
        name="pincode"
        value={values.pincode}
        onInput={(e) => {
          handleChange(e);
          setTimeout(() => handleBlur(e), 0);
        }}
        onChange={handleChange}
        onBlur={handleBlur}
        error={touched.pincode && Boolean(errors.pincode)}
        helperText={touched.pincode && errors.pincode}
        fullWidth
        required
      />
    </>
  );
};

export default AdressFields;
