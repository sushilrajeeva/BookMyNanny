// CommonSignUpFields.jsx
import React, { useState } from "react";
import DatePickerFormInput from "../DatePicker";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { IconButton, InputAdornment, Stack, TextField } from "@mui/material";
import { Field } from "formik";
import moment from "moment";

const CommonSignUpFields = ({
  values,
  handleChange,
  handleBlur,
  touched,
  errors,
  setFieldValue,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handlePassword = (e) => {
    e.preventDefault();
  };
  return (
    <>
      <TextField
        variant="standard"
        label="Name"
        name="displayName"
        value={values.displayName}
        onInput={(e) => {
          handleChange(e);
          setTimeout(() => handleBlur(e), 0);
        }}
        onChange={handleChange}
        onBlur={handleBlur}
        error={touched.displayName && Boolean(errors.displayName)}
        helperText={touched.displayName && errors.displayName}
        fullWidth
        required
      />
      <TextField
        variant="standard"
        label="Email"
        name="email"
        value={values.email}
        onInput={(e) => {
          handleChange(e);
          setTimeout(() => handleBlur(e), 0);
        }}
        onChange={handleChange}
        onBlur={handleBlur}
        error={touched.email && Boolean(errors.email)}
        helperText={touched.email && errors.email}
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
          label="Password"
          name="passwordOne"
          type={showPassword ? "text" : "password"}
          value={values.passwordOne}
          onInput={(e) => {
            handleChange(e);
            setTimeout(() => handleBlur(e), 0);
          }}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.passwordOne && Boolean(errors.passwordOne)}
          helperText={touched.passwordOne && errors.passwordOne}
          fullWidth
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handlePassword}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
          required
        />
        <TextField
          variant="standard"
          label="Confirm Password"
          name="passwordTwo"
          type={showPassword ? "text" : "password"}
          value={values.passwordTwo}
          onInput={(e) => {
            handleChange(e);
            setTimeout(() => handleBlur(e), 0);
          }}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.passwordTwo && Boolean(errors.passwordTwo)}
          helperText={touched.passwordTwo && errors.passwordTwo}
          fullWidth
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handlePassword}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
          required
        />
      </Stack>
      <Stack
        direction="row"
        spacing={2}
        sx={{
          width: "100%",
        }}
      >
        <TextField
          variant="standard"
          label="First Name"
          name="firstName"
          value={values.firstName}
          onInput={(e) => {
            handleChange(e);
            setTimeout(() => handleBlur(e), 0);
          }}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.firstName && Boolean(errors.firstName)}
          helperText={touched.firstName && errors.firstName}
          fullWidth
          required
        />
        <TextField
          variant="standard"
          label="Last Name"
          name="lastName"
          value={values.lastName}
          onInput={(e) => {
            handleChange(e);
            setTimeout(() => handleBlur(e), 0);
          }}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.lastName && Boolean(errors.lastName)}
          helperText={touched.lastName && errors.lastName}
          fullWidth
          required
        />
      </Stack>

      <TextField
        variant="standard"
        label="Phone Number"
        name="phoneNumber"
        value={values.phoneNumber}
        onChange={(e) => {
          let number = e.target.value;
          if (number.length > 10) return;

          setFieldValue("phoneNumber", number);
        }}
        onInput={(e) => {
          handleChange(e);
          setTimeout(() => handleBlur(e), 0);
        }}
        onBlur={handleBlur}
        error={touched.phoneNumber && Boolean(errors.phoneNumber)}
        helperText={touched.phoneNumber && errors.phoneNumber}
        fullWidth
        InputProps={{
          startAdornment: <InputAdornment position="start">+1</InputAdornment>,
        }}
        required
      />

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

      <Field
        name="dob"
        component={DatePickerFormInput}
        label="Date of Birth"
        maxDate={moment().subtract(13, "y")}
        required
      />
    </>
  );
};

export default CommonSignUpFields;
