import React, { useContext, useState } from "react";
import { Navigate } from "react-router-dom";
import { Box, Button, CircularProgress, Typography } from "@mui/material";
import { Formik, Form } from "formik";
import moment from "moment";

import {
  doCreateUserWithEmailAndPassword,
  createUserDocument,
  createParentDocument,
} from "../firebase/AuthFunctions";
import { AuthContext } from "../context/AuthContext";
import { AlertContext } from "../context/AlertContext";
import { parentSchema } from "../schemas/parentsignup";
import { validateDate, passwordMatch } from "../helpers";
import CommonSignUpFields from "./SignUp/CommonFields";

const schema = parentSchema;

function ParentSignUp() {
  const { currentUser } = useContext(AuthContext);
  const { showAlert } = useContext(AlertContext);

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
        dob: dob,
        role: "parent",
        password: passwordOne.trim(),
        wallet: 0,
        image: "",
      };
      console.log("From signup component data:", dataToStore);
      // Create document in Firestore parent collection
      await createParentDocument(createdUid, dataToStore);
      // Create document in Firestore user collection
      await createUserDocument(createdUid, { role: "parent" });
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
              const minDate = moment().subtract(100, "y");
              const maxDate = moment().subtract(13, "y");
              if (!validateDate(values.dob, minDate, maxDate))
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
                <CommonSignUpFields
                  values={values}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  touched={touched}
                  errors={errors}
                  setFieldValue={setFieldValue}
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
export default ParentSignUp;
