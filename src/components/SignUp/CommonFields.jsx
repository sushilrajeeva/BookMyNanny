import React, { useState } from "react";
import DatePickerFormInput from "../DatePicker";
import AdressFields from "../AdressFields";
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

      <AdressFields
        values={values}
        handleChange={handleChange}
        handleBlur={handleBlur}
        touched={touched}
        errors={errors}
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
