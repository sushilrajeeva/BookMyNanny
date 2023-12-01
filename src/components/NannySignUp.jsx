import React, { useContext, useState } from "react";
import { Navigate } from "react-router-dom";
import { Box, Button, CircularProgress, Typography } from "@mui/material";
import { Formik, Form } from "formik";
import {
  doCreateUserWithEmailAndPassword,
  createNannyDocument,
  createUserDocument,
} from "../firebase/AuthFunctions.js";
import { AuthContext } from "../context/AuthContext.jsx";
import { AlertContext } from "../context/AlertContext";
import { nannySchema } from "../schemas/nannysignup.jsx";
import { validateDate, passwordMatch } from "../helpers";
import CommonSignUpFields from "./SignUp/CommonFields";
import NannyFields from "./SignUp/NannyFields.jsx";
import moment from "moment";

const schema = nannySchema;

function NannySignUp() {
  const { currentUser } = useContext(AuthContext);
  const { showAlert } = useContext(AlertContext);

  const handleSignUpNanny = async (values, setSubmitting) => {
    setSubmitting(true);

    let {
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
      experience,
      bio,
      ssn,
    } = values;
    ssn = ssn.replace(/\D/g, "");

    try {
      // Create user in Firebase Authentication
      let createdUid = await doCreateUserWithEmailAndPassword(
        email,
        passwordOne,
        displayName
      );
      console.log("created uid", createdUid);

      // Add a delay to simulate asynchronous operations
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Create data object for storing in Firestore
      let dataToStore = {
        displayName: displayName.trim(),
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        emailAddress: email.trim(),
        countryCode: "+1",
        phoneNumber: phoneNumber,
        street: street.trim(),
        city: city.trim(),
        state: state.trim(),
        country: country.trim(),
        pincode: pincode,
        password: passwordOne.trim(),
        dob: dob,
        experience,
        bio: bio.trim(),
        ssn,
        countryCode: "+1",
        role: "nanny",
        verified: false,
        documents: [],
        wallet: 0,
        image: "",
      };

      console.log("From signup component data:", dataToStore);

      // Create document in Firestore nanny collection
      await createNannyDocument(createdUid, dataToStore);
      // Create document in Firestore user collection
      await createUserDocument(createdUid, { role: "nanny" });
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        showAlert("error", "Email address is already in use.");
      } else if (error.code === "auth/invalid-email") {
        showAlert("error", "Invalid email address.");
      } else if (error.code === "auth/weak-password") {
        showAlert("error", "Password is too weak.");
      } else {
        // Handle other types of errors or provide a generic message
        showAlert("error", error.message || "Unexpected error occurred");
      }
    } finally {
      setSubmitting(false);
    }
  };
  if (currentUser) {
    return <Navigate to="/home" />;
  }

  //nanny signup return
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
            ssn: "",
            experience: "",
            bio: "",
          }}
          validationSchema={schema}
          validate={(values) => {
            const errors = {};
            if (values.dob) {
              const minDate = moment().subtract(100, "y");
              const maxDate = moment().subtract(13, "y");
              if (!validateDate(values.dob, minDate, maxDate))
                errors.dob = "You must be between 13-100 years in age";
            }
            if (values.passwordOne && values.passwordTwo) {
              if (!passwordMatch(values.passwordOne, values.passwordTwo))
                errors.passwordTwo = "Passwords do not match";
            }
            if (values.ssn) {
              const ssn = values.ssn.replace(/\D/g, "");
              const firstThree = ssn.substring(0, 3);
              const secondTwo = ssn.substring(3, 5);
              const lastFour = ssn.substring(5);

              if (!/^(?!000|666|9\d{2})\d{3}$/.test(firstThree)) {
                errors.ssn =
                  "First three digits should not be 000, 666, or between 900 and 999.";
              } else if (!/^(?!00)\d{2}$/.test(secondTwo)) {
                errors.ssn = "Fourth and Fifth digit should be from 01 to 99.";
              } else if (!/^(?!0{4})\d{4}$/.test(lastFour)) {
                errors.ssn = "Last four digits should be from 0001 to 9999";
              }
            }
            return errors;
          }}
          onSubmit={async (values, { setSubmitting }) => {
            handleSignUpNanny(values, setSubmitting);
          }}
        >
          {({
            values,
            errors,
            touched,
            setFieldValue,
            setFieldError,
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
                  Sign Up as a nanny
                </Typography>
                <CommonSignUpFields
                  values={values}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  touched={touched}
                  errors={errors}
                  setFieldValue={setFieldValue}
                  setFieldError={setFieldError}
                />
                <NannyFields
                  values={values}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  touched={touched}
                  errors={errors}
                  setFieldValue={setFieldValue}
                  setFieldError={setFieldError}
                />
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
      </Box>
    </Box>
  );
}
export default NannySignUp;
