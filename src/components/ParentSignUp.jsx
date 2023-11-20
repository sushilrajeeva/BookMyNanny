import React, { useContext, useState } from "react";
import { Navigate } from "react-router-dom";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import DatePickerFormInput from "./DatePicker";
import { Formik, Form, Field } from "formik";
import moment from "moment";
import {
  doCreateUserWithEmailAndPassword,
  createUserDocument,
  createParentDocument,
} from "../firebase/AuthFunctions";
import { AuthContext } from "../context/AuthContext";
import { AlertContext } from "../context/AlertContext";
import "react-phone-input-2/lib/style.css";
import { isPossiblePhoneNumber, parsePhoneNumber } from "libphonenumber-js";
import { parentSchema } from "../schemas/parentsignup";
import { validateDate, passwordMatch } from "../helpers";

const schema = parentSchema;

function ParentSignUp() {
  const { currentUser } = useContext(AuthContext);
  const { showAlert } = useContext(AlertContext);
  // const [phone, setPhone] = useState("");
  // const [isValid, setIsValid] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  // const handleChange = (value, country) => {
  //   setPhone(value);
  //   setCountryCode(country.countryCode);
  //   validatePhoneNumber(value, country.countryCode);
  // };

  // const validatePhoneNumber = (phone, countryCode) => {
  //   console.log(phone);
  //   try {
  //     const phoneNumberObj = parsePhoneNumber(phone, countryCode.toUpperCase());
  //     const phoneValidate = isPossiblePhoneNumber(
  //       phoneNumberObj.formatNational(),
  //       countryCode.toUpperCase()
  //     );
  //     console.log("FORMAT", phoneNumberObj.number);
  //     console.log("BANGER", isPossiblePhoneNumber("674847363", "US"));
  //     if (phoneValidate) {
  //       setIsValid(true);
  //     } else {
  //       setIsValid(false);
  //     }
  //   } catch (e) {
  //     setIsValid(false);
  //   }
  // };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handlePassword = (e) => {
    e.preventDefault();
  };

  const handleSignUpParent = async (values, setSubmitting) => {
    setSubmitting(true);
    const {
      displayName,
      email,
      passwordOne,
      passwordTwo,
      firstName,
      lastName,
      phoneNumber,
      street,
      city,
      state,
      country,
      pincode,
      dob,
    } = values;

    // Validate the entire form
    // const newFormErrors = await validateForm(values);
    // setFormErrors(newFormErrors);
    // if (Object.keys(newFormErrors).length > 0) {
    //   showAlert("error", "Please fix the errors in the form.");
    //   return;
    // }
    // setFormErrors({});

    try {
      // Create user in Firebase Authentication
      let createdUid = await doCreateUserWithEmailAndPassword(
        email,
        passwordOne,
        displayName
      );
      console.log("created uid", createdUid);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      //todo need to hash password
      // if(!currentUser) throw "no usercreds to do crud"
      //await getNannyDocs()
      let dataToStore = {
        firstName: firstName,
        lastName: lastName,
        emailAddress: email,
        countryCode: "+1",
        phoneNumber: phoneNumber,
        street: street,
        city: city,
        state: state,
        country: country,
        pincode: pincode,
        dob: dob,
        role: "parent",
        password: passwordOne,
        listings: [],
        wallet: 0,
      };
      console.log("From signup component data:", dataToStore);
      // Create document in Firestore parent collection
      await createParentDocument(createdUid, dataToStore);
      // Create document in Firestore user collection
      await createUserDocument(createdUid, { role: "parent" });
    } catch (error) {
      console.log(error);
      // alert(error);
      showAlert("error", error.message || "Unexpected error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  if (currentUser) {
    return <Navigate to="/home" />;
  }

  return (
    <Box>
      <Box
        sx={{
          minHeight: "60vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 4,
        }}
      >
        <Formik
          initialValues={{
            displayName: "",
            email: "",
            passwordOne: "",
            passwordTwo: "",
            firstName: "",
            lastName: "",
            phoneNumber: "",
            street: "",
            city: "",
            state: "",
            country: "",
            pincode: "",
            dob: "",
          }}
          validationSchema={schema}
          validate={(values) => {
            const errors = {};
            if (values.dob) {
              if (!validateDate(values.dob))
                errors.dob = "You must be between 13-100 years in age";
            }
            if (values.passwordOne && values.passwordTwo) {
              if (!passwordMatch(values.passwordOne, values.passwordTwo))
                errors.passwordTwo = "Passwords do not match";
            }

            return errors;
          }}
          onSubmit={async (values, { setSubmitting }) => {
            handleSignUpParent(values, setSubmitting);
          }}
        >
          {({
            values,
            errors,
            touched,
            setFieldValue,
            handleChange,
            handleBlur,
            isSubmitting,
          }) => (
            <Form>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 2,
                  minWidth: "500px",
                  padding: "2rem",
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                  backgroundColor: "#fff",
                }}
              >
                <Typography
                  variant="h2"
                  component="h3"
                  sx={{ textTransform: "uppercase" }}
                >
                  Sign Up as a parent
                </Typography>

                {/* <form onSubmit={handleSignUpParent}>
            <div className="form-group">
              <label>
                Name:
                <br />
                <input
                  className="form-control"
                  required
                  name="displayName"
                  type="text"
                  placeholder="Name"
                  autoFocus={true}
                />
              </label>
            </div> */}
                <TextField
                  variant="standard"
                  label="Name"
                  name="displayName"
                  value={values.displayName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.displayName && Boolean(errors.displayName)}
                  helperText={touched.displayName && errors.displayName}
                  fullWidth
                  required
                />
                {/* <div className="form-group">
              <label>
                Email:
                <br />
                <input
                  className="form-control"
                  required
                  name="email"
                  type="email"
                  placeholder="Email"
                />
              </label>
            </div> */}
                <TextField
                  variant="standard"
                  label="Email"
                  name="email"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.email && Boolean(errors.email)}
                  helperText={touched.email && errors.email}
                  fullWidth
                  required
                />
                {/* <div className="form-group">
              <label>
                Password:
                <br />
                <input
                  className="form-control"
                  id="passwordOne"
                  name="passwordOne"
                  type="password"
                  placeholder="Password"
                  autoComplete="off"
                  required
                />
              </label>
            </div>
            <div className="form-group">
              <label>
                Confirm Password:
                <br />
                <input
                  className="form-control"
                  name="passwordTwo"
                  type="password"
                  placeholder="Confirm Password"
                  autoComplete="off"
                  required
                />
              </label>
            </div> */}
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

                {/* <div className="form-group">
              <label>
                First Name:
                <br />
                <input
                  className="form-control"
                  required
                  name="firstName"
                  type="text"
                  placeholder="First Name"
                />
              </label>
            </div>

            <div className="form-group">
              <label>
                Last Name:
                <br />
                <input
                  className="form-control"
                  required
                  name="lastName"
                  type="text"
                  placeholder="Last Name"
                />
              </label>
            </div> */}
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
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.lastName && Boolean(errors.lastName)}
                    helperText={touched.lastName && errors.lastName}
                    fullWidth
                    required
                  />
                </Stack>
                {/* <div className="form-group">
              <label>
                Phone Number:
                <br />
                <PhoneInput
                  country={"us"}
                  className="form-control"
                  inputProps={{ required: true }}
                  name="phoneNumber"
                  type="text"
                  onChange={handleChange}
                  value={phone}
                  placeholder="Phone Number"
                />
              </label>
              {!isValid && <p>Enter valid 10 digits</p>}
            </div> */}
                <TextField
                  variant="standard"
                  label="Phone Number"
                  name="phoneNumber"
                  value={values.phoneNumber}
                  onChange={(e) => {
                    let number = e.target.value;
                    console.log("HERE", number);
                    number = number.replace(/\D/g, "");
                    number = number.replace(/[()-\s]/g, "");
                    if (number.length > 10) return;
                    const firstThree = number.substring(0, 3);
                    const secondThree = number.substring(3, 6);
                    const lastFour = number.substring(6);
                    let formattedNumber = "";
                    if (number.length > 3) {
                      formattedNumber += `(${firstThree}) ${secondThree}`;
                      if (number.length > 6) formattedNumber += `-${lastFour}`;
                    } else formattedNumber = firstThree;
                    setFieldValue("phoneNumber", formattedNumber);
                  }}
                  onBlur={handleBlur}
                  error={touched.phoneNumber && Boolean(errors.phoneNumber)}
                  helperText={touched.phoneNumber && errors.phoneNumber}
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">+1</InputAdornment>
                    ),
                  }}
                  required
                />
                {/* <div className="form-group">
              <label>
                Street:
                <br />
                <input
                  className="form-control"
                  required
                  name="street"
                  type="text"
                  placeholder="Street"
                />
              </label>
            </div> */}
                <TextField
                  variant="standard"
                  label="Street"
                  name="street"
                  value={values.street}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.street && Boolean(errors.street)}
                  helperText={touched.street && errors.street}
                  fullWidth
                  required
                />

                {/* <div className="form-group">
              <label>
                City:
                <br />
                <input
                  className="form-control"
                  required
                  name="city"
                  type="text"
                  placeholder="City"
                />
              </label>
            </div>

            <div className="form-group">
              <label>
                State:
                <br />
                <input
                  className="form-control"
                  required
                  name="state"
                  type="text"
                  placeholder="State"
                />
              </label>
            </div> */}
                {/* <div className="form-group">
              <label>
                Country:
                <br />
                <input
                  className="form-control"
                  required
                  name="country"
                  type="text"
                  placeholder="Country"
                />
              </label>
            </div> */}
                <TextField
                  variant="standard"
                  label="City"
                  name="city"
                  value={values.city}
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
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.country && Boolean(errors.country)}
                    helperText={touched.country && errors.country}
                    fullWidth
                    required
                  />
                </Stack>

                {/*  */}

                {/* <div className="form-group">
              <label>
                Pincode:
                <br />
                <input
                  className="form-control"
                  required
                  name="pincode"
                  type="text"
                  placeholder="Pincode"
                />
              </label>
            </div> */}
                <TextField
                  variant="standard"
                  label="Pincode"
                  name="pincode"
                  value={values.pincode}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.pincode && Boolean(errors.pincode)}
                  helperText={touched.pincode && errors.pincode}
                  fullWidth
                  required
                />

                {/* <div className="form-group">
              <label>
                Date of Birth:
                <br />
                <input
                  className="form-control"
                  required
                  name="dob"
                  type="date"
                  placeholder="Date of Birth"
                />
              </label>
            </div> */}
                <Field
                  name="dob"
                  component={DatePickerFormInput}
                  label="Date of Birth"
                  maxDate={moment().subtract(13, "y")}
                  required
                />

                {/* <button
              className="button"
              id="submitButton"
              name="submitButton"
              type="submit"
            >
              Sign Up
            </button> */}
                <Button
                  variant="contained"
                  type="submit"
                  sx={{
                    height: "3rem",
                    width: "10rem",
                  }}
                  disabled={!!(isSubmitting || Object.keys(errors).length > 0)}
                >
                  {isSubmitting ? <CircularProgress size={24} /> : "Sign Up"}
                </Button>
              </Box>
            </Form>
          )}
        </Formik>
        {/* <Typography>
          Already a user?{" "}
          <Button
            type="button"
            onClick={() => {
              Navigate("/signin");
            }}
          >
            Log In
          </Button>
        </Typography> */}
      </Box>
    </Box>
  );
}
export default ParentSignUp;
